/* eslint-disable @typescript-eslint/no-var-requires */
import type { ShroomiesInstance } from '../types/truffle-contracts';

const truffleAssert = require('truffle-assertions');

const Shroomies = artifacts.require('Shroomies');
const Signer = artifacts.require('VerifySignature');

export {};

interface MintTransaction {
    minter: string;
    quantity: number;
    mainCollection: boolean;
    nonce: number;
}

interface BatchMintTransaction {
    batchId: string;
    mainCollection: boolean;
    batchSize: number;
    minter: string;
}

const getShroomiesInstance = async (
    wlStart: number,
    wlEnd: number,
    publicStart: number,
    mintPrice = 4,
    publicTransMax = 10,
    supply = 8888,
    mainSupply = 8000
) => {
    Shroomies.link(Signer);

    const signer = web3.eth.accounts.create();
    const { address: signerAddress } = signer;
    const signatureVerifierInstance = await Signer.new();
    const shroomiesInstance = await Shroomies.new(
        supply,
        mainSupply,
        publicTransMax,
        mintPrice,
        signerAddress,
        wlStart,
        wlEnd,
        publicStart
    );

    return {
        shroomiesInstance,
        signatureVerifierInstance,
        signer,
        mintPrice,
        publicTransMax,
        supply,
        mainSupply,
    };
};

const getUserWhitelistSignedMessage =
    (
        contract: ShroomiesInstance,
        signer: ReturnType<Web3['eth']['accounts']['create']>
    ) =>
    async (transaction: MintTransaction) => {
        const { mainCollection, minter, quantity, nonce } = transaction;

        const messageHash = await contract.getUserWhitelistHash(
            minter,
            quantity,
            mainCollection,
            nonce
        );
        return signer.sign(messageHash);
    };

const getBatchWhitelistSignedMessage =
    (
        contract: ShroomiesInstance,
        signer: ReturnType<Web3['eth']['accounts']['create']>
    ) =>
    async (trans: BatchMintTransaction) => {
        const { minter, batchId, mainCollection, batchSize } = trans;

        const messageHash = await contract.getWhitelistPasswordHash(
            minter,
            batchId,
            mainCollection,
            batchSize
        );
        return signer.sign(messageHash);
    };

contract('Shroomies Mud Club', (accounts) => {
    it('constructs', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const {
            shroomiesInstance,
            mintPrice,
            publicTransMax,
            supply,
            mainSupply,
        } = await getShroomiesInstance(now, later, now);

        assert.equal(
            (await shroomiesInstance.maxSupply()).toString(),
            supply.toString()
        );
        assert.equal(
            (await shroomiesInstance.mainCollectionSize()).toString(),
            mainSupply.toString()
        );
        assert.equal(
            (await shroomiesInstance.mintPrice()).toString(),
            mintPrice.toString()
        );
        assert.equal(
            (await shroomiesInstance.whitelistMint())[0].toString(),
            now.toString()
        );
        assert.equal(
            (await shroomiesInstance.whitelistMint())[1].toString(),
            later.toString()
        );
        assert.equal(
            (await shroomiesInstance.publicMint())[0].toString(),
            now.toString()
        );
        assert.equal(
            (await shroomiesInstance.publicMint())[1].toString(),
            publicTransMax.toString()
        );
    });

    it('calls setMainBaseURI', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, supply, mainSupply } =
            await getShroomiesInstance(now, later, now);

        await truffleAssert.fails(
            shroomiesInstance.setMainBaseURI('test', { from: accounts[1] }) // wrong addr
        );

        await shroomiesInstance.setMainBaseURI('test');

        // mint to access uris
        await shroomiesInstance.ownerMintTo([1], [accounts[0]], true);

        const firstMain = supply - mainSupply + 1;

        await truffleAssert.fails(
            shroomiesInstance.tokenURI(1) // not minted
        );

        assert.equal(
            await shroomiesInstance.tokenURI(firstMain),
            `test${firstMain}`
        );
    });

    it('calls setSecondaryBaseURI', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.setSecondaryBaseURI('test', { from: accounts[1] }) // wrong addr
        );

        await shroomiesInstance.setSecondaryBaseURI('test');

        // mint to access uris
        await shroomiesInstance.ownerMintTo([1], [accounts[0]], false);

        await truffleAssert.fails(
            shroomiesInstance.tokenURI(2) // not minted
        );

        assert.equal(await shroomiesInstance.tokenURI(1), `test${1}`);
    });

    it('calls setSigner', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.setSigner(web3.eth.accounts.create().address, {
                from: accounts[1],
            }) // wrong addr
        );

        await shroomiesInstance.setSigner(web3.eth.accounts.create().address);
    });

    it('calls updateWhitelistMint', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.updateWhitelistMint(1, 2, { from: accounts[1] }) // bad addr
        );
        await shroomiesInstance.updateWhitelistMint(1, 2);

        const newWlMint = await shroomiesInstance.whitelistMint();

        assert.equal(newWlMint[0].toString(), (1).toString());
        assert.equal(newWlMint[1].toString(), (2).toString());
    });

    it('calls updatePublicMint', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.updatePublicMint(2, 1, { from: accounts[1] }) // bad addr
        );
        await shroomiesInstance.updatePublicMint(2, 1);

        const newPubMint = await shroomiesInstance.publicMint();

        assert.equal(newPubMint[0].toString(), (1).toString());
        assert.equal(newPubMint[1].toString(), (2).toString());
    });

    it('calls updateMintPrice', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.updateMintPrice(1, { from: accounts[1] }) // bad acct
        );

        await shroomiesInstance.updateMintPrice(100);

        assert.equal((await shroomiesInstance.mintPrice()).toString(), '100');
    });

    it('calls updateMainCollectionMinting', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        assert.equal(await shroomiesInstance.mainCollectionMinting(), false);

        await shroomiesInstance.updateMainCollectionMinting(true);

        assert.equal(await shroomiesInstance.mainCollectionMinting(), true);
    });

    it('calls batchMintUpdate', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.batchMintUpdate(100, 100, 100, 100, 100, true, {
                from: accounts[1],
            }) // bad acct
        );

        await shroomiesInstance.batchMintUpdate(100, 100, 100, 100, 100, true);

        const mintPrice = await shroomiesInstance.mintPrice();
        const pubMint = await shroomiesInstance.publicMint();
        const wlMint = await shroomiesInstance.whitelistMint();
        const mainCollectionMinting =
            await shroomiesInstance.mainCollectionMinting();

        assert.equal(mintPrice.toString(), '100');
        assert.equal(pubMint[0].toString(), '100');
        assert.equal(pubMint[1].toString(), '100');
        assert.equal(wlMint[0].toString(), '100');
        assert.equal(wlMint[1].toString(), '100');
        assert.ok(mainCollectionMinting);
    });

    it('calls ownerMintTo (fails with bad sender)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            later,
            later + 1,
            later
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([1], [accounts[0]], true, {
                from: accounts[1],
            }) // bad sender
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([1], [accounts[0]], false, {
                from: accounts[1],
            }) // bad sender
        );
    });

    it('calls ownerMintTo (fails with mismatch arrays)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            later,
            later + 1,
            later
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([1], [accounts[0], accounts[1]], true) // bad parity
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo(
                [1],
                [accounts[0], accounts[1]],
                false
            ) // bad parity
        );
    });

    it('calls ownerMintTo (fails with exceeded remaining)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const mainSupply = 5;
        const maxSupply = 10;
        const { shroomiesInstance } = await getShroomiesInstance(
            later,
            later + 1,
            later,
            1,
            1,
            maxSupply,
            mainSupply
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([6], [accounts[0]], true) // too many
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([6], [accounts[0]], false) // too many
        );

        await shroomiesInstance.ownerMintTo([5], [accounts[0]], false); // max out secondary
        let balance = await shroomiesInstance.balanceOf(accounts[0]);

        assert.equal(balance.toString(), '5');

        await shroomiesInstance.ownerMintTo([5], [accounts[0]], true); // max out main
        balance = await shroomiesInstance.balanceOf(accounts[0]);

        assert.equal(balance.toString(), '10');

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([1], [accounts[0]], true) // too many
        );

        await truffleAssert.fails(
            shroomiesInstance.ownerMintTo([1], [accounts[0]], false) // too many
        );
    });

    it('calls ownerMintTo (succeeds, mints appropriate ids/updates counts)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const mainSupply = 5;
        const maxSupply = 10;
        const { shroomiesInstance } = await getShroomiesInstance(
            later,
            later + 1,
            later,
            1,
            1,
            maxSupply,
            mainSupply
        );

        await shroomiesInstance.ownerMintTo([2], [accounts[0]], true);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[0])).toString(),
            '2'
        );
        assert.equal(await shroomiesInstance.ownerOf(6), accounts[0]);
        assert.equal(await shroomiesInstance.ownerOf(7), accounts[0]);

        await shroomiesInstance.ownerMintTo([2], [accounts[1]], false);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[1])).toString(),
            '2'
        );
        assert.equal(await shroomiesInstance.ownerOf(1), accounts[1]);
        assert.equal(await shroomiesInstance.ownerOf(2), accounts[1]);

        await shroomiesInstance.ownerMintTo([2], [accounts[3]], true);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[3])).toString(),
            '2'
        );
        assert.equal(await shroomiesInstance.ownerOf(8), accounts[3]);
        assert.equal(await shroomiesInstance.ownerOf(9), accounts[3]);

        await shroomiesInstance.ownerMintTo([2], [accounts[4]], false);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[4])).toString(),
            '2'
        );
        assert.equal(await shroomiesInstance.ownerOf(3), accounts[4]);
        assert.equal(await shroomiesInstance.ownerOf(4), accounts[4]);

        assert.equal((await shroomiesInstance.totalSupply()).toString(), '8');
        assert.equal((await shroomiesInstance.mainMinted()).toString(), '4');
        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            '4'
        );
    });

    it('calls ownerMintTo (with multiple addresses)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );
        await shroomiesInstance.ownerMintTo(
            [2, 3, 4],
            [accounts[0], accounts[1], accounts[2]],
            false
        );

        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[0])).toString(),
            '2'
        );
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[1])).toString(),
            '3'
        );
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[2])).toString(),
            '4'
        );

        // ids for account 1
        assert.equal(await shroomiesInstance.ownerOf(1), accounts[0]);
        assert.equal(await shroomiesInstance.ownerOf(2), accounts[0]);

        // ids for account 2
        assert.equal(await shroomiesInstance.ownerOf(3), accounts[1]);
        assert.equal(await shroomiesInstance.ownerOf(4), accounts[1]);
        assert.equal(await shroomiesInstance.ownerOf(5), accounts[1]);

        // ids for account 3
        assert.equal(await shroomiesInstance.ownerOf(6), accounts[2]);
        assert.equal(await shroomiesInstance.ownerOf(7), accounts[2]);
        assert.equal(await shroomiesInstance.ownerOf(8), accounts[2]);
        assert.equal(await shroomiesInstance.ownerOf(9), accounts[2]);
    });

    it('calls burn (and reduces totalSupply)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );
        await shroomiesInstance.ownerMintTo([10], [accounts[0]], false);

        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[0])).toString(),
            '10'
        );
        assert.equal((await shroomiesInstance.totalSupply()).toString(), '10');

        await shroomiesInstance.burn(1);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[0])).toString(),
            '9'
        );
        assert.equal((await shroomiesInstance.totalSupply()).toString(), '9');

        await shroomiesInstance.burn(2);
        assert.equal(
            (await shroomiesInstance.balanceOf(accounts[0])).toString(),
            '8'
        );
        assert.equal((await shroomiesInstance.totalSupply()).toString(), '8');

        await truffleAssert.fails(
            shroomiesInstance.burn(2) // already burned
        );

        await truffleAssert.fails(
            shroomiesInstance.burn(3, { from: accounts[1] }) // not owned
        );
    });

    it('calls tokenURI (gets appropriate response for main versus secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now,
            1,
            10,
            8888,
            8000
        );

        await shroomiesInstance.setMainBaseURI('main/');
        await shroomiesInstance.setSecondaryBaseURI('secondary/');
        await shroomiesInstance.ownerMintTo([10], [accounts[0]], false);
        await shroomiesInstance.ownerMintTo([10], [accounts[0]], true);

        assert.equal(await shroomiesInstance.tokenURI(1), 'secondary/1');
        assert.equal(await shroomiesInstance.tokenURI(889), `main/889`);
    });

    it('calls getWhitelistMints (tracks the appropriate values)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const mainMintTransaction: MintTransaction = {
            quantity: 10,
            nonce: 2,
            minter: accounts[1],
            mainCollection: true,
        };
        const secondaryMintTransaction: MintTransaction = {
            ...mainMintTransaction,
            mainCollection: false,
            nonce: 1,
        };

        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).mainCollection.toString(),
            '0'
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).secondaryCollection.toString(),
            '0'
        );

        await shroomiesInstance.userWhitelistMint(
            secondaryMintTransaction.quantity,
            secondaryMintTransaction.mainCollection,
            secondaryMintTransaction.nonce,
            (
                await signTransaction(secondaryMintTransaction)
            ).signature,
            {
                from: secondaryMintTransaction.minter,
                value: (
                    mintPrice * secondaryMintTransaction.quantity
                ).toString(),
            }
        );

        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).mainCollection.toString(),
            '0'
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).secondaryCollection.toString(),
            secondaryMintTransaction.quantity.toString()
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        await shroomiesInstance.userWhitelistMint(
            mainMintTransaction.quantity,
            mainMintTransaction.mainCollection,
            mainMintTransaction.nonce,
            (
                await signTransaction(mainMintTransaction)
            ).signature,
            {
                from: mainMintTransaction.minter,
                value: (mintPrice * mainMintTransaction.quantity).toString(),
            }
        );

        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).mainCollection.toString(),
            mainMintTransaction.quantity.toString()
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).secondaryCollection.toString(),
            secondaryMintTransaction.quantity.toString()
        );
    });

    it('calls getUserWhitelistHash', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer } = await getShroomiesInstance(
            now,
            later,
            now
        );
        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const transaction: MintTransaction = {
            nonce: 1,
            minter: accounts[1],
            quantity: 1,
            mainCollection: false,
        };

        const { signature } = await signTransaction(transaction);

        assert.ok(!!signature);
    });

    it('calls getWhitelistPasswordHash', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer } = await getShroomiesInstance(
            now,
            later,
            now
        );
        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const { signature } = await signTransaction(batch);

        assert.ok(!!signature);
    });

    it('calls userWhitelistMint (fails due to invalid sig)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 10,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        // wrong sender
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: accounts[2],
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                } // bad sender
            )
        );

        // bad quantity
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity + 1, // bad quantity
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );

        // bad main collection flag
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                !secondaryMintTransaction.mainCollection, // bad flag
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );

        // bad nonce
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce + 1, // bad nonce
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to zero quantity)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 0, // zero quantity
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity, // zero quantity
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to reused nonce)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 10,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        await shroomiesInstance.userWhitelistMint(
            secondaryMintTransaction.quantity, // zero quantity
            secondaryMintTransaction.mainCollection,
            secondaryMintTransaction.nonce,
            signature.signature,
            {
                from: secondaryMintTransaction.minter,
                value: String(mintPrice * secondaryMintTransaction.quantity),
            }
        );
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to inactive mint)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(later, later + 100000, later);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 10,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to bad value)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 10,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity - 1
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to sellout secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction1: MintTransaction = {
            quantity: 5,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature1 = await signTransaction(secondaryMintTransaction1);

        // mint 5/5
        await shroomiesInstance.userWhitelistMint(
            secondaryMintTransaction1.quantity,
            secondaryMintTransaction1.mainCollection,
            secondaryMintTransaction1.nonce,
            signature1.signature,
            {
                from: secondaryMintTransaction1.minter,
                value: String(mintPrice * secondaryMintTransaction1.quantity),
            }
        );

        const secondaryMintTransaction2: MintTransaction = {
            quantity: 1,
            nonce: 2,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature2 = await signTransaction(secondaryMintTransaction2);
        // zero left
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction2.quantity,
                secondaryMintTransaction2.mainCollection,
                secondaryMintTransaction2.nonce,
                signature2.signature,
                {
                    from: secondaryMintTransaction2.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction2.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to sellout main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);
        await shroomiesInstance.updateMainCollectionMinting(true);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const mainMintTransaction1: MintTransaction = {
            quantity: 5,
            nonce: 1,
            minter: accounts[1],
            mainCollection: true,
        };

        const signature1 = await signTransaction(mainMintTransaction1);

        // mint 5/5
        await shroomiesInstance.userWhitelistMint(
            mainMintTransaction1.quantity,
            mainMintTransaction1.mainCollection,
            mainMintTransaction1.nonce,
            signature1.signature,
            {
                from: mainMintTransaction1.minter,
                value: String(mintPrice * mainMintTransaction1.quantity),
            }
        );

        const mainMintTransaction2: MintTransaction = {
            quantity: 1,
            nonce: 2,
            minter: accounts[1],
            mainCollection: true,
        };

        const signature2 = await signTransaction(mainMintTransaction2);
        // zero left
        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                mainMintTransaction2.quantity,
                mainMintTransaction2.mainCollection,
                mainMintTransaction2.nonce,
                signature2.signature,
                {
                    from: mainMintTransaction2.minter,
                    value: String(mintPrice * mainMintTransaction2.quantity),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to exceeding supply secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const secondaryMintTransaction: MintTransaction = {
            quantity: 8, // only 5 available
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const signature = await signTransaction(secondaryMintTransaction);

        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                secondaryMintTransaction.quantity,
                secondaryMintTransaction.mainCollection,
                secondaryMintTransaction.nonce,
                signature.signature,
                {
                    from: secondaryMintTransaction.minter,
                    value: String(
                        mintPrice * secondaryMintTransaction.quantity
                    ),
                }
            )
        );
    });

    it('calls userWhitelistMint (fails due to exceeding supply main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );
        const mainMintTransaction: MintTransaction = {
            quantity: 8, // only 5 available
            nonce: 1,
            minter: accounts[1],
            mainCollection: true,
        };

        const signature = await signTransaction(mainMintTransaction);

        await truffleAssert.fails(
            shroomiesInstance.userWhitelistMint(
                mainMintTransaction.quantity,
                mainMintTransaction.mainCollection,
                mainMintTransaction.nonce,
                signature.signature,
                {
                    from: mainMintTransaction.minter,
                    value: String(mintPrice * mainMintTransaction.quantity),
                }
            )
        );
    });

    it('calls userWhitelistMint (succeeds and increases counts)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getUserWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const secondaryMintTransaction: MintTransaction = {
            quantity: 8,
            nonce: 1,
            minter: accounts[1],
            mainCollection: false,
        };

        const mainMintTransaction: MintTransaction = {
            quantity: 8,
            nonce: 2,
            minter: accounts[1],
            mainCollection: true,
        };

        const secondarySignature = await signTransaction(
            secondaryMintTransaction
        );
        const mainSignature = await signTransaction(mainMintTransaction);

        await shroomiesInstance.userWhitelistMint(
            secondaryMintTransaction.quantity,
            secondaryMintTransaction.mainCollection,
            secondaryMintTransaction.nonce,
            secondarySignature.signature,
            {
                from: secondaryMintTransaction.minter,
                value: String(mintPrice * secondaryMintTransaction.quantity),
            }
        );

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            secondaryMintTransaction.quantity.toString()
        );
        assert.equal((await shroomiesInstance.mainMinted()).toString(), '0');
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            secondaryMintTransaction.quantity.toString()
        );
        assert.equal(
            (
                await shroomiesInstance.lastMintNonce(
                    secondaryMintTransaction.minter
                )
            ).toString(),
            secondaryMintTransaction.nonce.toString()
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        await shroomiesInstance.userWhitelistMint(
            mainMintTransaction.quantity,
            mainMintTransaction.mainCollection,
            mainMintTransaction.nonce,
            mainSignature.signature,
            {
                from: mainMintTransaction.minter,
                value: String(mintPrice * mainMintTransaction.quantity),
            }
        );

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            secondaryMintTransaction.quantity.toString()
        );
        assert.equal(
            (await shroomiesInstance.mainMinted()).toString(),
            mainMintTransaction.quantity.toString()
        );
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            (
                mainMintTransaction.quantity + secondaryMintTransaction.quantity
            ).toString()
        );
        assert.equal(
            (
                await shroomiesInstance.lastMintNonce(
                    mainMintTransaction.minter
                )
            ).toString(),
            mainMintTransaction.nonce.toString()
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).secondaryCollection.toString(),
            secondaryMintTransaction.quantity.toString()
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).mainCollection.toString(),
            mainMintTransaction.quantity.toString()
        );
    });

    // ------------------------------------------------ BATCH MINT -----------------------------------------------------------

    it('calls batchWhitelistMint (fails due to invalid sig)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        const quantity = 10;

        // wrong sender
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: accounts[2],
                    value: String(mintPrice * quantity),
                } // bad sender
            )
        );

        // wrong collection
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                !batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: accounts[1],
                    value: String(mintPrice * quantity),
                }
            )
        );

        // wrong batch id
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                `${batch.batchId}-new`,
                batch.batchSize,
                signature.signature,
                {
                    from: accounts[1],
                    value: String(mintPrice * quantity),
                }
            )
        );

        // wrong batch size
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize + 1,
                signature.signature,
                {
                    from: accounts[1],
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to zero quantity)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        const quantity = 0;

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to inactive mint)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        let batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: true, // inactive
            minter: accounts[1],
        };

        let signature = await signTransaction(batch);
        const quantity = 5;

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        batch = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false, // inactive
            minter: accounts[1],
        };

        signature = await signTransaction(batch);

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to bad value)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        const quantity = 5;

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity + 1),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to sellout secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        let quantity = 5;

        // mint 5/5
        await shroomiesInstance.batchWhitelistMint(
            quantity,
            batch.mainCollection,
            batch.batchId,
            batch.batchSize,
            signature.signature,
            {
                from: batch.minter,
                value: String(mintPrice * quantity),
            }
        );

        quantity = 1;

        // sold out
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to sellout main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        // start main
        await shroomiesInstance.updateMainCollectionMinting(true);

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: true,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        let quantity = 5;

        // mint 5/5
        await shroomiesInstance.batchWhitelistMint(
            quantity,
            batch.mainCollection,
            batch.batchId,
            batch.batchSize,
            signature.signature,
            {
                from: batch.minter,
                value: String(mintPrice * quantity),
            }
        );

        quantity = 1;

        // sold out
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to exceeding supply secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        const quantity = 6; // over supply of 5

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to exceeding supply main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100, 10, 5);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: true,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        const quantity = 6; // over supply of 5

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (fails due to exceeding batch supply)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now, 1, 100);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        const batch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 10,
            mainCollection: true,
            minter: accounts[1],
        };

        const signature = await signTransaction(batch);
        let quantity = 11; // over batch size of 10

        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );

        quantity = 10; // mint 10/10 in batch

        await shroomiesInstance.batchWhitelistMint(
            quantity,
            batch.mainCollection,
            batch.batchId,
            batch.batchSize,
            signature.signature,
            {
                from: batch.minter,
                value: String(mintPrice * quantity),
            }
        );

        assert.equal(
            (await shroomiesInstance.mintedInBatch(batch.batchId)).toString(),
            quantity.toString()
        );

        quantity = 1; // 0 left
        await truffleAssert.fails(
            shroomiesInstance.batchWhitelistMint(
                quantity,
                batch.mainCollection,
                batch.batchId,
                batch.batchSize,
                signature.signature,
                {
                    from: batch.minter,
                    value: String(mintPrice * quantity),
                }
            )
        );
    });

    it('calls batchWhitelistMint (succeeds and increases counts)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, signer, mintPrice } =
            await getShroomiesInstance(now, later, now);

        const signTransaction = getBatchWhitelistSignedMessage(
            shroomiesInstance,
            signer
        );

        const secondaryMintBatch: BatchMintTransaction = {
            batchId: 'test',
            batchSize: 100,
            mainCollection: false,
            minter: accounts[1],
        };

        const mainMintBatch: BatchMintTransaction = {
            ...secondaryMintBatch,
            batchId: 'test-main',
            mainCollection: true,
        };

        const secondarySignature = await signTransaction(secondaryMintBatch);
        const mainSignature = await signTransaction(mainMintBatch);
        const quantity = 6;

        await shroomiesInstance.batchWhitelistMint(
            quantity,
            secondaryMintBatch.mainCollection,
            secondaryMintBatch.batchId,
            secondaryMintBatch.batchSize,
            secondarySignature.signature,
            {
                from: secondaryMintBatch.minter,
                value: String(mintPrice * quantity),
            }
        );

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            quantity.toString()
        );
        assert.equal((await shroomiesInstance.mainMinted()).toString(), '0');
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            quantity.toString()
        );
        assert.equal(
            (
                await shroomiesInstance.mintedInBatch(
                    secondaryMintBatch.batchId
                )
            ).toString(),
            quantity.toString()
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        await shroomiesInstance.batchWhitelistMint(
            quantity,
            mainMintBatch.mainCollection,
            mainMintBatch.batchId,
            mainMintBatch.batchSize,
            mainSignature.signature,
            {
                from: mainMintBatch.minter,
                value: String(mintPrice * quantity),
            }
        );

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            quantity.toString()
        );
        assert.equal(
            (await shroomiesInstance.mainMinted()).toString(),
            quantity.toString()
        );
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            (quantity + quantity).toString()
        );
        assert.equal(
            (
                await shroomiesInstance.mintedInBatch(mainMintBatch.batchId)
            ).toString(),
            quantity.toString()
        );

        // getUserWhitelistMints should not be affected.
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).secondaryCollection.toString(),
            '0'
        );
        assert.equal(
            (
                await shroomiesInstance.getUserWhitelistMints(accounts[1])
            ).mainCollection.toString(),
            '0'
        );
    });

    // ------------------------------------------------ MINT -----------------------------------------------------------------

    it('calls mint (fails due to zero quantity)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(shroomiesInstance.mint(0, { value: '0' }));
    });

    it('calls mint (fails due to inactive mint)', async () => {
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            later,
            later + 100000,
            later
        );

        await truffleAssert.fails(
            shroomiesInstance.mint(10, {
                from: accounts[1],
                value: String(mintPrice * 10),
            })
        );
    });

    it('calls mint (fails due to bad value)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await truffleAssert.fails(
            shroomiesInstance.mint(10, {
                from: accounts[0],
                value: String(mintPrice * 10 - 1),
            })
        );
    });

    it('calls mint (fails due to sellout secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now,
            1,
            100,
            10,
            5
        );

        // mint 5/5
        await shroomiesInstance.mint(5, {
            from: accounts[1],
            value: String(mintPrice * 5),
        });

        // zero left
        await truffleAssert.fails(
            shroomiesInstance.mint(5, {
                from: accounts[1],
                value: String(mintPrice * 5),
            })
        );
    });

    it('calls mint (fails due to sellout main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now,
            1,
            100,
            10,
            5
        );
        await shroomiesInstance.updateMainCollectionMinting(true);

        // mint 5/5
        await shroomiesInstance.mint(5, {
            from: accounts[1],
            value: String(mintPrice * 5),
        });

        // zero left
        await truffleAssert.fails(
            shroomiesInstance.mint(5, {
                from: accounts[1],
                value: String(mintPrice * 5),
            })
        );
    });

    it('calls mint (fails due to exceeding supply secondary)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now,
            1,
            100,
            10,
            5
        );

        await truffleAssert.fails(
            shroomiesInstance.mint(6, {
                from: accounts[1],
                value: String(mintPrice * 6),
            })
        );
    });

    it('calls mint (fails due to exceeding supply main)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now,
            1,
            100,
            10,
            5
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        await truffleAssert.fails(
            shroomiesInstance.mint(6, {
                from: accounts[1],
                value: String(mintPrice * 6),
            })
        );
    });

    it('calls mint (succeeds and increases counts)', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { shroomiesInstance, mintPrice } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await shroomiesInstance.mint(10, {
            from: accounts[1],
            value: String(mintPrice * 10),
        });

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            String(10)
        );
        assert.equal((await shroomiesInstance.mainMinted()).toString(), '0');
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            String(10)
        );

        await shroomiesInstance.updateMainCollectionMinting(true);

        await shroomiesInstance.mint(10, {
            from: accounts[1],
            value: String(mintPrice * 10),
        });

        assert.equal(
            (await shroomiesInstance.secondaryMinted()).toString(),
            String(10)
        );
        assert.equal(
            (await shroomiesInstance.mainMinted()).toString(),
            String(10)
        );
        assert.equal(
            (await shroomiesInstance.totalSupply()).toString(),
            String(20)
        );
    });

    // ------------------------------------------------ MINT END -------------------------------------------------------------

    it('withdraws', async () => {
        const now = 1;
        const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

        const { mintPrice, shroomiesInstance } = await getShroomiesInstance(
            now,
            later,
            now
        );

        await shroomiesInstance.mint(5, {
            value: String(mintPrice * 5),
            from: accounts[1],
        });
        const balance = await web3.eth.getBalance(shroomiesInstance.address);

        assert.equal(Number(balance), mintPrice * 5);

        await truffleAssert.reverts(
            shroomiesInstance.withdraw(mintPrice * 5, { from: accounts[1] }) // invalid owner
        );

        await shroomiesInstance.withdraw(mintPrice * 5, { from: accounts[0] });

        assert.equal(
            Number(await web3.eth.getBalance(shroomiesInstance.address)),
            0
        );
    });
});

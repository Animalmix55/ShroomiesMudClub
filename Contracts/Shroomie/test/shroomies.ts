const truffleAssert = require('truffle-assertions');
const Shroomies = artifacts.require("Shroomies");
const Signer = artifacts.require("VerifySignature");

export {};

interface MintTransaction {
  minter: string;
  quantity: number;
  mainCollection: boolean;
  nonce: number;
}

const getShroomiesInstance = async (wlStart: number, wlEnd: number, publicStart: number, mintPrice = 4, publicTransMax = 10, supply = 8888, mainSupply = 8000) => {
  Shroomies.link(Signer);

  const signer = web3.eth.accounts.create();
  const { address: signerAddress } = signer;
  const signatureVerifierInstance = await Signer.new();
  const shroomiesInstance = await Shroomies.new(supply, mainSupply, publicTransMax, mintPrice, signerAddress, wlStart, wlEnd, publicStart);

  return { shroomiesInstance, signatureVerifierInstance, signer, mintPrice, publicTransMax, supply, mainSupply };
}

contract('Shroomies Mud Club', (accounts) => {
  it('constructs', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

    assert.equal((await shroomiesInstance.maxSupply()).toString(), supply.toString());
    assert.equal((await shroomiesInstance.mainCollectionSize()).toString(), mainSupply.toString());
    assert.equal((await shroomiesInstance.mintPrice()).toString(), mintPrice.toString());
    assert.equal((await shroomiesInstance.whitelistMint())[0].toString(), now.toString());
    assert.equal((await shroomiesInstance.whitelistMint())[1].toString(), later.toString());
    assert.equal((await shroomiesInstance.publicMint())[0].toString(), now.toString());
    assert.equal((await shroomiesInstance.publicMint())[1].toString(), publicTransMax.toString());
  });

  it('calls setMainBaseURI', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

    await truffleAssert.fails(
      shroomiesInstance.setMainBaseURI('test', { from: accounts[1] }) // wrong addr
    )

    await shroomiesInstance.setMainBaseURI('test');

    // mint to access uris
    await shroomiesInstance.ownerMintTo([1], [accounts[0]], true);

    const firstMain = supply - mainSupply + 1;
    
    await truffleAssert.fails(
      shroomiesInstance.tokenURI(1) // not minted
    );

    assert.equal(await shroomiesInstance.tokenURI(firstMain), `test${firstMain}`);
  });
  
  it('calls setSecondaryBaseURI', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

    await truffleAssert.fails(
      shroomiesInstance.setSecondaryBaseURI('test', { from: accounts[1] }) // wrong addr
    )

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

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

    await truffleAssert.fails(
      shroomiesInstance.setSigner(web3.eth.accounts.create().address, { from: accounts[1] }) // wrong addr
    )

    await shroomiesInstance.setSigner(web3.eth.accounts.create().address);
  });

  it('calls updateWhitelistMint', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

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

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

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

    const { shroomiesInstance, mintPrice, publicTransMax, supply, mainSupply } 
      = await getShroomiesInstance(now, later, now);

    await truffleAssert.fails(
      shroomiesInstance.updateMintPrice(1, { from: accounts[1] }) // bad acct
    );

    await shroomiesInstance.updateMintPrice(100);

    assert.equal((await shroomiesInstance.mintPrice()).toString(), '100');
  });

  it('calls batchMintUpdate', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance } 
      = await getShroomiesInstance(now, later, now);

    await truffleAssert.fails(
      shroomiesInstance.batchMintUpdate(100, 100, 100, 100, 100, { from: accounts[1] }) // bad acct
    );

    await shroomiesInstance.batchMintUpdate(100, 100, 100, 100, 100);

    const mintPrice = await shroomiesInstance.mintPrice();
    const pubMint = await shroomiesInstance.publicMint();
    const wlMint = await shroomiesInstance.whitelistMint();

    assert.equal(mintPrice.toString(), '100');
    assert.equal(pubMint[0].toString(), '100');
    assert.equal(pubMint[1].toString(), '100');
    assert.equal(wlMint[0].toString(), '100');
    assert.equal(wlMint[1].toString(), '100');
  });

  it('calls ownerMintTo (fails with bad sender)', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance } = await getShroomiesInstance(later, later + 1, later);

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0]], true, { from: accounts[1] }) // bad sender
    )

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0]], false, { from: accounts[1] }) // bad sender
    )
  });

  it('calls ownerMintTo (fails with mismatch arrays)', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { shroomiesInstance } = await getShroomiesInstance(later, later + 1, later);

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0], accounts[1]], true) // bad parity
    )

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0], accounts[1]], false) // bad parity
    )
  });

  it('calls ownerMintTo (fails with exceeded remaining)', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const mainSupply = 5;
    const maxSupply = 10;
    const { shroomiesInstance } = await getShroomiesInstance(later, later + 1, later, 1, 1, maxSupply, mainSupply);

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([6], [accounts[0]], true) // too many
    )

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([6], [accounts[0]], false) // too many
    )

    await shroomiesInstance.ownerMintTo([5], [accounts[0]], false) // max out secondary
    let balance = await shroomiesInstance.balanceOf(accounts[0]);

    assert.equal(balance.toString(), '5');

    await shroomiesInstance.ownerMintTo([5], [accounts[0]], true) // max out main
    balance = await shroomiesInstance.balanceOf(accounts[0]);

    assert.equal(balance.toString(), '10');

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0]], true) // too many
    )

    await truffleAssert.fails(
      shroomiesInstance.ownerMintTo([1], [accounts[0]], false) // too many
    )
  });

  it.only('calls ownerMintTo (succeeds, mints appropriate ids)', async () => {
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const mainSupply = 5;
    const maxSupply = 10;
    const { shroomiesInstance } = await getShroomiesInstance(later, later + 1, later, 1, 1, maxSupply, mainSupply);

    await shroomiesInstance.ownerMintTo([2], [accounts[0]], true);
    assert.equal((await shroomiesInstance.balanceOf(accounts[0])).toString(), '2');
    assert.equal((await shroomiesInstance.ownerOf(6)), accounts[0]);
    assert.equal((await shroomiesInstance.ownerOf(7)), accounts[0]);

    await shroomiesInstance.ownerMintTo([2], [accounts[1]], false);
    assert.equal((await shroomiesInstance.balanceOf(accounts[1])).toString(), '2');
    assert.equal((await shroomiesInstance.ownerOf(1)), accounts[1]);
    assert.equal((await shroomiesInstance.ownerOf(2)), accounts[1]);

    await shroomiesInstance.ownerMintTo([2], [accounts[3]], true);
    assert.equal((await shroomiesInstance.balanceOf(accounts[3])).toString(), '2');
    assert.equal((await shroomiesInstance.ownerOf(8)), accounts[3]);
    assert.equal((await shroomiesInstance.ownerOf(9)), accounts[3]);

    await shroomiesInstance.ownerMintTo([2], [accounts[4]], false);
    assert.equal((await shroomiesInstance.balanceOf(accounts[4])).toString(), '2');
    assert.equal((await shroomiesInstance.ownerOf(3)), accounts[4]);
    assert.equal((await shroomiesInstance.ownerOf(4)), accounts[4]);
  });

  it('withdraws', async () => {
    const now = 1;
    const later = Math.floor(new Date(2030, 10).valueOf() / 1000);

    const { mintPrice, shroomiesInstance } = await getShroomiesInstance(now, later, now);

    await shroomiesInstance.mint(5, { value: String(mintPrice * 5), from: accounts[1] });
    const balance = await web3.eth.getBalance(shroomiesInstance.address);

    assert.equal(Number(balance), mintPrice * 5);

    await truffleAssert.reverts(
      shroomiesInstance.withdraw(mintPrice * 5, { from: accounts[1] }) // invalid owner
    );

    await shroomiesInstance.withdraw(mintPrice * 5, { from: accounts[0] });

    assert.equal(Number(await web3.eth.getBalance(shroomiesInstance.address)), 0);
  });
});

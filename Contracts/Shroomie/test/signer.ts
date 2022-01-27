// const truffleAss = require('truffle-assertions');
const signer = artifacts.require('VerifySignature');

export {};

contract('Signer', (accounts) => {
    it('verifies signatures', async () => {
        const contract = await signer.new({ from: accounts[1] });
        const account = web3.eth.accounts.create();

        const encodedParameters = web3.eth.abi.encodeParameter(
            'string',
            'message'
        );
        const hash = await contract.getMessageHash(encodedParameters);
        const { signature } = account.sign(hash);

        const valid = await contract.verify(
            account.address,
            encodedParameters,
            signature
        );

        assert.ok(valid);
    });

    it('rejects signatures signed by wrong signer', async () => {
        const contract = await signer.new({ from: accounts[1] });
        const account = web3.eth.accounts.create();

        const encodedParameters = web3.eth.abi.encodeParameter(
            'string',
            'message'
        );
        const hash = await contract.getMessageHash(encodedParameters);
        const { signature } = account.sign(hash);

        // signer is not actually accounts[1], it's our new account
        const valid = await contract.verify(
            accounts[1],
            encodedParameters,
            signature
        );

        assert.notOk(valid);
    });
});

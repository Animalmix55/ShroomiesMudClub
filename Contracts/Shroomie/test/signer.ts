// const truffleAss = require('truffle-assertions');
const signer = artifacts.require("VerifySignature");

export {};

enum Mint {
  Presale = 1,
  Free = 0,
}

interface MintTransaction {
  minter: string;
  quantity: number;
  mainCollection: boolean;
  nonce: number;
}

contract('Signer', (accounts) => {
  it('verifies signatures', async () => {
    const contract = await signer.new({ from: accounts[1] });
    const account = web3.eth.accounts.create();
    const trans: MintTransaction = {
      minter: accounts[0],
      quantity: 10,
      mainCollection: false,
      nonce: 1,
    };

    const hash = await contract.getMessageHash(trans.minter, trans.quantity, trans.mainCollection, trans.nonce);
    const { signature } = account.sign(hash);

    const valid = await contract.verify(account.address, trans.minter, trans.quantity, trans.mainCollection, trans.nonce, signature);

    assert.ok(valid);
  });

  it('rejects signatures signed by wrong signer', async () => {
    const contract = await signer.new({ from: accounts[1] });
    const account = web3.eth.accounts.create();
    const trans: MintTransaction = {
      minter: accounts[0],
      quantity: 10,
      mainCollection: true,
      nonce: 1,
    };

    const hash = await contract.getMessageHash(trans.minter, trans.quantity, trans.mainCollection, trans.nonce);
    const { signature } = account.sign(hash);

    // signer is not actually accounts[1], it's our new account
    const valid = await contract.verify(accounts[1], trans.minter, trans.quantity, trans.mainCollection, trans.nonce, signature);

    assert.notOk(valid);
  });
});

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

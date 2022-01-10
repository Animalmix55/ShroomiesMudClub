/* eslint-disable no-await-in-loop */
import Web3 from 'web3';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ENS = require('ethereum-ens');

const resolveENS = async (ensAddress: string, provider: string) => {
    if (!ensAddress.includes('.eth')) return ensAddress;
    const web3Provider = new Web3.providers.HttpProvider(provider);
    const ens = new ENS(web3Provider);

    const address = await ens.resolver(ensAddress).addr();
    return address;
};

interface WhitelistMember {
    address: string;
    amount: number;
}
export const parseCSVWhitelist = async (
    path: string,
    provider: string
): Promise<WhitelistMember[]> => {
    const file = fs.readFileSync(path).toString();
    const lines = file.split('\n');
    const members = [] as WhitelistMember[];

    let i = 1; // skip header
    for (i; i < lines.length; i++) {
        const line = lines[i];
        const [addressString, amountString] = line
            .split(',')
            .map((s) => s.trim());

        const amount = Number(amountString);
        if (Number.isNaN(amount))
            throw new Error(
                `Invalid amount ${amountString} for address ${addressString}`
            );
        // eslint-disable-next-line no-continue
        if (!addressString) continue; // skip

        const address = await resolveENS(addressString, provider);
        members.push({ address, amount: Number(amount) });
    }

    return members;
};

export default parseCSVWhitelist;

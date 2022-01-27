/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface TimeFrame {
    start: number;
    end: number;
}

export const getMintSignature = async (
    api: string,
    quantity: number,
    address: string
): Promise<{ signature: string; nonce: number }> => {
    const url = `${api}/mint.php`;
    const result = await axios.post(url, {
        quantity,
        address,
    });

    return result.data as never;
};

export const getWhitelist = async (
    api: string,
    address: string,
    isMainCollection: boolean
): Promise<number> => {
    const url = `${api}/whitelist.php?address=${address}&mainCollection=${String(
        isMainCollection
    )}`;
    const result = await axios.get(url);

    return Number(result.data);
};

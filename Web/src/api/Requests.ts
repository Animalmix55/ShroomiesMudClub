/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface TimeFrame {
    start: number;
    end: number;
}

export const getMintSignature = async (
    api: string,
    quantity: number,
    address: string,
    mainMint: boolean
): Promise<{ signature: string; nonce: number }> => {
    const url = `${api}/mint.php`;
    const result = await axios.post(url, {
        quantity,
        address,
        mainMint,
    });

    return result.data as never;
};

export const getBatchSignature = async (
    api: string,
    batchSecret: string,
    address: string
): Promise<{
    signature: string;
    batchSize: number;
    mainCollection: boolean;
    validUntil: number;
}> => {
    const url = `${api}/mint.php`;
    const result = await axios.post(url, {
        batchSecret,
        address,
    });

    return result.data as never;
};

export const getWhitelist = async (
    api: string,
    address: string
): Promise<{ main: number; secondary: number }> => {
    const url = `${api}/whitelist.php?address=${address}`;
    const result = await axios.get(url);

    return result.data;
};

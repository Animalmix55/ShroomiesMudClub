import React from 'react';
import { getBatchSignature } from '../api/Requests';
import { useShroomieContext } from '../contexts/ShroomieContext';

export const useBatchSignatureGetter = (
    address?: string
): ((secret?: string) => Promise<
    | {
          signature: string;
          batchSize: number;
          mainCollection: boolean;
      }
    | undefined
>) => {
    const { api } = useShroomieContext();

    const handler = React.useCallback(
        async (secret: string) => {
            if (!address) return undefined;
            try {
                const result = getBatchSignature(api, secret, address);
                return result;
            } catch (e) {
                return undefined;
            }
        },
        [address, api]
    );

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return handler;
};

export default useBatchSignatureGetter;

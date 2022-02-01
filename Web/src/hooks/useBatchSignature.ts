import React from 'react';
import useBatchSignatureGetter from './useBatchSignatureGetter';

interface Batch {
    signature: string;
    batchSize: number;
    mainCollection: boolean;
}

export const useBatchSignature = (
    address?: string,
    secret?: string
): Batch | undefined => {
    const [batch, setBatch] = React.useState<Batch>();
    const getBatchSignature = useBatchSignatureGetter(address);

    React.useEffect(() => {
        if (!secret) {
            setBatch(undefined);
            return;
        }

        getBatchSignature(secret).then(setBatch);
    }, [getBatchSignature, secret]);

    return batch;
};

export default useBatchSignatureGetter;

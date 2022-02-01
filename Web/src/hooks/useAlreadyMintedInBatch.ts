import React from 'react';
import { useContractContext } from '../contexts/ContractContext';

export const useAlreadyMintedInBatch = (batchSecret?: string): number => {
    const { tokenContract } = useContractContext();
    const batchId = React.useMemo(
        () => batchSecret?.split('-')[0],
        [batchSecret]
    );
    const [minted, setMinted] = React.useState(0);

    React.useEffect(() => {
        if (!tokenContract || !batchId) {
            setMinted(0);
            return;
        }

        tokenContract.methods
            .mintedInBatch(batchId)
            .call()
            .then((v) => setMinted(Number(v)));
    }, [batchId, tokenContract]);

    return minted;
};

export default useAlreadyMintedInBatch;

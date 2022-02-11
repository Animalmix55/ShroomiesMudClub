import React from 'react';
import { useContractContext } from '../contexts/ContractContext';
import useHeldTokens from './useHeldTokens';

export const useWhitelistEligibleNightShrooms = (): [
    heldIds: number[],
    isLoading: boolean
] => {
    const { tokenContract } = useContractContext();
    const heldIds = useHeldTokens(tokenContract);

    const [numNightShrooms, setNumNightShrooms] = React.useState(0);
    const [numLoading, setNumLoading] = React.useState(false);
    const [unspentLoading, setUnspentLoading] = React.useState(false);

    React.useEffect(() => {
        setNumNightShrooms(0);
        if (!tokenContract) {
            return;
        }
        setNumLoading(true);

        tokenContract.methods
            .maxSupply()
            .call()
            .then((maxSupply) =>
                tokenContract.methods
                    .mainCollectionSize()
                    .call()
                    .then((mainCollectionSize) => {
                        setNumNightShrooms(
                            Number(maxSupply) - Number(mainCollectionSize)
                        );
                    })
                    .finally(() => setNumLoading(false))
            )
            .catch(() => setNumLoading(false));
    }, [tokenContract]);

    const nightShroomIds = React.useMemo(
        () =>
            heldIds.ids.reduce(
                (prev, cur) => (cur <= numNightShrooms ? [...prev, cur] : prev),
                [] as number[]
            ),
        [heldIds.ids, numNightShrooms]
    );

    const [unspentNightShroomIds, setUnspendNightShroomIds] = React.useState<
        number[]
    >([]);

    React.useEffect(() => {
        setUnspendNightShroomIds([]);
        if (!tokenContract) {
            return;
        }
        setUnspentLoading(true);

        const handle = async (): Promise<void> => {
            const idIsSpent = await Promise.all(
                nightShroomIds.map((id) =>
                    tokenContract.methods.isSpent(id).call()
                )
            );

            setUnspendNightShroomIds(
                nightShroomIds.filter((_, i) => !idIsSpent[i])
            );
        };

        handle().finally(() => setUnspentLoading(false));
    }, [nightShroomIds, tokenContract]);

    return [unspentNightShroomIds, unspentLoading || numLoading];
};

export default useWhitelistEligibleNightShrooms;

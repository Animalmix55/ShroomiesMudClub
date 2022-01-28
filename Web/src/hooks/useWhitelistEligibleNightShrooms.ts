import React from 'react';
import { useContractContext } from '../contexts/ContractContext';
import useHeldTokens from './useHeldTokens';

export const useWhitelistEligibleNightShrooms = (): number[] => {
    const { tokenContract } = useContractContext();
    const heldIds = useHeldTokens(tokenContract);

    const [numNightShrooms, setNumNightShrooms] = React.useState(0);

    React.useEffect(() => {
        setNumNightShrooms(0);
        if (!tokenContract) {
            return;
        }

        tokenContract.methods
            .maxSupply()
            .call()
            .then((maxSupply) =>
                tokenContract.methods
                    .mainCollectionSize()
                    .call()
                    .then((mainCollectionSize) =>
                        setNumNightShrooms(
                            Number(maxSupply) - Number(mainCollectionSize)
                        )
                    )
            );
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

        handle();
    }, [nightShroomIds, tokenContract]);

    return unspentNightShroomIds;
};

export default useWhitelistEligibleNightShrooms;

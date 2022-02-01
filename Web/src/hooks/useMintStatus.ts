import React from 'react';
import { useContractContext } from '../contexts/ContractContext';
import useCurrentTime from './useCurrentTime';
import useMintDetails from './useMintDetails';

interface MintStatus {
    isWhitelist: boolean;
    isMainMint: boolean;
}

export const useMintStatus = (): MintStatus => {
    const { tokenContract } = useContractContext();
    const [isMainMint, setMainMinting] = React.useState(false);
    const time = useCurrentTime();

    const { startDate, endDate } = useMintDetails('presale');

    React.useEffect(() => {
        if (!tokenContract) {
            setMainMinting(false);
            return;
        }

        tokenContract.methods
            .mainCollectionMinting()
            .call()
            .then(setMainMinting);
    }, [tokenContract]);

    const isWhitelist = React.useMemo(
        () => time > startDate && time < endDate,
        [endDate, startDate, time]
    );

    return { isWhitelist, isMainMint };
};

export default useMintStatus;

import React from 'react';
import { toast } from 'react-toastify';
import { getWhitelist } from '../api/Requests';
import { useShroomieContext } from '../contexts/ShroomieContext';
import useWeb3 from '../contexts/Web3Context';

interface Output {
    presale: number;
    reload: () => void;
}
export const useWhitelistCounts = (isMainCollection: boolean): Output => {
    const { api } = useShroomieContext();
    const { accounts } = useWeb3();
    const [count, setCounts] = React.useState<number>(0);

    const fetchCounts = React.useCallback((): void => {
        getWhitelist(api, accounts[0], isMainCollection)
            .then((c) => {
                setCounts(c);
            })
            .catch(() =>
                toast('Failed to fetch whitelist counts', { type: 'error' })
            );
    }, [accounts, api, isMainCollection]);

    React.useEffect(() => {
        if (!accounts[0]) {
            setCounts(0);
            return;
        }

        fetchCounts();
    }, [accounts, api, fetchCounts]);

    return { presale: count, reload: fetchCounts };
};

export default useWhitelistCounts;

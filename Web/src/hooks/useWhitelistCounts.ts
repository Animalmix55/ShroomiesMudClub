import React from 'react';
import { toast } from 'react-toastify';
import { getWhitelist } from '../api/Requests';
import { useShroomieContext } from '../contexts/ShroomieContext';
import useWeb3 from '../contexts/Web3Context';

interface Whitelist {
    main: number;
    secondary: number;
}

interface Output extends Whitelist {
    reload: () => void;
}

const def: Whitelist = {
    main: 0,
    secondary: 0,
};

export const useWhitelistCounts = (): Output => {
    const { api } = useShroomieContext();
    const { accounts } = useWeb3();
    const [counts, setCounts] = React.useState<{
        main: number;
        secondary: number;
    }>(def);

    const fetchCounts = React.useCallback((): void => {
        getWhitelist(api, accounts[0])
            .then((c) => {
                setCounts(c);
            })
            .catch(() =>
                toast('Failed to fetch whitelist counts', { type: 'error' })
            );
    }, [accounts, api]);

    React.useEffect(() => {
        if (!accounts[0]) {
            setCounts(def);
            return;
        }

        fetchCounts();
    }, [accounts, api, fetchCounts]);

    return { ...counts, reload: fetchCounts };
};

export default useWhitelistCounts;

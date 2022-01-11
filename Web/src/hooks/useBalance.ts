import BigDecimal from 'js-big-decimal';
import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { BASE } from '../utilties/Numbers';
import { IERC721 } from '../models/IERC721';
import { IERC721Metadata } from '../models/IERC721Metadata';

/**
 * Gets the balance of the given token
 * @param token the token to get the balance of
 * @returns a bigdecimal
 */
export function useBalance(
    token?: IERC721 | IERC721Metadata | 'ETH',
    address?: string
): BigDecimal {
    const [balance, setBalance] = React.useState<BigDecimal>(new BigDecimal(0));
    const { web3 } = useWeb3();

    const refresh = React.useCallback(() => {
        if (!address) return;

        if (token === 'ETH') {
            if (!web3) return;
            web3.eth
                .getBalance(address)
                .then((bal) =>
                    setBalance(new BigDecimal(bal).divide(BASE, 30))
                );
            return;
        }
        if (!token) return;

        token.methods
            .balanceOf(address)
            .call()
            .then((val) => setBalance(new BigDecimal(val)));
    }, [address, token, web3]);

    React.useEffect(() => refresh(), [refresh]);

    return balance;
}

export default useBalance;

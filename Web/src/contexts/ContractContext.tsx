import React from 'react';
import tokenAbi from '../assets/NightShroomAbi.json';
import { NightShroom } from '../models/NightShroom';
import { useShroomieContext } from './ShroomieContext';
import useWeb3 from './Web3Context';

export interface ContractContextType {
    tokenContract?: NightShroom;
}

const ContractContext = React.createContext<ContractContextType>({});

export const useContractContext = (): ContractContextType =>
    React.useContext(ContractContext);

export const ContractContextProvider = ({
    children,
}: {
    children: React.ReactChild;
}): JSX.Element => {
    const { web3 } = useWeb3();
    const { tokenContractAddress } = useShroomieContext();

    const tokenContract = React.useMemo(() => {
        if (!tokenContractAddress) return undefined;
        if (!web3) return undefined;

        const token = new web3.eth.Contract(
            tokenAbi as never,
            tokenContractAddress
        ) as unknown as NightShroom;
        return token;
    }, [tokenContractAddress, web3]);

    return (
        <ContractContext.Provider
            value={{
                tokenContract,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};

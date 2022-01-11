import React from 'react';
import { Chain } from './Web3Context';

export interface ShroomieContextType {
    api: string;
    chainId: Chain;
    tokenContractAddress: string;
    discordUrl: string;
    twitterUrl: string;
    etherscanUrl: string;
    openseaUrl: string;
    instagramUrl: string;
}

const ShroomieContext = React.createContext<ShroomieContextType>({
    api: 'http://localhost',
    chainId: Chain.Test,
    tokenContractAddress: '',
    etherscanUrl: '',
    discordUrl: '',
    twitterUrl: '',
    openseaUrl: '',
    instagramUrl: '',
});

export const useShroomieContext = (): ShroomieContextType =>
    React.useContext(ShroomieContext);

export const ShroomieContextProvider = ShroomieContext.Provider;

export default ShroomieContext;

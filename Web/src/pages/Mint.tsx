import React from 'react';
import { useStyletron } from 'styletron-react';
import { Web3ContextProvider } from '../contexts/Web3Context';
import { ContractContextProvider } from '../contexts/ContractContext';
import { MetamaskModal } from '../molecules/MetamaskModal';
import { InvalidChainModal } from '../molecules/InvalidChainModal';
import MintDock from '../molecules/MintDock';
import Clouds from '../assets/images/clouds.png';
import { MOBILE } from '../utilties/MediaQueries';

export const MintPage = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <Web3ContextProvider>
            <ContractContextProvider>
                <div
                    className={css({
                        minHeight: '100vh',
                        display: 'flex',
                        backgroundImage: `url(${Clouds})`,
                        backgroundPosition: 'center',
                        position: 'relative',
                    })}
                >
                    <div
                        className={css({
                            margin: '150px 30px 30px 30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            flex: '1',
                            overflow: 'hidden',
                            [MOBILE]: {
                                margin: '30px',
                            },
                        })}
                    >
                        <InvalidChainModal />
                        <MetamaskModal />
                        <MintDock />
                    </div>
                </div>
            </ContractContextProvider>
        </Web3ContextProvider>
    );
};

export default MintPage;

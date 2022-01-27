import React from 'react';
import { useStyletron } from 'styletron-react';
import { Web3ContextProvider } from '../../contexts/Web3Context';
import { ContractContextProvider } from '../../contexts/ContractContext';
import { MetamaskModal } from '../../molecules/MetamaskModal';
import { InvalidChainModal } from '../../molecules/InvalidChainModal';
import { MOBILE } from '../../utilties/MediaQueries';
import BG from '../../assets/images/MAGIC MINT/GRASS_3-01.png';

export const MintPage = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <Web3ContextProvider>
            <ContractContextProvider>
                <div
                    className={css({
                        minHeight: '100vh',
                        display: 'flex',
                        backgroundPosition: 'center',
                        position: 'relative',
                        backgroundImage: `url(${BG})`,
                        backgroundSize: 'cover',
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
                    </div>
                </div>
            </ContractContextProvider>
        </Web3ContextProvider>
    );
};

export default MintPage;

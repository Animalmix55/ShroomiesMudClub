import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { useStyletron } from 'styletron-react';
import { useShroomieContext } from '../contexts/ShroomieContext';
import { MOBILE } from '../utilties/MediaQueries';
import EtherscanLogo from '../assets/EtherscanLogo.svg';

export const Footer = (): JSX.Element => {
    const [css] = useStyletron();
    const {
        twitterUrl,
        discordUrl,
        instagramUrl,
        etherscanUrl,
        tokenContractAddress,
    } = useShroomieContext();

    return (
        <div
            className={css({
                marginTop: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            })}
        >
            <div>
                <SocialIcon
                    url={twitterUrl}
                    bgColor="black"
                    className={css({
                        margin: '5px',
                        height: '50px',
                        width: '50px',
                        [MOBILE]: {
                            height: '80px !important',
                            width: '80px !important',
                        },
                    })}
                />
                <SocialIcon
                    url={discordUrl}
                    bgColor="black"
                    className={css({
                        margin: '5px',
                        height: '50px',
                        width: '50px',
                        [MOBILE]: {
                            height: '80px !important',
                            width: '80px !important',
                        },
                    })}
                />
                <SocialIcon
                    url={instagramUrl}
                    bgColor="black"
                    className={css({
                        margin: '5px',
                        height: '50px',
                        width: '50px',
                        [MOBILE]: {
                            height: '80px !important',
                            width: '80px !important',
                        },
                    })}
                />
                <a
                    href={`${etherscanUrl}/address/${tokenContractAddress}`}
                    className={css({
                        display: 'inline-block',
                        width: '50px',
                        margin: '5px',
                        height: '50px',
                        position: 'relative',
                        overflow: 'hidden',
                        verticalAlign: 'middle',
                        [MOBILE]: {
                            height: '80px !important',
                            width: '80px !important',
                        },
                    })}
                >
                    <img
                        src={EtherscanLogo}
                        alt="Etherscan"
                        className={css({
                            backgroundColor: 'black',
                            height: '100%',
                            width: '100%',
                            borderRadius: '10000px',
                        })}
                    />
                </a>
            </div>
            <div>The Chill With Jesus. All Rights Reserved.</div>
        </div>
    );
};

export default Footer;

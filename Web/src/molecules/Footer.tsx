import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { useStyletron } from 'styletron-react';
import { useShroomieContext } from '../contexts/ShroomieContext';
import { MOBILE } from '../utilties/MediaQueries';
import EtherscanLogo from '../assets/EtherscanLogo.svg';

export const Footer = (): JSX.Element => {
    const [css] = useStyletron();
    const { twitterUrl, discordUrl, etherscanUrl, tokenContractAddress } =
        useShroomieContext();

    return (
        <div
            className={css({
                marginTop: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '0px 30px 150px 30px',
            })}
        >
            <div
                className={css({
                    maxWidth: '600px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                })}
            >
                <div className={css({ margin: '15px' })}>
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
                    {tokenContractAddress && (
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
                                    height: '100%',
                                    width: '100%',
                                })}
                            />
                        </a>
                    )}
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        margin: '15px',
                        fontSize: '15px',
                    })}
                >
                    Each Shroomie is a unique artwork, programmatically
                    generated from more than 300 traits. Our core group of
                    Shroomies are based on real-world mushrooms, some edible,
                    some magical, some medicinal and some poisonous, but ALL
                    extraordinary - and some more extraordinary than others.
                    Hold on, you’re going on an fantastic trip.
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        margin: '7px',
                        fontWeight: 'bold',
                    })}
                >
                    ©2021 Shroomies Mud Club - All Rights Reserved
                </div>
                <div className={css({ textAlign: 'center', margin: '7px' })}>
                    <a
                        href="mailto:info@shroomiesmudclub.io"
                        target="_blank"
                        rel="noreferrer"
                    >
                        info@shroomiesmudclub.io
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;

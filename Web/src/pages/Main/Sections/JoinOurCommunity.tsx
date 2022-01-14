import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import OpenSeaLogo from '../../../assets/Opensea-Color.svg';
import { useShroomieContext } from '../../../contexts/ShroomieContext';
import { MOBILE } from '../../../utilties/MediaQueries';

export const JoinOurCommunity = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    const { openseaUrl, discordUrl, twitterUrl } = useShroomieContext();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.darkBlue.getCSSColor(1),
                color: theme.fontColors.normal.secondary.getCSSColor(1),
                overflow: 'hidden',
                padding: '30px',
            })}
        >
            <div
                className={css({
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                })}
            >
                <div
                    className={css({
                        textAlign: 'center',
                        fontSize: '40px',
                        margin: '30px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                    })}
                >
                    Join Our Community
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        padding: '0px 100px 0px 100px',
                        [MOBILE]: {
                            padding: '0px 30px 0px 30px',
                        },
                    })}
                >
                    Join the <b>#SHROOMIESMUDCLUB</b> a hub for education,
                    awareness giving back.
                </div>
                <br />
                <div>
                    <div>
                        We are bringing the FUNGI WORLD of mushroom experts,
                        enthusiasts and communities together on one server!
                        Check out our Discord featuring the world’s leading
                        mycologists and organizations related to Fungi with
                        weekly AMA, Twitter Spaces, and dedicated channels
                        communities focused on fungi topics, including cooking,
                        health, and foraging.
                    </div>
                    <br />
                    <div>
                        Get the latest announcements about community,
                        partnerships, physical game development, contests,
                        giveaways, and more! Holders of Shroomies Mud Club NFT’s
                        get special community privileges! Learn more on our
                        Discord server.
                    </div>
                </div>
                <div
                    className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '20px',
                    })}
                >
                    <SocialIcon
                        url={twitterUrl}
                        color="white"
                        className={css({
                            margin: '5px',
                            [MOBILE]: {
                                height: '100px !important',
                                width: '100px !important',
                            },
                        })}
                    />
                    <SocialIcon
                        color="white"
                        url={discordUrl}
                        className={css({
                            margin: '5px',
                            [MOBILE]: {
                                height: '100px !important',
                                width: '100px !important',
                            },
                        })}
                    />
                    {openseaUrl && (
                        <a
                            href={openseaUrl}
                            className={css({
                                height: '50px',
                                width: '50px',
                                position: 'relative',
                                margin: '5px',
                                display: 'block',
                                [MOBILE]: {
                                    height: '100px !important',
                                    width: '100px !important',
                                },
                            })}
                        >
                            <img
                                src={OpenSeaLogo}
                                alt="OpenSea"
                                className={css({
                                    height: '100%',
                                    width: 'auto',
                                })}
                            />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinOurCommunity;

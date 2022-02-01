import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Shroomies from '../../../assets/images/SHROOMIES/SHROOMIE_MAIN_IMG_V3.png';
import { MOBILE } from '../../../utilties/MediaQueries';

export const ShroomiesSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: theme.pallette.lightBlue.getCSSColor(1),
                color: theme.fontColors.normal.secondary.getCSSColor(1),
                fontSize: '20px',
                [MOBILE]: {
                    fontSize: '24px',
                },
            })}
        >
            <div
                className={css({
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <div
                    className={css({
                        margin: '30px 0px 30px 0px',
                        fontSize: '45px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                    })}
                >
                    Shroomies
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        marginBottom: '30px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                    })}
                >
                    Coming Soon!
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        marginBottom: '30px',
                    })}
                >
                    The main collection of Shroomies Mud Club - powerful
                    Shroomies from almost 400 traits! Holders of Shroomies Mud
                    Club NFTs will enter a fantastic world of community
                    building, education, and games!
                </div>
            </div>
            <div
                className={css({
                    width: '100%',
                    overflow: 'hidden',
                    maxWidth: '800px',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    left: '0px',
                    right: '0px',
                })}
            >
                <img
                    src={Shroomies}
                    alt="Shroomies"
                    className={css({
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                    })}
                />
            </div>
        </div>
    );
};

export default ShroomiesSection;

import React from 'react';
import { useStyletron } from 'styletron-react';
import Image from '../../../assets/images/LANDING/MAIN_IMG_TOP_SHROOMIES.jpg';
import MobileImage from '../../../assets/images/LANDING/MAIN_IMG_TOP_SHROOMIES_MOBILE.png';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Title from '../../../assets/images/LANDING/SMC_MAIN_TITLE.png';
import { MOBILE } from '../../../utilties/MediaQueries';

export const Landing = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                minHeight: '100vh',
                overflow: 'auto',
                backgroundColor: theme.pallette.gradientBlue.getCSSColor(1),
                background: `linear-gradient(360deg, ${theme.pallette.lightPurple.getCSSColor(
                    1
                )} 35%, ${theme.pallette.gradientBlue.getCSSColor(1)} 100%);`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            })}
        >
            <div
                className={css({
                    margin: '15vh auto 0px auto',
                    maxWidth: '900px',
                    padding: '40px',
                })}
            >
                <img
                    src={Title}
                    alt="Shroomies Mud Club"
                    className={css({
                        width: '100%',
                        height: 'auto',
                    })}
                />
            </div>
            <div
                className={css({
                    maxWidth: '1000px',
                    width: '100%',
                    marginTop: 'auto',
                })}
            >
                <img
                    src={Image}
                    alt="Some Shroomies"
                    className={css({
                        display: 'block',
                        [MOBILE]: {
                            display: 'none',
                        },
                        width: '100%',
                        height: 'auto',
                    })}
                />
                <img
                    src={MobileImage}
                    alt="Some Shroomies"
                    className={css({
                        display: 'none',
                        [MOBILE]: {
                            display: 'block',
                        },
                        width: '100%',
                        height: 'auto',
                    })}
                />
            </div>
        </div>
    );
};

export default Landing;

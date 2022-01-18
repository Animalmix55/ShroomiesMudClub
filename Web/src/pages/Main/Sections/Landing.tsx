import React from 'react';
import { useStyletron } from 'styletron-react';
import BG from '../../../assets/images/LANDING/MAIN_IMG_TOP_SHROOMIES.jpg';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { MOBILE } from '../../../utilties/MediaQueries';

export const Landing = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundImage: `url(${BG})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                minHeight: '100vh',
                backgroundRepeat: 'no-repeat',
                overflow: 'auto',
                backgroundColor: theme.pallette.gradientBlue.getCSSColor(1),
                [MOBILE]: {
                    backgroundPosition: 'bottom center',
                    backgroundSize: 'contain',
                    display: 'flex',
                    alignItems: 'center',
                },
            })}
        >
            <div
                className={css({
                    marginTop: '15vh',
                    width: '100%',
                    fontWeight: 'bold',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    fontSize: '80px',
                    textTransform: 'uppercase',
                    [MOBILE]: {
                        fontSize: '50px',
                        marginTop: 'unset',
                    },
                })}
            >
                <div className={css({ textAlign: 'center' })}>Shroomies</div>
                <div className={css({ textAlign: 'center' })}>Mud Club</div>
            </div>
        </div>
    );
};

export default Landing;

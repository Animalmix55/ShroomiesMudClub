import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Shroomies from '../../../assets/images/SHROOMIES/SHROOMIE_MAIN_IMG4.png';
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
                paddingBottom: '40vw',
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
                        margin: '30px',
                        fontSize: '40px',
                        fontWeight: 'bold',
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
                    Coming Soon! Main Drop Q1 2022!
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        marginBottom: '30px',
                    })}
                >
                    Welcome to Shroomies Mud Club! Here you find curiously
                    evolving troops of unearthed magical, edible, walking,
                    talking, and sometimes roguish little mushrooms.
                </div>
            </div>
            <img
                src={Shroomies}
                alt="Shroomies"
                className={css({
                    maxWidth: '1200px',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                })}
            />
        </div>
    );
};

export default ShroomiesSection;

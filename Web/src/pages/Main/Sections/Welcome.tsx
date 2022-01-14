import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Shroom from '../../../assets/images/WELCOME/SHROOMIES.gif';
import { MOBILE } from '../../../utilties/MediaQueries';

export const WelcomeSection = (): JSX.Element => {
    const theme = useThemeContext();
    const [css] = useStyletron();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.yellow.getCSSColor(1),
                fontSize: '24px',
                padding: '30px 50px 30px 50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            })}
        >
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    [MOBILE]: {
                        maxWidth: 'unset !important',
                        display: 'block',
                    },
                })}
            >
                <img
                    src={Shroom}
                    alt="Shroom GIF"
                    className={css({
                        margin: '20px',
                        minWidth: '230px',
                        minHeight: '260px',
                        height: '20vw',
                        maxHeight: '300px',
                        maxWidth: '264px',
                        width: 'auto',
                        [MOBILE]: {
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        },
                    })}
                />
                <div
                    className={css({
                        maxWidth: '40vw',
                        [MOBILE]: {
                            maxWidth: 'unset',
                        },
                    })}
                >
                    <div>
                        Welcome to the <b>Shroomies Mud Club</b>. You are a
                        forager in this experimental metaverse of mushroom mojo.
                        Here you find curiously evolving troops of unearthed
                        magical, edible, walking, talking, and sometimes roguish
                        little mushrooms.
                    </div>
                    <br />
                    <div>
                        We are a generative NFT project with a core group of
                        mushroom art based on real-world mushrooms such as the
                        Bleweit, Indigo Milk Cap, Golden Scruffy, Magic
                        Mushroom, and more! Our primary focus is to raise
                        awareness of the underrated benefits of mushrooms for
                        the mind, body, and vital to environmental ecosystems.
                        Join us!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;

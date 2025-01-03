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
                padding: '30px 50px 30px 50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                [MOBILE]: {
                    fontSize: '24px',
                },
            })}
        >
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    [MOBILE]: {
                        maxWidth: 'unset !important',
                        flexDirection: 'column-reverse',
                    },
                })}
            >
                <img
                    src={Shroom}
                    alt="Shroom GIF"
                    className={css({
                        margin: '20px',
                        height: '400px',
                        width: 'auto',
                        [MOBILE]: {
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            height: 'auto',
                            width: '100%',
                            maxWidth: '500px',
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
                        Welcome to the <b>Shroomies Mud Club</b>
                    </div>
                    <br />
                    <div>
                        You are a forager in this experimental metaverse of
                        mushroom mojo. Here you find curiously evolving troops
                        of unearthed magical, edible, walking, talking, and
                        sometimes roguish little mushrooms.
                    </div>
                    <br />
                    <div>
                        We are a generative NFT project with a core group of
                        mushroom art based on real-world mushrooms such as the
                        Bleweit, Indigo Milk Cap, Golden Scruffy, Magic
                        Mushroom, and more! Our primary focus is to raise
                        awareness of the underrated benefits of mushrooms for
                        the mind, body, and our environmental ecosystems. Join
                        us!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;

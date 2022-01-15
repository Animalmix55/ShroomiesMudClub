import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import AboutImage from '../../../assets/images/ABOUT/STARTED_GOING.jpg';
import { MOBILE } from '../../../utilties/MediaQueries';

export const AboutSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.pink.getCSSColor(1),
                padding: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
            })}
        >
            <div className={css({ maxWidth: '1000px' })}>
                <div
                    className={css({
                        fontWeight: 'bold',
                        fontSize: '40px',
                        margin: '20px',
                        textTransform: 'uppercase',
                    })}
                >
                    About
                </div>
                <div
                    className={css({
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })}
                >
                    <div
                        className={css({
                            margin: '20px',
                            flex: '1',
                            [MOBILE]: {
                                flex: 'unset',
                            },
                        })}
                    >
                        <div>
                            All Shroomies are based on real-world mushrooms,
                            some edible, some magical, some poisonous, but ALL
                            extraordinary. Our core group of Shroomies are
                            inspired by the likes of the Fly Agaric, Emetic
                            Russula, Magic Mushrooms, Golden-Scruffy Collybia,
                            Flaming Gold Bolete, Sky Blue, Indigo Milk Cap, Wine
                            Cap, Jack-O-Lantern, and the Blewit. They are
                            reimagined with nods to mother nature, pop culture,
                            the fantastical, and the trippy explorations by our
                            artist and co-creator.
                        </div>
                        <br />
                        <div>
                            The Shroomies will introduce the forager (the
                            collector) to their metaverse. Join us in Discord
                            where we combine the love of vision seeking,
                            foraging, and real-world mycelium insights with
                            unique generative and curated NFT art, games,
                            contests, and community building.
                        </div>
                    </div>
                    <div
                        className={css({
                            maxWidth: '350px',
                            minWidth: '200px',
                        })}
                    >
                        <img
                            src={AboutImage}
                            alt="Shroomies and their wild counterparts"
                            className={css({
                                width: '100%',
                                height: 'auto',
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;

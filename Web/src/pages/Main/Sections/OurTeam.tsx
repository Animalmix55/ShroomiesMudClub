import React from 'react';
import { useStyletron } from 'styletron-react';

import Cory from '../../../assets/images/OUR TEAM/CORY copy.jpg';
import Heath from '../../../assets/images/OUR TEAM/HEATH.jpg';
import Justin from '../../../assets/images/OUR TEAM/JUSTIN_8.jpg';
import Laura from '../../../assets/images/OUR TEAM/LAURA.jpg';
import { useThemeContext } from '../../../contexts/ThemeContext';

export const OurTeamSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundColor: 'black',
                padding: '30px',
                color: theme.fontColors.normal.secondary.getCSSColor(1),
                display: 'flex',
                justifyContent: 'center',
            })}
        >
            <div className={css({ maxWidth: '1000px' })}>
                <div
                    className={css({
                        fontWeight: 'bold',
                        fontSize: '40px',
                        textTransform: 'uppercase',
                        margin: '20px',
                    })}
                >
                    Our Team
                </div>
                <div
                    className={css({
                        display: 'flex',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    })}
                >
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '20px',
                            minWidth: '200px',
                            maxWidth: '350px',
                            flex: '1',
                        })}
                    >
                        <img
                            src={Laura}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="The Pixel Maven"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            THE PIXEL MAVEN
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            Co-Creator, and Design Director, illustrator and
                            artist. 20 years in media design across the digital
                            and physical space and an early metaverse
                            evangelist. 80’s punk maven. Boy mom. Dog mom.
                        </div>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '20px',
                            minWidth: '200px',
                            maxWidth: '350px',
                            flex: '1',
                        })}
                    >
                        <img
                            src={Heath}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="THE MOJO MAKER"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            THE MOJO MAKER
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            Co-Creator and Fungi Visionnaire. Real-world forest
                            dweller and fungi enthusiast. Past life was spent
                            traipsing around documenting the fashion, art, and
                            entertainment world.
                        </div>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '20px',
                            minWidth: '200px',
                            maxWidth: '350px',
                            flex: '1',
                        })}
                    >
                        <img
                            src={Justin}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="SPOTTED ACTUAL"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            SPOTTED ACTUAL
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            We need words about Justin to go here. Something
                            that outlines in a fun way his contribution to our
                            fantastic team. This is where that text needs to go.
                            And the blurb should be this long.
                        </div>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '20px',
                            minWidth: '200px',
                            maxWidth: '350px',
                            flex: '1',
                        })}
                    >
                        <img
                            src={Cory}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="ToxicPizza"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            ToxicPizza
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            Developer, cat dad, and expert mushroom generator.
                            Software developer by day, web3 developer by night.
                            Writes a mean gas-efficient smart contract.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurTeamSection;

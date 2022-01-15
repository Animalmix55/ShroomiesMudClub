import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import MapsLogo from '../../../assets/images/CAUSES WE SUPPORT/MAPS_LOGO.jpg';
import FFLogo from '../../../assets/images/CAUSES WE SUPPORT/FUNGI_LOGO.jpg';
import FungiPerfectiLogo from '../../../assets/images/CAUSES WE SUPPORT/FUNGI_PERFECTI.jpg';
import Button, { ButtonType } from '../../../atoms/Button';

export const SupportedCausesSection = (): JSX.Element => {
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
                    Causes We Support
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
                            src={MapsLogo}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="Maps Logo"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            Maps
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            Founded in 1986, the Multidisciplinary Association
                            for Psychedelic Studies (MAPS) is a 501(c)(3)
                            non-profit research and educational organization
                            that develops medical, legal, and cultural contexts
                            for people to benefit from the careful uses of
                            psychedelics and marijuana.
                        </div>
                        <Button
                            buttonType={ButtonType.primary}
                            className={css({
                                marginTop: 'auto',
                                marginBottom: '20px',
                            })}
                        >
                            Learn More
                        </Button>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '350px',
                            minWidth: '200px',
                            flex: '1',
                            margin: '20px',
                        })}
                    >
                        <img
                            src={FFLogo}
                            className={css({ width: '100%', height: 'auto' })}
                            alt="The Fungi Foundation Logo"
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            The Fungi Foundation
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            The Fungi Foundation is a global NGO that explores
                            fungi to increase knowledge about their diversity,
                            promote innovative solutions to contingent problems,
                            educate about their existence and applications, and
                            recommend public policies for their conservation.
                        </div>
                        <Button
                            className={css({
                                marginTop: 'auto',
                                marginBottom: '20px',
                            })}
                            buttonType={ButtonType.primary}
                        >
                            Learn More
                        </Button>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '200px',
                            maxWidth: '350px',
                            flex: '1',
                            margin: '20px',
                        })}
                    >
                        <img
                            src={FungiPerfectiLogo}
                            alt="Fungi Perfecti Logo"
                            className={css({ width: '100%', height: 'auto' })}
                        />
                        <div
                            className={css({
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                marginTop: '20px',
                                marginBottom: '20px',
                            })}
                        >
                            Fungi Perfecti
                        </div>
                        <div className={css({ marginBottom: '20px' })}>
                            Since its inception in 1980, Fungi Perfecti has
                            become synonymous with cutting-edge mycological
                            research and solutions. Our continued mission is to
                            explore, study, preserve, and spread knowledge about
                            the use of fungi for helping people and planet.
                        </div>
                        <Button
                            buttonType={ButtonType.primary}
                            className={css({
                                marginTop: 'auto',
                                marginBottom: '20px',
                            })}
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportedCausesSection;

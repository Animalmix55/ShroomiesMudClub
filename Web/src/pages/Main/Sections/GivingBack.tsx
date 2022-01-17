import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import PaulStametsShroom from '../../../assets/images/GIVING BACK/PAUL_S_SHROOMIE.png';
import { MOBILE } from '../../../utilties/MediaQueries';

export const GivingBackSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.mint.getCSSColor(1),
                color: theme.fontColors.normal.primary.getCSSColor(1),
                overflow: 'hidden',
                padding: '30px',
            })}
        >
            <div
                className={css({
                    maxWidth: '1000px',
                    width: '100%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    fontSize: '20px',
                    [MOBILE]: {
                        fontSize: '24px',
                    },
                })}
            >
                <div
                    className={css({
                        textTransform: 'uppercase',
                        fontSize: '40px',
                        margin: '20px',
                        fontWeight: 'bold',
                    })}
                >
                    Giving Back
                </div>
                <div
                    className={css({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        [MOBILE]: {
                            flexWrap: 'wrap',
                        },
                    })}
                >
                    <div
                        className={css({
                            backgroundColor: 'white',
                            padding: '10px',
                            margin: '10px',
                            flex: '0',
                        })}
                    >
                        <img
                            className={css({ height: '300px', width: 'auto' })}
                            src={PaulStametsShroom}
                            alt="Fantastic Paul Stamets Shroom"
                        />
                    </div>
                    <div className={css({ margin: '10px' })}>
                        <div>
                            Shroomies Mud Club is proud to partner with leading
                            Mycologist Paul Stamets of Fungi Perfecti and the
                            Netflix film Fantastic Fungi! We are working with
                            his team to Give Bees A Chance through mushroom
                            infused bee feeders - allowing bee populations to
                            increase immunity and thrive!
                        </div>
                        <br />
                        <div>
                            Minters of Shroomie Mud Club NFT’s will receive one
                            Paul Stamets bee feeder. If you prefer not to own a
                            feeder, we will donate your feeder or give $10 to
                            Fungi Perfecti.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GivingBackSection;

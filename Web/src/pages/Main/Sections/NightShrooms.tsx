import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import BG from '../../../assets/images/THE NIGHT SHROOMS/GLOW_MAIN_4.jpg';

export const NightShroomSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                fontSize: '24px',
                backgroundImage: `url(${BG})`,
                backgroundPosition: 'bottom left',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px 40px 150px 40px',
                backgroundColor: theme.pallette.darkPurple.getCSSColor(1),
                color: theme.fontColors.normal.secondary.getCSSColor(1),
                paddingBottom: '40vw',
            })}
        >
            <div
                className={css({
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <div className={css({ maxWidth: '700px', width: '100%' })}>
                    Introducing...
                </div>
                <div
                    className={css({
                        margin: '30px',
                        fontSize: '40px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                    })}
                >
                    The Night Shrooms
                </div>
                <div
                    className={css({
                        textAlign: 'center',
                        marginBottom: '30px',
                        maxWidth: '700px',
                    })}
                >
                    The Night Shrooms are a limited edition, pre-release,
                    Shroomie drop with tons of community utility - plus receive
                    a FREE mint!
                </div>
                <div
                    className={css({
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    })}
                >
                    <ul className={css({ margin: '20px' })}>
                        <li>Free mint of the main Shroomies drop</li>
                        <li>Presale access to main drop</li>
                        <li>Part of our physical game design committee</li>
                        <li>Special discord role + exclusive giveaways</li>
                    </ul>
                    <ul className={css({ margin: '20px' })}>
                        <li>Priority access to whitelist from partners</li>
                        <li>Free mints on future drops</li>
                        <li>ONLY 888 will exist ever!</li>
                        <li>Included in the main collection (high rarity)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NightShroomSection;

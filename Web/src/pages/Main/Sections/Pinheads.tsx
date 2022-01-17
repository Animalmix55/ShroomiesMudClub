import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Pinheads from '../../../assets/images/THE PINHEADS/NOOBS_TRANSPARENT.png';
import { MOBILE } from '../../../utilties/MediaQueries';

export const PinheadsSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.lightPurple.getCSSColor(1),
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.fontColors.normal.secondary.getCSSColor(1),
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
                    fontWeight: 'bold',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                The Pinheads
            </div>
            <div
                className={css({
                    textTransform: 'uppercase',
                    margin: '20px',
                    textAlign: 'center',
                })}
            >
                Look for Pinheads in future Shroomie drops!
            </div>
            <br />
            <div className={css({ maxWidth: '1000px', textAlign: 'center' })}>
                The Pinheads are juvenile Shroomies. They are highly potent and
                can be helpful or harmful depending on their state of mind.
            </div>
            <img
                src={Pinheads}
                className={css({ maxWidth: '1000px', width: '100%' })}
                alt="Pinheads"
            />
        </div>
    );
};

export default PinheadsSection;

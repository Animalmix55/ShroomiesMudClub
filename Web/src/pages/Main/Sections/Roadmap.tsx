import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Roadmap from '../../../assets/images/ROADMAP/ROADMAP_mobile_v2transp-01.png';

export const RoadmapSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                backgroundColor: theme.pallette.darkPurple.getCSSColor(1),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px',
            })}
        >
            <div
                className={css({
                    textTransform: 'uppercase',
                    fontSize: '45px',
                    fontWeight: '900',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Roadmap
            </div>
            <div
                className={css({
                    width: '100%',
                    maxWidth: '700px',
                })}
            >
                <img
                    className={css({
                        width: '100%',
                        height: 'auto',
                    })}
                    src={Roadmap}
                    alt="Roadmap"
                />
            </div>
        </div>
    );
};

export default RoadmapSection;

import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Roadmap from '../../../assets/images/ROADMAP/ROADMAP_Revised_Linear.png';
import RoadmapMobile from '../../../assets/images/ROADMAP/ROADMAP_mobile_v2transp-01.png';
import { MOBILE } from '../../../utilties/MediaQueries';

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
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Roadmap
            </div>
            <img
                className={css({
                    width: '100%',
                    maxWidth: '1000px',
                    height: 'auto',
                    [MOBILE]: {
                        display: 'none',
                    },
                })}
                src={Roadmap}
                alt="Roadmap"
            />
            <img
                className={css({
                    width: '100%',
                    maxWidth: '1000px',
                    height: 'auto',
                    display: 'none',
                    [MOBILE]: {
                        display: 'initial',
                    },
                })}
                src={RoadmapMobile}
                alt="Roadmap"
            />
        </div>
    );
};

export default RoadmapSection;

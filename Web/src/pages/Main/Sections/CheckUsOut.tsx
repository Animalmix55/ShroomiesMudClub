import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import Shroom1 from '../../../assets/images/CHECK US OUT/CHECK1.png';
import Shroom2 from '../../../assets/images/CHECK US OUT/CHECK2.jpg';
import Shroom3 from '../../../assets/images/CHECK US OUT/CHECK3.jpg';
import Shroom4 from '../../../assets/images/CHECK US OUT/CHECK4.jpg';
import Shroom5 from '../../../assets/images/CHECK US OUT/CHECK5.jpg';
import Shroom6 from '../../../assets/images/CHECK US OUT/CHECK6.jpg';
import Shroom7 from '../../../assets/images/CHECK US OUT/CHECK7.jpg';
import Shroom8 from '../../../assets/images/CHECK US OUT/CHECK8.jpg';

export const CheckUsOutSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    const imageClass = css({
        flex: '1',
        maxWidth: '300px',
        width: '100%',
        height: 'auto',
        margin: '10px',
    });

    return (
        <div
            className={css({
                padding: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.fontColors.normal.primary.getCSSColor(1),
            })}
        >
            <div>
                <div
                    className={css({
                        fontSize: '40px',
                        fontWeight: 'bold',
                        margin: '20px',
                    })}
                >
                    Check Us Out
                </div>
                <div
                    className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        maxWidth: '1000px',
                    })}
                >
                    <img src={Shroom1} alt="Shroom" className={imageClass} />
                    <img src={Shroom2} alt="Shroom" className={imageClass} />
                    <img src={Shroom3} alt="Shroom" className={imageClass} />
                    <img src={Shroom4} alt="Shroom" className={imageClass} />
                    <img src={Shroom5} alt="Shroom" className={imageClass} />
                    <img src={Shroom6} alt="Shroom" className={imageClass} />
                    <img src={Shroom7} alt="Shroom" className={imageClass} />
                    <img src={Shroom8} alt="Shroom" className={imageClass} />
                </div>
            </div>
        </div>
    );
};

export default CheckUsOutSection;

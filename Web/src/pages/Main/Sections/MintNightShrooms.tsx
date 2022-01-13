import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import BG from '../../../assets/images/THE NIGHT SHROOMS MINT STATS/GRASS_3-01.png';
import { Button, ButtonType } from '../../../atoms/Button';

export const MintNightShroomsSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    const titleStyle = css({
        margin: '30px 10px 10px 10px',
        fontSize: '25px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    });

    const bodyStyle = css({
        fontSize: '35px',
        margin: '10px',
        fontWeight: 'bold',
    });

    return (
        <div
            className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                backgroundImage: `url(${BG})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                overflow: 'auto',
                padding: '40px 40px 40px 40px',
                backgroundColor: theme.pallette.darkPurple.getCSSColor(1),
                color: theme.fontColors.normal.secondary.getCSSColor(1),
            })}
        >
            <div>
                <Button
                    className={css({
                        padding: '15px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: '10000px',
                        display: 'block',
                    })}
                    buttonType={ButtonType.primary}
                >
                    Mint Night Shrooms
                </Button>
                <div className={css({ textAlign: 'center' })}>
                    <div className={titleStyle}>Drop Count:</div>
                    <div className={bodyStyle}>888</div>
                    <div className={titleStyle}>Traits:</div>
                    <div className={bodyStyle}>180+</div>
                    <div className={titleStyle}>Trait Categories:</div>
                    <div className={bodyStyle}>11</div>
                    <div className={titleStyle}>Price:</div>
                    <div className={bodyStyle}>0.03 ETH</div>
                </div>
            </div>
        </div>
    );
};

export default MintNightShroomsSection;

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import MintButton, { MintButtonProps } from '../../../atoms/MintButton';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useCurrentTime from '../../../hooks/useCurrentTime';
import useMintDetails from '../../../hooks/useMintDetails';
import ClassNameBuilder from '../../../utilties/ClassNameBuilder';
import FormatTimeOffset from '../../../utilties/TimeFormatter';
import MintWrapper from './MintWrapper';
import NightShrooms from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/NIGHT_SHROOM_MINTPAGE2.gif';
import MintQuantityButton from '../../../atoms/MintQuantityButton';
import { MOBILE } from '../../../utilties/MediaQueries';
import useMintStatus from '../../../hooks/useMintStatus';

type TransactSectionProps = Omit<MintButtonProps, 'amount'> & { max: number };

const TransactSection = (props: TransactSectionProps): JSX.Element => {
    const [css] = useStyletron();
    const { className, mainMint, max } = props;
    const [amount, setAmount] = React.useState(1);
    const theme = useThemeContext();

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    boxSizing: 'border-box',
                })
            )}
        >
            {!mainMint && (
                <div
                    className={css({
                        width: '100%',
                        maxWidth: '435px',
                        marginBottom: '10px',
                    })}
                >
                    <img
                        src={NightShrooms}
                        alt="Shroomies"
                        className={css({ width: '100%', height: 'auto' })}
                    />
                </div>
            )}

            <div
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    textAlign: 'center',
                })}
            >
                You can mint up to {max} per transaction.
            </div>
            <div
                className={css({
                    width: '100%',
                    display: 'flex',
                    margin: '10px 0px 10px 0px',
                })}
            >
                <MintQuantityButton
                    add={false}
                    disabled={amount <= 1}
                    className={css({ marginRight: 'auto !important' })}
                    onClick={(): void =>
                        setAmount((a): number => {
                            return Math.max(a - 1, 0);
                        })
                    }
                />
                <MintButton
                    {...{
                        ...props,
                        className: css({
                            width: '100%',
                            flex: '1',
                            margin: '0px 20px 0px 20px',
                            height: '60px',
                            borderRadius: '10px',
                            [MOBILE]: {
                                display: 'none',
                            },
                        }),
                    }}
                    amount={amount}
                />
                <MintQuantityButton
                    add
                    disabled={max <= amount}
                    className={css({ marginLeft: 'auto !important' })}
                    onClick={(): void =>
                        setAmount((a): number => {
                            return Math.min(a + 1, max);
                        })
                    }
                />
            </div>
            <div>
                <MintButton
                    {...{
                        ...props,
                        className: css({
                            width: '100%',
                            display: 'none',
                            height: '60px',
                            borderRadius: '10px',
                            [MOBILE]: {
                                display: 'block',
                            },
                        }),
                    }}
                    amount={amount}
                />
            </div>
        </div>
    );
};

interface PublicMintProps {
    className?: string;
}

export const PublicMint = (props: PublicMintProps): JSX.Element => {
    const { className } = props;
    const [css] = useStyletron();
    const theme = useThemeContext();
    const { isMainMint } = useMintStatus();
    const { startDate, maxPerTransaction } = useMintDetails('public');
    const time = useCurrentTime();

    return (
        <MintWrapper className={className}>
            <div
                className={css({
                    fontSize: '45px',
                    fontWeight: '900',
                    textAlign: 'center',
                    margin: '20px',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Public
            </div>
            {startDate > time && (
                <div
                    className={css({
                        color: theme.fontColors.normal.secondary.getCSSColor(1),
                    })}
                >
                    <div
                        className={css({
                            fontWeight: 'bold',
                            fontSize: '30px',
                            textAlign: 'center',
                        })}
                    >
                        Time Until Mint:
                    </div>
                    <div className={css({ textAlign: 'center' })}>
                        {FormatTimeOffset(startDate - time)}
                    </div>
                </div>
            )}
            {startDate <= time && (
                <TransactSection
                    mainMint={isMainMint}
                    max={maxPerTransaction}
                    sale="public"
                />
            )}
        </MintWrapper>
    );
};

export default PublicMint;

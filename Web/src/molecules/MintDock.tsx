import { IconButton, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import MintButton from '../atoms/MintButton';
import { useThemeContext } from '../contexts/ThemeContext';
import useCurrentTime from '../hooks/useCurrentTime';
import useMintDetails from '../hooks/useMintDetails';
import useWhitelistCounts from '../hooks/useWhitelistCounts';
import { MOBILE } from '../utilties/MediaQueries';
import FormatTimeOffset from '../utilties/TimeFormatter';

interface SaleModuleProps {
    target: 'presale' | 'public';
    startDate: number;
    endDate?: number;
    eligibleCount?: number;
    maxPerTransaction?: number;
    disabled?: boolean;
    onTransact?: (trans: PromiEvent<TransactionReceipt>) => void;
    refreshCounts: () => void;
}

export const SaleModule = (props: SaleModuleProps): JSX.Element => {
    const {
        target,
        startDate,
        endDate,
        eligibleCount,
        maxPerTransaction,
        refreshCounts,
        onTransact,
        disabled,
    } = props;

    const theme = useThemeContext();
    const time = useCurrentTime();
    const [css] = useStyletron();
    const [amount, setAmount] = React.useState(1);

    const displayName = React.useMemo(() => {
        switch (target) {
            case 'presale':
                return 'Whitelist Mint';
            default:
            case 'public':
                return 'Public Mint';
        }
    }, [target]);

    if (endDate && time > endDate) return <></>;

    const addDisabled = amount >= maxPerTransaction || amount >= eligibleCount;
    const subtractDisabled = amount <= 1;

    return (
        <div
            className={css({
                color: theme.fontColors.normal.primary.getCSSColor(1),
                margin: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                borderRadius: '10px',
                overflow: 'hidden',
                padding: '80px 150px 80px 150px',
                alignSelf: 'stretch',
                [MOBILE]: {
                    marginLeft: 'unset !important',
                    marginRight: 'unset !important',
                    backgroundImage: 'unset !important',
                    backgroundColor: theme.backgroundColor.getCSSColor(0.7),
                    width: 'unset',
                    padding: '20px',
                    height: 'unset',
                },
            })}
        >
            <h1
                className={css({
                    color: theme.fontColors.normal.primary.getCSSColor(1),
                })}
            >
                {displayName}
            </h1>
            {eligibleCount === 0 && (
                <div
                    className={css({ maxWidth: '340px', textAlign: 'center' })}
                >
                    Sorry, you are not eligible for {displayName.toLowerCase()}
                </div>
            )}
            {(eligibleCount === undefined || eligibleCount > 0) &&
                startDate > time && (
                    <>
                        <div
                            className={css({
                                maxWidth: '340px',
                                textAlign: 'center',
                            })}
                        >
                            Time Until {displayName}:{' '}
                            {FormatTimeOffset(startDate - time)}
                        </div>
                        {eligibleCount !== undefined && (
                            <div
                                className={css({
                                    maxWidth: '340px',
                                    textAlign: 'center',
                                })}
                            >
                                You have {eligibleCount}{' '}
                                {displayName.toLowerCase()} slots!
                            </div>
                        )}
                    </>
                )}
            {eligibleCount !== 0 &&
                startDate <= time &&
                (!endDate || endDate >= time) && (
                    <>
                        {eligibleCount !== undefined && (
                            <div
                                className={css({
                                    maxWidth: '340px',
                                    textAlign: 'center',
                                })}
                            >
                                You have {eligibleCount}{' '}
                                {displayName.toLowerCase()} slots!
                            </div>
                        )}
                        {endDate && (
                            <div
                                className={css({
                                    maxWidth: '340px',
                                    textAlign: 'center',
                                    fontSize: '10px',
                                })}
                            >
                                Time Remaining:{' '}
                                {FormatTimeOffset(endDate - time)}
                            </div>
                        )}
                        {maxPerTransaction !== undefined && (
                            <div
                                className={css({
                                    maxWidth: '340px',
                                    textAlign: 'center',
                                })}
                            >
                                Max per transaction: {maxPerTransaction}
                            </div>
                        )}
                        <div
                            className={css({
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '20px',
                            })}
                        >
                            <IconButton
                                className={css({
                                    marginRight: '20px',
                                })}
                                disabled={subtractDisabled}
                                onClick={(): void =>
                                    setAmount((a) => Math.max(1, a - 1))
                                }
                                iconProps={{
                                    iconName: 'SkypeCircleMinus',
                                    className: css({
                                        color: subtractDisabled
                                            ? theme.buttonColors.normal.disabled.getCSSColor(
                                                  1
                                              )
                                            : theme.buttonColors.normal.primary.getCSSColor(
                                                  1
                                              ),
                                        fontSize: '50px',
                                        ':hover': {
                                            color: subtractDisabled
                                                ? theme.buttonColors.hovered.disabled.getCSSColor(
                                                      1
                                                  )
                                                : theme.buttonColors.hovered.primary.getCSSColor(
                                                      1
                                                  ),
                                        },
                                    }),
                                }}
                            />
                            <MintButton
                                className={css({
                                    marginTop: '10px',
                                    height: '90px',
                                    borderRadius: '10px',
                                    [MOBILE]: {
                                        fontSize: '80%',
                                    },
                                })}
                                sale={target}
                                amount={amount}
                                disabled={disabled}
                                onTransact={(trans): void => {
                                    onTransact?.(trans);
                                    trans.finally((): void => {
                                        refreshCounts();
                                        setAmount(1);
                                    });
                                }}
                            />
                            <IconButton
                                className={css({
                                    marginLeft: '20px',
                                })}
                                disabled={addDisabled}
                                onClick={(): void =>
                                    setAmount((a) =>
                                        Math.min(
                                            maxPerTransaction || Infinity,
                                            eligibleCount || Infinity,
                                            a + 1
                                        )
                                    )
                                }
                                iconProps={{
                                    iconName: 'CircleAdditionSolid',
                                    className: css({
                                        fontSize: '50px',
                                        color: addDisabled
                                            ? theme.buttonColors.normal.disabled.getCSSColor(
                                                  1
                                              )
                                            : theme.buttonColors.normal.primary.getCSSColor(
                                                  1
                                              ),
                                        ':hover': {
                                            color: addDisabled
                                                ? theme.buttonColors.hovered.disabled.getCSSColor(
                                                      1
                                                  )
                                                : theme.buttonColors.hovered.primary.getCSSColor(
                                                      1
                                                  ),
                                        },
                                    }),
                                }}
                            />
                        </div>
                    </>
                )}
        </div>
    );
};

export const MintDock = (): JSX.Element => {
    const { startDate: presaleStart, endDate: presaleEnd } =
        useMintDetails('presale');

    const { startDate: publicStart, maxPerTransaction: publicMax } =
        useMintDetails('public');

    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    const [showInfo, setShowInfo] = React.useState<boolean>(true);
    const [disablePreminting, setDisablePreminting] =
        React.useState<boolean>(false);
    const [loadTime] = React.useState(Date.now() / 1000);

    const { presale: presaleCount, reload } = useWhitelistCounts();
    const [css] = useStyletron();

    return (
        <div
            className={css({
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: '30px',
            })}
        >
            {showInfo && (presaleStart >= loadTime || publicStart >= loadTime) && (
                <MessageBar
                    onDismiss={(): void => setShowInfo(false)}
                    className={css({ margin: '10px' })}
                    messageBarType={MessageBarType.info}
                    messageBarIconProps={{ iconName: 'Warning' }}
                >
                    You should not need to refresh the page when mints begin.
                    But you can if you want to!{' '}
                    <b>
                        Be aware that mints may take up to 1-2 minutes to open
                        after the timer completes due to delays in block
                        generation.
                    </b>
                </MessageBar>
            )}
            {presaleCount > 0 && (
                <>
                    {showAlert && (
                        <MessageBar
                            onDismiss={(): void => setShowAlert(false)}
                            title="Notice"
                            className={css({ margin: '10px' })}
                            messageBarType={MessageBarType.warning}
                            messageBarIconProps={{ iconName: 'Warning' }}
                        >
                            Heads up: Only one whitelist mint transaction can
                            occur at a time. Only the first verified transaction
                            will succeed.
                        </MessageBar>
                    )}
                    <SaleModule
                        target="presale"
                        startDate={presaleStart}
                        endDate={presaleEnd}
                        eligibleCount={presaleCount}
                        disabled={disablePreminting}
                        refreshCounts={reload}
                        onTransact={(v): void => {
                            setShowAlert(true);
                            setDisablePreminting(true);

                            v.finally(() => setDisablePreminting(false));
                        }}
                    />
                </>
            )}
            <SaleModule
                target="public"
                startDate={publicStart}
                refreshCounts={reload}
                maxPerTransaction={publicMax}
            />
        </div>
    );
};

export default MintDock;

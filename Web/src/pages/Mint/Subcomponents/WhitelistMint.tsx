/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Spinner, SpinnerSize, TextField } from '@fluentui/react';
import { toast } from 'react-toastify';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useWhitelistCounts from '../../../hooks/useWhitelistCounts';
import ClassNameBuilder from '../../../utilties/ClassNameBuilder';
import useMintStatus from '../../../hooks/useMintStatus';
import Button, { ButtonType } from '../../../atoms/Button';
import { useContractContext } from '../../../contexts/ContractContext';
import useWhitelistEligibleNightShrooms from '../../../hooks/useWhitelistEligibleNightShrooms';
import TokenGrid from '../../../molecules/TokenGrid';
import MintButton, { MintButtonProps } from '../../../atoms/MintButton';
import NightShrooms from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/NIGHT_SHROOM_MINTPAGE2.gif';
import useWeb3 from '../../../contexts/Web3Context';
import useBatchSignatureGetter from '../../../hooks/useBatchSignatureGetter';
import AddButton from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/PLUS_GREEN.png';
import AddButtonDisabled from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/PLUS_GREY.png';
import MinusButton from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/MINUS_ORANGE.png';
import MinusButtonDisabled from '../../../assets/images/MINTPAGE/NIGHT SHROOMS/MINUS_GREY.png';
import { useBatchSignature } from '../../../hooks/useBatchSignature';
import useAlreadyMintedInBatch from '../../../hooks/useAlreadyMintedInBatch';
import { useShroomieContext } from '../../../contexts/ShroomieContext';
import { MOBILE } from '../../../utilties/MediaQueries';

export const MintQuantityButton = ({
    add,
    onClick,
    disabled,
    className,
}: {
    add: boolean;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}): JSX.Element => {
    const [css] = useStyletron();
    const buttonImage = React.useMemo(() => {
        if (add) {
            if (disabled) return AddButtonDisabled;
            return AddButton;
        }

        if (disabled) return MinusButtonDisabled;
        return MinusButton;
    }, [add, disabled]);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type="button"
            className={ClassNameBuilder(
                className,
                css({ all: 'unset', cursor: 'pointer !important' })
            )}
        >
            <img
                src={buttonImage}
                className={css({ width: '100%', height: 'auto' })}
                alt={add ? 'Plus' : 'Minus'}
            />
        </button>
    );
};

interface AdditionalInfo {
    spendingIds?: number[];
    secretCode?: string;
}

export enum WhitelistType {
    SecondaryHolder,
    UserWhitelist,
    BulkWhitelist,
}

interface WhitelistTypeSectionProps {
    type?: WhitelistType;
    onTypeSelected: (type: WhitelistType) => void;
}

const ContinueButton = ({
    onClick,
    disabled,
}: {
    onClick: () => void | Promise<void>;
    disabled?: boolean;
}): JSX.Element => {
    const [css] = useStyletron();

    const [loading, setLoading] = React.useState(false);
    const onClickInner = React.useCallback(async () => {
        setLoading(true);
        try {
            await onClick();
        } catch (e) {
            toast(String(e), { type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [onClick]);

    return (
        <div>
            <Button
                buttonType={ButtonType.primary}
                className={css({
                    borderRadius: '10px',
                    padding: '5px',
                    display: 'flex',
                    margin: '30px 10px 0px auto',
                    alignItems: 'center',
                })}
                onClick={onClickInner}
                disabled={disabled || loading}
            >
                <span>Continue</span>
                {loading && (
                    <Spinner
                        className={css({ marginLeft: '5px' })}
                        size={SpinnerSize.small}
                    />
                )}
            </Button>
        </div>
    );
};

const WhitelistTypeButton = ({
    title,
    description,
    selected,
    onClick,
    disabled,
    className,
}: {
    title: string;
    description: string;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}): JSX.Element => {
    const [css] = useStyletron();

    return (
        <Button
            type="button"
            buttonType={ButtonType.secondary}
            onClick={onClick}
            className={ClassNameBuilder(
                className,
                css({
                    display: 'block',
                    margin: '10px',
                    textAlign: 'left',
                    borderRadius: '10px',
                    padding: '10px',
                    boxSizing: 'border-box',
                    ...(selected && {
                        boxShadow: '0px 0px 5px #fff',
                    }),
                })
            )}
            disabled={disabled}
            forceHover={selected}
        >
            <div>{title}</div>
            <div className={css({ fontWeight: 'normal' })}>{description}</div>
        </Button>
    );
};

const WhitelistTypeSection = (
    props: WhitelistTypeSectionProps
): JSX.Element => {
    const { type, onTypeSelected } = props;
    const { isMainMint } = useMintStatus();

    const { main: mainWhitelistCount, secondary: secondaryWhitelistCount } =
        useWhitelistCounts();
    const whitelistEligibleShrooms = useWhitelistEligibleNightShrooms();

    const [value, setValue] = React.useState(type);
    const [css] = useStyletron();

    return (
        <div className={css({ display: 'flex', flexDirection: 'column' })}>
            <WhitelistTypeButton
                title="Night Shroom Holder"
                description="Holders of Night Shrooms get whitelist access to the Shroomie mint."
                selected={value === WhitelistType.SecondaryHolder}
                onClick={(): void => setValue(WhitelistType.SecondaryHolder)}
                disabled={!isMainMint || whitelistEligibleShrooms.length === 0}
            />
            <WhitelistTypeButton
                title="Whitelist Recipient"
                description="Use whitelist slots awarded from promotional campaigns."
                selected={value === WhitelistType.UserWhitelist}
                onClick={(): void => setValue(WhitelistType.UserWhitelist)}
                disabled={
                    isMainMint
                        ? mainWhitelistCount === 0
                        : secondaryWhitelistCount === 0
                }
            />
            <WhitelistTypeButton
                title="Bulk Whitelist Password"
                description="Use a special whitelist password to mint."
                selected={value === WhitelistType.BulkWhitelist}
                onClick={(): void => setValue(WhitelistType.BulkWhitelist)}
            />
            <ContinueButton
                disabled={value === undefined}
                onClick={(): void => {
                    if (value) onTypeSelected(value);
                }}
            />
        </div>
    );
};

const AdditionalInfoSection = ({
    type,
    setAdditionalInfo,
    additionalInfo,
}: {
    type?: WhitelistType;
    setAdditionalInfo: React.Dispatch<React.SetStateAction<AdditionalInfo>>;
    additionalInfo: AdditionalInfo;
}): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();
    const { tokenContract } = useContractContext();
    const [value, setValue] = React.useState<AdditionalInfo>(additionalInfo);
    const whitelistEligibleShrooms = useWhitelistEligibleNightShrooms();
    const { accounts } = useWeb3();
    const batchSignatureGetter = useBatchSignatureGetter(accounts[0]);

    return (
        <div className={css({ display: 'flex', flexDirection: 'column' })}>
            {type === WhitelistType.BulkWhitelist && (
                <>
                    <TextField
                        styles={{
                            description: {
                                color: `${theme.fontColors.normal.secondary.getCSSColor(
                                    1
                                )} !important`,
                            },
                            root: {
                                margin: '10px',
                                selectors: {
                                    '.ms-label': {
                                        color: `${theme.fontColors.normal.secondary.getCSSColor(
                                            1
                                        )} !important`,
                                    },
                                },
                            },
                        }}
                        type="password"
                        label="Enter Mint Code"
                        placeholder="MINT-CODE"
                        description="This is the secret code provided to allow you access into a whitelist batch mint."
                        canRevealPassword
                        value={value.secretCode}
                        onChange={(_, v): void => setValue({ secretCode: v })}
                    />
                    <ContinueButton
                        onClick={async (): Promise<void> => {
                            if (!value.secretCode)
                                throw new Error('No code provided');
                            try {
                                await batchSignatureGetter(value.secretCode);
                                setAdditionalInfo(value);
                            } catch (e) {
                                if (String(e).includes('404'))
                                    throw new Error('Code not found');
                                else throw e;
                            }
                        }}
                        disabled={!value.secretCode?.trim().includes('-')}
                    />
                </>
            )}

            {type === WhitelistType.SecondaryHolder && (
                <div
                    className={css({
                        color: theme.fontColors.normal.secondary.getCSSColor(1),
                    })}
                >
                    <div
                        className={css({
                            fontSize: '35px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        })}
                    >
                        Select Night Shrooms
                    </div>
                    <div
                        className={css({
                            fontSize: '10px',
                            textAlign: 'center',
                        })}
                    >
                        These tokens are not affected, they just will no longer
                        be usable for whitelist after transacting.
                    </div>
                    <div
                        className={css({ overflow: 'auto', maxWidth: '900px' })}
                    >
                        <TokenGrid
                            tokens={whitelistEligibleShrooms}
                            contract={tokenContract}
                            selectedTokens={value.spendingIds || []}
                            onChange={(v): void => setValue({ spendingIds: v })}
                        />
                    </div>
                    <ContinueButton
                        onClick={(): void => setAdditionalInfo(value)}
                        disabled={!value.spendingIds?.length}
                    />
                </div>
            )}
        </div>
    );
};

type TransactSectionProps = Omit<MintButtonProps, 'amount'>;

const TransactSection = (props: TransactSectionProps): JSX.Element => {
    const [css] = useStyletron();
    const { className, mainMint, type, batchSecret } = props;
    const [amount, setAmount] = React.useState(1);
    const { accounts } = useWeb3();

    const theme = useThemeContext();
    const batch = useBatchSignature(accounts[0], batchSecret);
    const mintedInBatch = useAlreadyMintedInBatch(batchSecret);
    const whitelist = useWhitelistCounts();

    const max = React.useMemo(() => {
        let max = 0;
        if (whitelist.main) {
            if (type === WhitelistType.BulkWhitelist) {
                if (batch && batch.mainCollection) max = batch.batchSize;
            } else {
                max = whitelist.main;
            }
        } else if (type === WhitelistType.BulkWhitelist) {
            if (batch && !batch.mainCollection) max = batch.batchSize;
        } else {
            max = whitelist.secondary;
        }
        return max - mintedInBatch;
    }, [batch, mintedInBatch, type, whitelist]);

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
                {max > 0 && `You can mint up to ${max} in this mint.`}
                {max === 0 && 'You are not eligible to mint.'}
            </div>
            <div
                className={css({
                    width: '100%',
                    display: 'flex',
                    margin: '10px 0px 10px 0px',
                })}
            >
                {type !== WhitelistType.SecondaryHolder && (
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
                )}
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
                {type !== WhitelistType.SecondaryHolder && (
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
                )}
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

export const CompleteSection = ({
    tx,
    returnToStart,
}: {
    returnToStart?: () => void;
    tx?: PromiEvent<TransactionReceipt>;
}): JSX.Element => {
    const [failureReason, setFailureReason] = React.useState<string>();
    const [complete, setComplete] = React.useState(false);
    const [txHash, setTxHash] = React.useState<string>();
    const { etherscanUrl } = useShroomieContext();

    React.useEffect(() => {
        if (!tx) {
            setFailureReason(undefined);
            setTxHash(undefined);
            return;
        }

        tx.on('transactionHash', setTxHash)
            .on('error', (e) => setFailureReason(e.message))
            .then(() => setComplete(true));
    }, [tx]);

    const [css] = useStyletron();
    const theme = useThemeContext();

    const headerClass = css({
        fontSize: '30px',
        fontWeight: 'bold',
        textAlign: 'center',
    });

    return (
        <div
            className={css({
                color: theme.fontColors.normal.secondary.getCSSColor(1),
            })}
        >
            {tx && !complete && !failureReason && (
                <div>
                    <div className={headerClass}>Transaction Pending</div>
                    <Spinner size={SpinnerSize.large} />
                </div>
            )}
            {complete && (
                <div>
                    <div className={headerClass}>Transaction Succeeded!</div>
                </div>
            )}
            {failureReason && (
                <div>
                    <div className={headerClass}>Transaction Failed</div>
                    <div
                        className={css({
                            fontSize: '12px',
                            textAlign: 'center',
                        })}
                    >
                        {failureReason}
                    </div>
                </div>
            )}
            {txHash && (
                <div className={css({ display: 'flex', flexWrap: 'wrap' })}>
                    <span
                        className={css({
                            marginRight: '10px',
                        })}
                    >
                        View on Etherscan:
                    </span>
                    <span
                        className={css({
                            overflow: 'hidden',
                            textAlign: 'center',
                            marginLeft: 'auto',
                            maxWidth: '200px',
                        })}
                    >
                        <a
                            href={`${etherscanUrl}/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className={css({
                                textOverflow: 'ellipsis',
                                textAlign: 'center',
                                overflow: 'hidden',
                                display: 'block',
                                color: theme.fontColors.normal.secondary.getCSSColor(
                                    1
                                ),
                            })}
                        >
                            {txHash}
                        </a>
                    </span>
                </div>
            )}
            {(complete || failureReason) && (
                <Button
                    className={css({
                        width: '100%',
                        height: '60px',
                        margin: '40px 0px 10px 0px',
                        borderRadius: '10px',
                    })}
                    buttonType={ButtonType.secondary}
                    onClick={returnToStart}
                >
                    Mint More
                </Button>
            )}
        </div>
    );
};

interface WhitelistMintProps {
    className?: string;
}

export const WhitelistMint = (props: WhitelistMintProps): JSX.Element => {
    const { className } = props;

    const [css] = useStyletron();
    const [step, setStep] = React.useState(0);
    const [type, setType] = React.useState<WhitelistType>();
    const [additionalInfo, setAdditionalInfo] = React.useState<AdditionalInfo>(
        {}
    );
    const [tx, setTx] = React.useState<PromiEvent<TransactionReceipt>>();
    const theme = useThemeContext();
    const { isMainMint } = useMintStatus();

    const steps = React.useMemo(
        () => [
            'Select Eligibility',
            ...(type !== WhitelistType.UserWhitelist
                ? ['Provide Additional Info']
                : []),
            'Transact',
            'Complete',
        ],
        [type]
    );

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.backgroundColor.getCSSColor(0.2),
                    boxSizing: 'border-box',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '500px',
                })
            )}
        >
            {step > 0 && step < steps.length - 1 && (
                <div>
                    <Button
                        className={css({
                            margin: '10px',
                            borderRadius: '10px',
                        })}
                        buttonType={ButtonType.secondary}
                        onClick={(): void => setStep((s) => Math.max(0, s - 1))}
                    >
                        Back
                    </Button>
                </div>
            )}
            <div
                className={css({
                    fontSize: '45px',
                    fontWeight: '900',
                    textAlign: 'center',
                    margin: '20px',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Whitelist
            </div>
            <Box sx={{ width: '100%', marginBottom: '20px' }}>
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map((label, i) => (
                        <Step
                            onClick={(): void => setStep((j) => Math.min(i, j))}
                            className={css({ cursor: 'pointer' })}
                            key={label}
                            tabIndex={0}
                        >
                            <StepLabel
                                componentsProps={{
                                    label: {
                                        className: css({
                                            textAlign: 'center',
                                            color: theme.fontColors.normal.secondary.getCSSColor(
                                                1
                                            ),
                                        }),
                                    },
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <div>
                {steps[step] === 'Select Eligibility' && (
                    <WhitelistTypeSection
                        type={type}
                        onTypeSelected={(t): void => {
                            setType(t);
                            setStep((s) => s + 1);
                        }}
                    />
                )}
                {steps[step] === 'Provide Additional Info' && (
                    <AdditionalInfoSection
                        type={type}
                        additionalInfo={additionalInfo}
                        setAdditionalInfo={(a): void => {
                            setAdditionalInfo(a);
                            setStep((s) => s + 1);
                        }}
                    />
                )}
                {steps[step] === 'Transact' && (
                    <TransactSection
                        type={type}
                        spendingIds={additionalInfo.spendingIds}
                        batchSecret={additionalInfo.secretCode}
                        sale="presale"
                        mainMint={!!isMainMint}
                        onTransact={(t): void => {
                            setTx(t);
                            setStep((s) => s + 1);
                        }}
                    />
                )}
                {steps[step] === 'Complete' && (
                    <CompleteSection
                        returnToStart={(): void => {
                            setStep(0);
                            setAdditionalInfo({});
                        }}
                        tx={tx}
                    />
                )}
            </div>
        </div>
    );
};

export default WhitelistMint;

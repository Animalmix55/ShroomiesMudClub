/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { TextField } from '@fluentui/react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useWhitelistCounts from '../../../hooks/useWhitelistCounts';
import ClassNameBuilder from '../../../utilties/ClassNameBuilder';
import useMintStatus from '../../../hooks/useMintStatus';
import Button, { ButtonType } from '../../../atoms/Button';
import { useContractContext } from '../../../contexts/ContractContext';
import useWhitelistEligibleNightShrooms from '../../../hooks/useWhitelistEligibleNightShrooms';
import TokenGrid from '../../../molecules/TokenGrid';
import MintButton, { MintButtonProps } from '../../../atoms/MintButton';

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
    onClick: () => void;
    disabled?: boolean;
}): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div>
            <Button
                buttonType={ButtonType.primary}
                className={css({
                    borderRadius: '10px',
                    padding: '5px',
                    display: 'block',
                    margin: '30px 10px 0px auto',
                })}
                onClick={onClick}
                disabled={disabled}
            >
                Continue
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

    const { presale } = useWhitelistCounts(isMainMint);
    const whitelistEligibleShrooms = useWhitelistEligibleNightShrooms();

    const [value, setValue] = React.useState<WhitelistType>(type);
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
                disabled={presale === 0}
            />
            <WhitelistTypeButton
                title="Bulk Whitelist Password"
                description="Use a special whitelist password to mint."
                selected={value === WhitelistType.BulkWhitelist}
                onClick={(): void => setValue(WhitelistType.BulkWhitelist)}
            />
            <ContinueButton
                disabled={value === undefined}
                onClick={(): void => onTypeSelected(value)}
            />
        </div>
    );
};

const AdditionalInfoSection = ({
    type,
    setAdditionalInfo,
    additionalInfo,
}: {
    type: WhitelistType;
    setAdditionalInfo: React.Dispatch<React.SetStateAction<AdditionalInfo>>;
    additionalInfo: AdditionalInfo;
}): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();
    const { tokenContract } = useContractContext();
    const [value, setValue] = React.useState<AdditionalInfo>(additionalInfo);
    const whitelistEligibleShrooms = useWhitelistEligibleNightShrooms();

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
                        onClick={(): void => setAdditionalInfo(value)}
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
    const [amount, setAmount] = React.useState(1);

    return (
        <div className={css({ display: 'flex', flexDirection: 'column' })}>
            <MintButton {...props} amount={amount} />
        </div>
    );
};

interface WhitelistMintProps {
    className?: string;
}

const steps = [
    'Select Eligibility',
    'Provide Additional Info',
    'Transact',
    'Complete',
];

export const WhitelistMint = (props: WhitelistMintProps): JSX.Element => {
    const { className } = props;

    const [css] = useStyletron();
    const [step, setStep] = React.useState(0);
    const [type, setType] = React.useState<WhitelistType>();
    const [additionalInfo, setAdditionalInfo] = React.useState<AdditionalInfo>(
        {}
    );
    const theme = useThemeContext();
    const { isMainMint } = useMintStatus();

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.backgroundColor.getCSSColor(0.2),
                    padding: '40px',
                })
            )}
        >
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
                {step === 0 && (
                    <WhitelistTypeSection
                        type={type}
                        onTypeSelected={(t): void => {
                            setType(t);
                            setStep((s) =>
                                type === WhitelistType.UserWhitelist
                                    ? s + 2
                                    : s + 1
                            );
                        }}
                    />
                )}
                {step === 1 && (
                    <AdditionalInfoSection
                        type={type}
                        additionalInfo={additionalInfo}
                        setAdditionalInfo={(a): void => {
                            setAdditionalInfo(a);
                            setStep((s) => s + 1);
                        }}
                    />
                )}
                {step === 2 && (
                    <TransactSection
                        type={type}
                        spendingIds={additionalInfo.spendingIds}
                        batchSecret={additionalInfo.secretCode}
                        sale="presale"
                        mainMint={isMainMint}
                        onTransact={(t): void => {
                            t.then(() => {
                                setAdditionalInfo({});
                                setStep((s) => s + 1);
                            });
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default WhitelistMint;

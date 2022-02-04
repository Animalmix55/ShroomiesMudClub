import BigDecimal from 'js-big-decimal';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { PromiEvent } from 'web3-core';
import { TransactionReceipt } from 'web3-eth';
import { getBatchSignature, getMintSignature } from '../api/Requests';
import { useContractContext } from '../contexts/ContractContext';
import { useShroomieContext } from '../contexts/ShroomieContext';
import useWeb3 from '../contexts/Web3Context';
import useMintPrice from '../hooks/useMintPrice';
import { Shroomies } from '../models/Shroomies';
import { WhitelistType } from '../pages/Mint/Subcomponents/WhitelistMint';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { BASE, roundAndDisplay, ZERO } from '../utilties/Numbers';
import { ButtonType } from './Button';
import TransactionButton from './TransactionButton';

export const WeiToEth = (wei: number): number => wei / 1000000000000000000;

export interface MintButtonProps {
    sale: 'presale' | 'public';
    mainMint: boolean;
    type?: WhitelistType;
    batchSecret?: string;
    spendingIds?: number[];
    amount: number;
    className?: string;
    disabled?: boolean;
    onTransact?: (val: PromiEvent<TransactionReceipt>) => void;
}
export const MintButton = (props: MintButtonProps): JSX.Element => {
    const {
        sale,
        type,
        batchSecret,
        spendingIds,
        amount,
        onTransact,
        className,
        disabled,
        mainMint,
    } = props;

    const [css] = useStyletron();
    const { tokenContract: contract } = useContractContext();
    const price = useMintPrice(contract);
    const { accounts } = useWeb3();

    const mintPrice = React.useMemo(
        () =>
            price.multiply(
                new BigDecimal(
                    type === WhitelistType.SecondaryHolder ? 0 : amount // secondary holders mint free
                )
            ),
        [amount, price, type]
    );

    const { api } = useShroomieContext();

    const getUserWhitelistMintParams = React.useCallback(async (): Promise<
        Parameters<Shroomies['methods']['userWhitelistMint']>
    > => {
        if (!contract) throw new Error('No contract');
        if (!accounts[0]) throw new Error('Not logged in');

        const { signature, nonce } = await getMintSignature(
            api,
            amount,
            accounts[0],
            mainMint
        );

        return [amount, mainMint, nonce, signature];
    }, [accounts, amount, api, contract, mainMint]);

    const getBatchWhitelistMintParams = React.useCallback(async (): Promise<
        Parameters<Shroomies['methods']['batchWhitelistMint']>
    > => {
        if (!contract) throw new Error('No contract');
        if (!accounts[0]) throw new Error('Not logged in');
        if (!batchSecret) throw new Error('Missing batch secret');

        const { signature, batchSize, mainCollection, validUntil } =
            await getBatchSignature(api, batchSecret, accounts[0]);

        if (mainCollection !== mainMint)
            throw new Error('Batch in different collection');

        return [
            amount,
            mainMint,
            batchSecret.split('-')[0],
            batchSize,
            validUntil,
            signature,
        ];
    }, [accounts, amount, api, batchSecret, contract, mainMint]);

    if (!contract) return <div>Missing contract</div>;

    if (sale === 'public') {
        return (
            <TransactionButton
                contract={contract}
                method="mint"
                params={[amount]}
                tx={{
                    from: accounts[0],
                    value: mintPrice.multiply(BASE).floor().getValue(),
                }}
                buttonType={ButtonType.primary}
                type="button"
                onTransact={onTransact}
                disabled={
                    !contract ||
                    !accounts[0] ||
                    price.compareTo(ZERO) === 0 ||
                    disabled
                }
                className={ClassNameBuilder(
                    css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }),
                    className
                )}
            >
                Mint {amount} ({roundAndDisplay(mintPrice)} ETH + GAS)
            </TransactionButton>
        );
    }

    switch (type) {
        case WhitelistType.BulkWhitelist:
            return (
                <TransactionButton
                    contract={contract}
                    method="batchWhitelistMint"
                    params={getBatchWhitelistMintParams}
                    tx={{
                        from: accounts[0],
                        value: mintPrice.multiply(BASE).floor().getValue(),
                    }}
                    buttonType={ButtonType.primary}
                    type="button"
                    onTransact={onTransact}
                    disabled={
                        !contract ||
                        !accounts[0] ||
                        price === undefined ||
                        !amount ||
                        disabled
                    }
                    className={ClassNameBuilder(
                        css({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),
                        className
                    )}
                >
                    Mint {amount} ({roundAndDisplay(mintPrice)} ETH + GAS)
                </TransactionButton>
            );
        case WhitelistType.SecondaryHolder:
            return (
                <TransactionButton
                    contract={contract}
                    method="secondaryHolderWhitelistMint"
                    params={async (): Promise<[number[]]> => {
                        if (!spendingIds?.length)
                            throw new Error(
                                'Select tokens to use for whitelist.'
                            );
                        return [spendingIds];
                    }}
                    tx={{
                        from: accounts[0],
                        value: mintPrice.multiply(BASE).floor().getValue(),
                    }}
                    buttonType={ButtonType.primary}
                    type="button"
                    onTransact={onTransact}
                    disabled={
                        !contract ||
                        !accounts[0] ||
                        price === undefined ||
                        !spendingIds?.length ||
                        disabled
                    }
                    className={ClassNameBuilder(
                        css({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),
                        className
                    )}
                >
                    Mint {spendingIds?.length || 0} (
                    {roundAndDisplay(mintPrice)} ETH + GAS)
                </TransactionButton>
            );
        default:
        case WhitelistType.UserWhitelist:
            return (
                <TransactionButton
                    contract={contract}
                    method="userWhitelistMint"
                    params={getUserWhitelistMintParams}
                    tx={{
                        from: accounts[0],
                        value: mintPrice.multiply(BASE).floor().getValue(),
                    }}
                    buttonType={ButtonType.primary}
                    type="button"
                    onTransact={onTransact}
                    disabled={
                        !contract ||
                        !accounts[0] ||
                        price === undefined ||
                        !amount ||
                        disabled
                    }
                    className={ClassNameBuilder(
                        css({
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }),
                        className
                    )}
                >
                    Mint {amount} ({roundAndDisplay(mintPrice)} ETH + GAS)
                </TransactionButton>
            );
    }
};

export default MintButton;

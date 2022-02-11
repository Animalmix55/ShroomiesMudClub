/* eslint-disable react/jsx-props-no-spreading */
import { Icon, Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { toast } from 'react-toastify';
import { useStyletron } from 'styletron-react';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { useShroomieContext } from '../contexts/ShroomieContext';
import { BaseContract, NonPayableTx, PayableTx } from '../models/types';
import Button, { ButtonProps } from './Button';

export interface TransactionButtonProps<
    T extends BaseContract,
    M extends keyof T['methods']
> extends ButtonProps {
    contract: T;
    method: M;
    params:
        | Parameters<T['methods'][M]>
        | ((
              props: Omit<TransactionButtonProps<T, M>, 'params'>
          ) => Promise<Parameters<T['methods'][M]>>);
    onTransact?: (val: PromiEvent<TransactionReceipt>) => void;
    tx?: NonPayableTx | PayableTx;
}

export const TransactionButton = <
    T extends BaseContract,
    M extends keyof T['methods']
>(
    props: TransactionButtonProps<T, M>
): JSX.Element => {
    const {
        contract,
        method,
        params,
        onTransact,
        disabled,
        tx,
        children: childrenProp,
        onClick: onClickProp,
    } = props;
    const { etherscanUrl } = useShroomieContext();
    const [pending, setPending] = React.useState(false);
    const [hash, setHash] = React.useState('');
    const [css] = useStyletron();

    const onClick: React.MouseEventHandler<HTMLButtonElement> =
        React.useCallback(
            async (e) => {
                if (pending && hash) {
                    window.open(`${etherscanUrl}/tx/${hash}`, '_blank');
                    return;
                }
                setPending(true);

                onClickProp?.(e);

                let functionParams: Parameters<T['methods'][M]>;

                try {
                    functionParams =
                        typeof params === 'function'
                            ? await params(props)
                            : params;
                    await contract.methods[method](
                        ...functionParams
                    ).estimateGas(tx);
                } catch (error) {
                    setPending(false);
                    toast(
                        (typeof error === 'object'
                            ? error.message
                            : String(error)
                        ).split('{')[0],
                        { type: 'error' }
                    );
                    return;
                }

                const trans = contract.methods[method](...functionParams).send(
                    tx
                ) as PromiEvent<TransactionReceipt>;

                onTransact?.(trans);
                trans
                    .finally(() => {
                        setPending(false);
                        setHash('');
                    })
                    .then((tx) =>
                        toast(
                            <div
                                className={css({
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                })}
                            >
                                <span>Transaction Succeeded</span>
                                <Icon
                                    className={css({ marginLeft: '5px' })}
                                    iconName="OpenInNewWindow"
                                />
                            </div>,
                            {
                                type: 'success',
                                onClick: () =>
                                    window.open(
                                        `${etherscanUrl}/tx/${tx.transactionHash}`,
                                        '_blank'
                                    ),
                            }
                        )
                    );
                trans.on('transactionHash', setHash);
            },
            [
                contract.methods,
                css,
                etherscanUrl,
                hash,
                method,
                onClickProp,
                onTransact,
                params,
                pending,
                props,
                tx,
            ]
        );

    const children = React.useMemo(() => {
        if (pending)
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {!hash && childrenProp}
                    {hash && 'View on Etherscan'}
                    <Spinner
                        style={{ marginLeft: '10px' }}
                        size={SpinnerSize.medium}
                    />
                </div>
            );

        return childrenProp;
    }, [childrenProp, hash, pending]);

    return (
        <Button
            {...{ ...props, ref: undefined }}
            disabled={(disabled && !(pending && hash)) || (pending && !hash)}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default TransactionButton;

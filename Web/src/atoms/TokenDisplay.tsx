import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../contexts/ThemeContext';
import useTokenDetails from '../hooks/useTokenDetails';
import { IERC721Metadata } from '../models/IERC721Metadata';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';
import TokenDetails from './TokenDetails';
import { TooltipHost } from './Tooltip';

interface Props {
    id: number;
    selected?: boolean;
    onClick?: (id: number, selected: boolean) => void;
    contract?: IERC721Metadata;
    className?: string;
}
export const TokenDisplay = (props: Props): JSX.Element => {
    const { id, selected, onClick, contract, className } = props;
    const [css] = useStyletron();
    const meta = useTokenDetails(id, contract);
    const theme = useThemeContext();

    return (
        <TooltipHost
            className={css({ height: 'fit-content' })}
            content={meta && <TokenDetails meta={meta} />}
        >
            <div
                onClick={(): void => onClick?.(id, !selected)}
                role="button"
                tabIndex={0}
                onKeyDown={(e): void => {
                    if (e.key !== 'Enter') return;
                    onClick?.(id, !selected);
                }}
                className={ClassNameBuilder(
                    className,
                    css({
                        width: '150px',
                        padding: '10px',
                        backgroundColor: theme.backgroundColor.getCSSColor(
                            selected ? 1 : 0.7
                        ),
                        color: theme.fontColors.normal.secondary.getCSSColor(1),
                        borderRadius: '10px',
                        cursor: 'pointer',
                        ...(selected && {
                            boxShadow: '0px 0px 5px #fff',
                        }),
                        ':hover': {
                            boxShadow: '0px 0px 5px #fff',
                        },
                        [MOBILE]: {
                            width: 'auto',
                        },
                    })
                )}
            >
                {meta && (
                    <img
                        className={css({
                            height: 'auto',
                            width: '100%',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        })}
                        src={meta?.image}
                        alt={`Shroomie token id #${id}`}
                    />
                )}
                {!meta && (
                    <div
                        className={css({
                            height: '150px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        })}
                    >
                        <Spinner size={SpinnerSize.large} />
                    </div>
                )}
                <div
                    className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px',
                    })}
                >
                    {meta && (meta?.name || `Shroomie #${id}`)}
                    {!meta && `Loading #${id}`}
                </div>
            </div>
        </TooltipHost>
    );
};

export default TokenDisplay;

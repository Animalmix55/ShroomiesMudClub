import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import ClassNameBuilder from '../../../utilties/ClassNameBuilder';
import { MOBILE } from '../../../utilties/MediaQueries';

export const MintWrapper = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    const theme = useThemeContext();
    const [css] = useStyletron();

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
                    flex: '1',
                    maxWidth: '550px',
                    minWidth: '450px',
                    margin: '15px',
                    alignSelf: 'stretch',
                    [MOBILE]: {
                        minWidth: 'unset',
                    },
                })
            )}
        >
            {children}
        </div>
    );
};

export default MintWrapper;

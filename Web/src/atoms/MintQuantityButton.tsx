import React from 'react';
import { useStyletron } from 'styletron-react';
import AddButton from '../assets/images/MINTPAGE/NIGHT SHROOMS/PLUS_GREEN.png';
import AddButtonDisabled from '../assets/images/MINTPAGE/NIGHT SHROOMS/PLUS_GREY.png';
import MinusButton from '../assets/images/MINTPAGE/NIGHT SHROOMS/MINUS_ORANGE.png';
import MinusButtonDisabled from '../assets/images/MINTPAGE/NIGHT SHROOMS/MINUS_GREY.png';
import ClassNameBuilder from '../utilties/ClassNameBuilder';

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

export default MintQuantityButton;

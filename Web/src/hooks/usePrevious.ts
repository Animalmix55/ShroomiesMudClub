import React from 'react';

export const usePrevious = <T>(val: T): React.MutableRefObject<T> => {
    const prevVal = React.useRef(val);

    React.useEffect(() => {
        prevVal.current = val;
    }, [val]);

    return prevVal;
};

export default usePrevious;

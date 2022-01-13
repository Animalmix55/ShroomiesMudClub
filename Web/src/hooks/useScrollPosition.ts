import React from 'react';
import usePrevious from './usePrevious';

export const useScrollPosition = (): [
    scrollPos: number,
    scrollingUp: boolean
] => {
    const [scrollPos, setScrollPos] = React.useState(window.scrollY);
    const prevScrollPos = usePrevious(scrollPos);

    const scrollingUp = React.useMemo(
        () => scrollPos - prevScrollPos.current <= 0,
        [prevScrollPos, scrollPos]
    );

    React.useEffect(() => {
        const scrollHandler = (): void => {
            setScrollPos(window.scrollY);
        };

        window.addEventListener('scroll', scrollHandler);

        return (): void => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    return [scrollPos, scrollingUp];
};

export default useScrollPosition;

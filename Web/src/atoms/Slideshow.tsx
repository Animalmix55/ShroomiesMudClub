import React from 'react';
import ClassNameBuilder from '../utilties/ClassNameBuilder';

interface Props {
    imageUrls: string[];
    duration?: number;
    imageClass?: string;
    className?: string;
}
export const Slideshow = (props: Props): JSX.Element => {
    const { imageUrls, duration, imageClass, className } = props;

    const [index, setIndex] = React.useState(0);

    const interval = React.useRef<NodeJS.Timer>();
    React.useEffect(() => {
        interval.current = setInterval(() => {
            setIndex((i) => {
                if (i >= imageUrls.length - 1) return 0;
                return i + 1;
            });
        }, duration);

        return (): void => {
            clearInterval(interval.current);
            interval.current = undefined;
        };
    }, [duration, imageUrls]);

    return (
        <div className={ClassNameBuilder('slideshow', className)}>
            <img className={imageClass} alt="" src={imageUrls[index]} />
        </div>
    );
};

export default Slideshow;

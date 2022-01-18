/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { MOBILE } from '../../../utilties/MediaQueries';

interface FAQItem {
    title: string;
    body: string;
}

const FAQItems: FAQItem[] = [
    {
        title: 'When do Shroomies drop?',
        body: `Early Q1 2022 we will begin dropping the Shroomies Mud Club NFT’s.`,
    },
    {
        title: 'How many variations and traits do the Shroomies have?',
        body: `The Night Shrooms have 11 trait categories and 200+ traits. Shroomies have 11 trait categories and 300+ traits.`,
    },
    {
        title: 'How are you giving back?',
        body: `We have partnered with …. giving a portion of each sale back to the …. to further research into the medical benefits of mushrooms and facilitate healing of the agriculture and bee community through the use of mushrooms.`,
    },
    {
        title: 'What are The Night Shrooms VIP Pass NFT’s?',
        body: `Holders of The Night Shrooms get exclusive presale access to main drops, a free mint of the main Shroomie drop, access to special roles and voting privileges.`,
    },
    {
        title: 'How many NFT’s are in each drop?',
        body: `First, we will release 888 Night Shrooms. Then, we will have the main drop of the 8,888 Shroomies. Subsequent releases will consist of Special Drops. numbers are TBD.`,
    },
    {
        title: 'How much do these NFT’s cost?',
        body: `The Night Shrooms will drop at .03 ETH. The Shroomies drop price is TBD.`,
    },
    {
        title: 'How do we get our Shroomies?',
        body: `You can mint directly at mint.shroomiesmudclub.io. The Night Shroom drops are limited to 2 per wallet and the Shroomie drop is limited to 5 per wallet.`,
    },
    {
        title: 'What are the long-term plans?',
        body: `We are in the early stages of planning a physical card/board game. We will utilize our community to help drive the project direction.`,
    },
];

const FAQItemElement = ({
    section,
    index,
}: {
    section: FAQItem;
    index: number;
}): JSX.Element => {
    const { body, title } = section;
    const [css] = useStyletron();

    return (
        <div>
            <div className={css({ fontWeight: 'bold' })}>
                {index + 1}. Q: {title}
            </div>
            <div>A: {body}</div>
        </div>
    );
};

export const FAQSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                padding: '30px',
                color: theme.fontColors.normal.primary.getCSSColor(1),
                display: 'flex',
                justifyContent: 'center',
            })}
        >
            <div
                className={css({
                    maxWidth: '1500px',
                    borderBottom: `1px solid ${theme.fontColors.normal.primary.getCSSColor(
                        1
                    )}`,
                    paddingBottom: '30px',
                })}
            >
                <div
                    className={css({
                        fontWeight: 'bold',
                        fontSize: '40px',
                        textTransform: 'uppercase',
                        margin: '20px',
                    })}
                >
                    FAQ
                </div>
                <div
                    className={css({
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })}
                >
                    {FAQItems.map((s, i) => (
                        <div
                            key={s.title}
                            className={css({
                                margin: '5px 20px 5px 20px',
                                flex: '1',
                                minWidth: '510px',
                                [MOBILE]: {
                                    minWidth: 'unset',
                                    flexBasis: '100%',
                                },
                            })}
                        >
                            <FAQItemElement section={s} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;

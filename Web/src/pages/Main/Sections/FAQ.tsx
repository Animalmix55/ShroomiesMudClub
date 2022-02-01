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
        body: `Early Q1 2022 we will begin dropping the Shroomies Mud Club NFTs.`,
    },
    {
        title: 'How many variations and traits do the Shroomies have?',
        body: `The Night Shrooms have 14 trait categories and 220 traits. Shroomies have 20 trait categories and 400 traits.`,
    },
    {
        title: 'How are you giving back?',
        body: `We have identified non profit and research groups doing important work in mycology. We will be working with our community to support and promote these entities.`,
    },
    {
        title: 'How are The Night Shrooms different from regular Shroomies in the collection?',
        body: `The Night Shrooms are an early release part of the main Shroomie collection. They have darker environments and often glowing traits. Holders of The Night Shrooms get exclusive presale access to main drops, a free mint of the main Shroomie drop, access to special roles and voting privileges.`,
    },
    {
        title: 'How many NFTs are in each drop?',
        body: `The Night Shrooms will be a total 888 with an additional 8000 Shroomies for the remainder of the collection. Total collection once fully minted out will be 8888.`,
    },
    {
        title: 'How much do these NFTs cost?',
        body: `The Night Shrooms will drop at 0.038 ETH. The Shroomies drop price is 0.048 ETH.`,
    },
    {
        title: 'How do we get our Shroomies?',
        body: `You can mint directly at mint.shroomiesmudclub.io. The Night Shroom drops are limited to 2 per transaction and the Shroomie drop is limited to 20 per transaction.`,
    },
    {
        title: 'What are the long-term plans?',
        body: `Initially our focus will be on our two main roadmap initiatives which include partnering with fungi experts and creating a thriving community built around mushroom awareness, education and IRL events. Additionally, we’ll begin to work on our physical card and board game with our community. As progress is made on those key goals, we envision launching an online game that would complement the physical game and a companion drop born out of the game design process.`,
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

import { Callout, Icon } from '@fluentui/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useScrollSections } from 'react-scroll-section';
import { SocialIcon } from 'react-social-icons';
import { useStyletron } from 'styletron-react';
import NavImage from '../assets/images/NAV/TOP_NOOB_3.png';
import { Button, ButtonType } from '../atoms/Button';
import { useShroomieContext } from '../contexts/ShroomieContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useScrollPosition from '../hooks/useScrollPosition';
import { Page } from '../routing/ShroomRouter';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';

const NavDropdown = ({ className }: { className?: string }): JSX.Element => {
    const [css] = useStyletron();
    const [open, setOpen] = React.useState(false);
    const theme = useThemeContext();

    const [scrollPos] = useScrollPosition();
    const ref = React.useRef<HTMLButtonElement>(null);
    const history = useHistory();
    const location = useLocation();

    React.useEffect(() => {
        setOpen(false);
    }, [scrollPos]);

    const sections = useScrollSections();
    const buttons = sections.map((s) => (
        <Button
            className={css({
                display: 'block',
                color: s.selected
                    ? `${theme.fontColors.normal.secondary.getCSSColor(
                          1
                      )} !important`
                    : undefined,
                backgroundColor: s.selected
                    ? `${theme.pallette.lightPurple.getCSSColor(1)} !important`
                    : undefined,
                borderRadius: '10px',
                margin: '5px',
                padding: '0px 10px 0px 10px !important',
                [MOBILE]: {
                    minHeight: `${60 / sections.length}vh`,
                    minWidth: '50vw',
                },
            })}
            key={s.id}
            buttonType={ButtonType.primary}
            onClick={s.onClick}
        >
            {String(s.meta)}
        </Button>
    ));

    return (
        <>
            <Button
                buttonType={ButtonType.wireframe}
                className={ClassNameBuilder(
                    className,
                    css({
                        borderRadius: '1000px',
                        height: '35px',
                        width: '35px',
                        transition: 'transform 500ms',
                        ':hover': {
                            transform: 'scale(1.1)',
                        },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px !important',
                    })
                )}
                onClick={(): void => setOpen((o) => !o)}
                ref={ref}
            >
                <Icon iconName={open ? 'ChevronUpMed' : 'ChevronDownMed'} />
            </Button>
            {open && (
                <Callout
                    target={ref}
                    styles={{
                        calloutMain: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                        },
                    }}
                >
                    {location.pathname === Page.Main && buttons}
                    {location.pathname !== Page.Main && (
                        <Button
                            className={css({
                                display: 'block',
                                borderRadius: '10px',
                                margin: '5px',
                                padding: '0px 10px 0px 10px !important',
                                [MOBILE]: {
                                    minHeight: `${60 / sections.length}vh`,
                                    minWidth: '50vw',
                                },
                            })}
                            buttonType={ButtonType.primary}
                            onClick={(): void => history.push(Page.Main)}
                        >
                            Go Home
                        </Button>
                    )}
                </Callout>
            )}
        </>
    );
};

export const Header = (): JSX.Element => {
    const [scrollPos, scrollingUp] = useScrollPosition();
    const { twitterUrl, discordUrl } = useShroomieContext();
    const theme = useThemeContext();

    const [css] = useStyletron();
    const history = useHistory();

    return (
        <div
            className={css({
                position: 'fixed',
                height: '100px',
                top: 0,
                left: 0,
                right: 0,
                paddingRight: '30px',
                paddingLeft: '30px',
                transition: '500ms transform, 500ms background',
                transform:
                    !scrollingUp && scrollPos >= 100
                        ? 'translateY(-100px)'
                        : undefined,
                display: 'flex',
                alignItems: 'center',
                zIndex: 1000,
                [MOBILE]: {
                    height: '10vh',
                    transform:
                        !scrollingUp && scrollPos >= 100
                            ? 'translateY(-10vh)'
                            : undefined,
                    backgroundColor: theme.backgroundColor.getCSSColor(0.5),
                },
            })}
        >
            <img
                src={NavImage}
                className={css({
                    height: '100%',
                    width: 'auto',
                    marginRight: 'auto',
                })}
                alt="Shroomie"
            />
            <SocialIcon
                url={twitterUrl}
                bgColor={theme.fontColors.normal.secondary.getCSSColor(1)}
                className={css({
                    height: '35px !important',
                    width: '35px !important',
                    margin: '5px',
                    transition: 'transform 500ms',
                    ':hover': {
                        transform: 'scale(1.1)',
                    },
                    [MOBILE]: {
                        display: 'none !important',
                    },
                })}
            />
            <SocialIcon
                url={discordUrl}
                bgColor={theme.fontColors.normal.secondary.getCSSColor(1)}
                className={css({
                    height: '35px !important',
                    width: '35px !important',
                    margin: '5px',
                    transition: 'transform 500ms',
                    ':hover': {
                        transform: 'scale(1.1)',
                    },
                    [MOBILE]: {
                        display: 'none !important',
                    },
                })}
            />
            <Button
                buttonType={ButtonType.wireframe}
                className={css({
                    borderRadius: '1000px',
                    margin: '5px',
                    height: '35px',
                    transition: 'transform 500ms',
                    padding: '0px 10px 0px 10px !important',
                    ':hover': {
                        transform: 'scale(1.1)',
                    },
                })}
                onClick={(): void => history.push(Page.Mint)}
            >
                <div
                    className={css({
                        transform: 'color 500ms',
                        ':hover': {
                            color: 'transparent !important',
                            backgroundImage: `linear-gradient(
                                    90deg,
                                    rgba(255, 0, 0, 1) 0%,
                                    rgba(255, 154, 0, 1) 10%,
                                    rgba(208, 222, 33, 1) 20%,
                                    rgba(79, 220, 74, 1) 30%,
                                    rgba(63, 218, 216, 1) 40%,
                                    rgba(47, 201, 226, 1) 50%,
                                    rgba(28, 127, 238, 1) 60%,
                                    rgba(95, 21, 242, 1) 70%,
                                    rgba(186, 12, 248, 1) 80%,
                                    rgba(251, 7, 217, 1) 90%,
                                    rgba(255, 0, 0, 1) 100%
                                )`,
                            '-webkit-background-clip': 'text',
                        },
                    })}
                >
                    Magic Mint
                </div>
            </Button>
            <NavDropdown className={css({ margin: '5px' })} />
        </div>
    );
};

export default Header;

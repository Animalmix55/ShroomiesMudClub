import Hamburger from 'hamburger-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useScrollSection } from 'react-scroll-section';
import { SocialIcon } from 'react-social-icons';
import { useStyletron } from 'styletron-react';
import ChillBanner from '../assets/images/chill-with-jesus-banner.png';
import { Button, ButtonType } from '../atoms/Button';
import { useShroomieContext } from '../contexts/ShroomieContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useMobile from '../hooks/useMobile';
import { Page } from '../routing/ShroomRouter';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';

export const Header = (): JSX.Element => {
    const history = useHistory();
    const { pathname } = useLocation();

    const { tokenContractAddress, discordUrl, twitterUrl } =
        useShroomieContext();

    const [css] = useStyletron();
    const theme = useThemeContext();
    const [scrollTop, setScrollTop] = React.useState(0);
    const [isOpen, setOpen] = React.useState(false);
    const isMobile = useMobile();

    const faq = useScrollSection('FAQ');
    const landing = useScrollSection('Landing');
    const roadmap = useScrollSection('Roadmap');
    const supply = useScrollSection('Supply');
    const team = useScrollSection('Team');
    const traits = useScrollSection('Traits');

    React.useEffect(() => {
        const onScroll = (): void => {
            setScrollTop(window.scrollY);
        };
        window.addEventListener('scroll', onScroll);

        return (): void => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const goHomeBefore = React.useCallback(
        (callback: () => void): void => {
            if (pathname !== '/') {
                const u = history.listen(() => {
                    setTimeout(callback, 500);
                    u();
                });
                history.push('/');
            } else callback();
        },
        [history, pathname]
    );

    const collapsed = React.useMemo(() => {
        if (scrollTop >= 45) return true;
        return false;
    }, [scrollTop]);

    const fontSize = React.useMemo(() => {
        if (isMobile) return '30px';

        return collapsed ? '18px' : '21px';
    }, [isMobile, collapsed]);

    const bannerMinHeight = React.useMemo(() => {
        if (isMobile) {
            return 75;
        }
        return collapsed ? 50 : 110;
    }, [collapsed, isMobile]);

    const buttonStyle = React.useMemo(
        (): React.CSSProperties => ({
            fontSize: 'inherit',
            transition: 'font-size 1s',
            paddingLeft: '15px',
            paddingRight: '15px',
            textTransform: 'uppercase',
            maxWidth: 'fit-content',
            ...(isMobile && {
                paddingTop: '15px',
                paddingBottom: '15px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
            }),
        }),
        [isMobile]
    );

    const buttons = React.useMemo(
        () => (
            <>
                <Button
                    style={{
                        ...buttonStyle,
                        color: landing.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="home_button"
                    onClick={(): void => goHomeBefore(landing.onClick)}
                >
                    Home
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: supply.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="project_button"
                    onClick={(): void => goHomeBefore(supply.onClick)}
                >
                    The Project
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: traits.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="roadmap_button"
                    onClick={(): void => goHomeBefore(traits.onClick)}
                >
                    Traits
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: roadmap.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="Roadmap_button"
                    onClick={(): void => goHomeBefore(roadmap.onClick)}
                >
                    Roadmap
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: faq.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="FAQ_button"
                    onClick={(): void => goHomeBefore(faq.onClick)}
                >
                    FAQ
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: team.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="team_button"
                    onClick={(): void => goHomeBefore(team.onClick)}
                >
                    Team
                </Button>
                {tokenContractAddress && (
                    <Button
                        style={{
                            ...buttonStyle,
                            color:
                                pathname === Page.Mint
                                    ? theme.fontColors.hovered.primary.getCSSColor(
                                          1
                                      )
                                    : undefined,
                        }}
                        buttonType={ButtonType.clear}
                        key="mint_button"
                        onClick={(): void => history.push(Page.Mint)}
                    >
                        Mint
                    </Button>
                )}
            </>
        ),
        [
            buttonStyle,
            landing.selected,
            landing.onClick,
            theme.fontColors.hovered.primary,
            supply.selected,
            supply.onClick,
            traits.selected,
            traits.onClick,
            roadmap.selected,
            roadmap.onClick,
            faq.selected,
            faq.onClick,
            team.selected,
            team.onClick,
            tokenContractAddress,
            pathname,
            goHomeBefore,
            history,
        ]
    );

    return (
        <div
            className={css({
                position: isMobile ? 'sticky' : 'fixed',
                top: '0px',
                left: '0px',
                right: '0px',
                fontSize,
                zIndex: 100000,
                height: isMobile && isOpen ? '100%' : undefined,
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <div
                className={css({
                    minHeight: `${bannerMinHeight}px`,
                    backgroundColor: theme.backgroundColor.getCSSColor(1),
                    display: 'flex',
                    transition: 'min-height 1s, background 1s',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                })}
            >
                <div
                    className={ClassNameBuilder(
                        'nav-header',
                        css({
                            height: '100%',
                            fontSize,
                            display: 'flex',
                            transition: 'height 1s, background 1s',
                            alignItems: 'center',
                            marginLeft: '30px',
                            marginRight: '30px',
                            flex: '1',
                            width: isMobile ? '100%' : undefined,
                        })
                    )}
                >
                    <img
                        src={ChillBanner}
                        alt="Chill with Jesus"
                        className={css({
                            height: bannerMinHeight,
                            width: 'auto',
                            maxHeight: 'auto',
                            objectFit: 'contain',
                            maxWidth: '20%',
                            marginLeft: '30px',
                            transition: 'height 1s',
                            [MOBILE]: {
                                maxWidth: 'unset',
                            },
                        })}
                    />
                    {isMobile && (
                        <div className={css({ marginLeft: 'auto' })}>
                            <Hamburger
                                toggled={isOpen}
                                color={theme.fontColors.normal.primary.getCSSColor(
                                    1
                                )}
                                onToggle={setOpen}
                            />
                        </div>
                    )}
                    {!isMobile && (
                        <div
                            className={ClassNameBuilder(
                                'nav-buttons',
                                css({
                                    marginLeft: '10px',
                                    flex: '1',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                })
                            )}
                        >
                            <div
                                className={css({
                                    marginLeft: '40px',
                                    marginRight: '40px',
                                    flex: '1',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                })}
                            >
                                {buttons}
                            </div>
                            <Button
                                style={buttonStyle}
                                className={ClassNameBuilder(
                                    css({
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    })
                                )}
                                buttonType={ButtonType.wireframe}
                                onClick={(): void => {
                                    window.location.href = discordUrl;
                                }}
                            >
                                Join our Discord
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={css({
                    backgroundColor: theme.backgroundColor.getCSSColor(0.9),
                    height: isMobile && isOpen ? undefined : '0px',
                    overflow: isMobile && isOpen ? 'auto' : 'hidden',
                    paddingBottom: isMobile && isOpen ? '20px' : undefined,
                    paddingTop: isMobile && isOpen ? '20px' : undefined,
                    flex: isMobile && isOpen ? '1' : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                {buttons}
                <div
                    className={css({
                        marginTop: 'auto',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })}
                >
                    <SocialIcon
                        url={twitterUrl}
                        bgColor="white"
                        style={{
                            height: '50px',
                            width: '50px',
                        }}
                        className={css({
                            margin: '5px',
                        })}
                    />
                    <SocialIcon
                        style={{
                            height: '50px',
                            width: '50px',
                        }}
                        url={discordUrl}
                        bgColor="white"
                        className={css({ margin: '5px' })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;

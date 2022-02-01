import { initializeIcons } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { HashRouter } from 'react-router-dom';
import { ScrollingProvider } from 'react-scroll-section';
import {
    ShroomieContextProvider,
    ShroomieContextType,
} from './contexts/ShroomieContext';
import { defaultTheme, ThemeContextProvider } from './contexts/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import ShroomRouter from './routing/ShroomRouter';
import Header from './molecules/Header';
import Footer from './molecules/Footer';

initializeIcons();

const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '*, *::before, *::after': {
                    boxSizing: 'content-box',
                },

                body: {
                    backgroundColor: '#fff',
                    fontFamily: 'unset',
                },
            },
        },
    },
});

const {
    api,
    etherscanUrl,
    chainId,
    tokenContractAddress,
    discordUrl,
    twitterUrl,
    openseaUrl,
} = { ...window } as unknown as ShroomieContextType;

const styletron = new Client();

const Root = (): JSX.Element => {
    return (
        <MuiThemeProvider theme={theme}>
            <ScrollingProvider>
                <Provider value={styletron}>
                    <ThemeContextProvider value={defaultTheme}>
                        <HashRouter>
                            <ShroomieContextProvider
                                value={{
                                    openseaUrl,
                                    api,
                                    etherscanUrl,
                                    chainId,
                                    tokenContractAddress,
                                    discordUrl,
                                    twitterUrl,
                                }}
                            >
                                <>
                                    <Header />
                                    <ToastContainer position="bottom-left" />
                                    <ShroomRouter />
                                    <Footer />
                                </>
                            </ShroomieContextProvider>
                        </HashRouter>
                    </ThemeContextProvider>
                </Provider>
            </ScrollingProvider>
        </MuiThemeProvider>
    );
};

const container = document.getElementById('self-injecting-react-app');
ReactDOM.render(<Root />, container);

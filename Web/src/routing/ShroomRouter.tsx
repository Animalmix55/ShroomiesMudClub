import React from 'react';
import { Route, Switch } from 'react-router';
import { useStyletron } from 'styletron-react';
import { useShroomieContext } from '../contexts/ShroomieContext';
import MainPage from '../pages/Main/Main';
import MintPage from '../pages/Mint/Mint';

export enum Page {
    Main = '/',
    Staking = '/staking',
    Mint = '/mint',
}

export const ShroomRouter = (): JSX.Element => {
    const [css] = useStyletron();
    const { tokenContractAddress } = useShroomieContext();

    return (
        <div
            className={css({
                backgroundColor: 'white',
                minHeight: '100vh',
                overflow: 'hidden',
            })}
        >
            <Switch>
                <Route path={Page.Main} exact component={MainPage} />
                {tokenContractAddress && (
                    <Route path={Page.Mint} exact component={MintPage} />
                )}
            </Switch>
        </div>
    );
};

export default ShroomRouter;

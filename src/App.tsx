import React, {useContext, useEffect} from 'react';
import './App.css';
import 'fontsource-roboto';
import AppBar from './components/AppBar';
import {ThemeProvider} from '@material-ui/core';
import theme from "./theme/theme";
import {Route, Switch} from 'react-router-dom';
import HomePage from "./pages/home/HomePage";
import AddPhotoPage from "./pages/photo/AddPhotoPage";
import AppContext from "./context/AppContext";
import {useEffectOnce} from "react-use";
import Chart from "./components/Chart/Chart";

const App: React.FC = () => {
    const {state, actions} = useContext(AppContext);
    useEffectOnce(() => {
        (async () => {
            await actions.loadGoogleApi();
        })();
    });

    useEffect(() => {
        if (state.user && state.isGoogleApiLoaded) {
            (async () => {
                await actions.getWeights();
                await actions.setRootFolder();
            })();
        }
    }, [state.user, state.isGoogleApiLoaded]); // eslint-disable-line

    const initialized = state.isGoogleApiLoaded;
    if (!initialized) {
        return <div/>;
    }
    return (
        <ThemeProvider theme={theme}>
                <AppBar />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/chart" component={Chart}/>
                    <Route exact path="/addphoto" component={AddPhotoPage}/>
                </Switch>
        </ThemeProvider>
    );
}

export default App;

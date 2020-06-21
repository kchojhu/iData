import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {CssBaseline} from "@material-ui/core";
import {BrowserRouter} from "react-router-dom";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import AppState from "./context/AppState";

am4core.useTheme(am4themes_animated);

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline/>
        <BrowserRouter>
            <AppState>
                <App/>
            </AppState>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
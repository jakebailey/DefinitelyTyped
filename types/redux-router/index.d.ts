import * as React from 'react';
import * as ReactRouter from 'react-router';
import * as Redux from 'redux';
import * as H from 'history';

import routerStateReducer from "./lib/routerStateReducer";
import ReduxRouter from "./lib/ReduxRouter";
import reduxReactRouter from "./lib/client";
import isActive from "./lib/isActive";
import {
    historyAPI,
    pushState,
    push,
    replaceState,
    replace,
    setState,
    go,
    goBack,
    goForward
} from "./lib/actionCreators";

export {
    ReduxRouter,
    routerStateReducer,
    reduxReactRouter,
    isActive,
    historyAPI,
    pushState,
    push,
    replaceState,
    replace,
    setState,
    go,
    goBack,
    goForward
};


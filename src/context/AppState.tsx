import React, {useMemo, useReducer} from 'react';
import AppReducer from "./AppReducer";
import AppContext, {AppContextState} from "./AppContext";
import generateDispatcher from "./dispatcher";

export const initAppState: AppContextState = {
    weights: null,
    isGoogleApiLoaded: false,
    user: null,
    rootFolder: null,
    photoFolder: null,
};

const AppState = ({children}: { children: JSX.Element }): JSX.Element => {
    const [state, dispatch] = useReducer(AppReducer, initAppState);

    const dispatchers = useMemo(() => (generateDispatcher(dispatch)), [dispatch]);

    console.log('state', state);
    return (
        <AppContext.Provider value={{
            state: {
                weights: state.weights,
                isGoogleApiLoaded: state.isGoogleApiLoaded,
                user: state.user,
                rootFolder: state.rootFolder,
                photoFolder: state.photoFolder,
            },
            actions: {...dispatchers}
        }}>
            {children}
        </AppContext.Provider>
    );
}

export default AppState;
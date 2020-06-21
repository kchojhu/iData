import {createContext} from "react";
import {AppFile, User, Weights} from "../typings";
import {initAppState} from "./AppState";
import generateDispatcher from "./dispatcher";

export interface AppContextState {
    weights: Weights | null;
    isGoogleApiLoaded: boolean;
    user: User | null;
    rootFolder: AppFile | null;
    photoFolder: AppFile | null;
}

export interface AppContextActions {
    getWeights: () => void;
    loadGoogleApi: () => Promise<void>;
    setUser: (user:User | null) => void;
    getDriveList: () => Promise<AppFile[]>;
    createFolder: (name: string, rootFolder?: AppFile) => Promise<AppFile>;
    setRootFolder: () => Promise<void>;
    setPhotoFolder: (rootFolder: AppFile) => Promise<void>;
    addPhoto: (photoFolder: AppFile, dataUri: string) => Promise<void>;
}

export interface AppContextType {
    state: AppContextState;
    actions: AppContextActions;
}

const initActions = generateDispatcher(() => {});

const AppContext = createContext<AppContextType>({
    state: initAppState,
    actions: {...initActions}
});

export default AppContext;
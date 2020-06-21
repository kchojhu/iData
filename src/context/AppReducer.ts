import {AppContextState} from "./AppContext";
import {AppFile, User, Weights} from "../typings";

interface GOOGLE_API_LOADED_TYPE {
    type: 'GOOGLE_API_LOADED'
}

interface GET_WEIGHT_TYPE {
    type: 'GET_WEIGHT';
    payload: Weights | null;
}

interface SET_USER {
    type: 'SET_USER',
    payload: User | null,
}

interface SET_ROOT_FOLDER {
    type: 'SET_ROOT_FOLDER',
    payload: AppFile,
}

interface SET_PHOTO_FOLDER {
    type: 'SET_PHOTO_FOLDER',
    payload: AppFile,
}

export type ActionType = GOOGLE_API_LOADED_TYPE | GET_WEIGHT_TYPE | SET_USER | SET_ROOT_FOLDER | SET_PHOTO_FOLDER;

const AppReducer = (state: AppContextState, action: ActionType): AppContextState => {
    switch (action.type) {
        case "SET_ROOT_FOLDER":
            return {
                ...state,
                rootFolder: action.payload,
            };
        case "SET_PHOTO_FOLDER":
            return {
                ...state,
                photoFolder: action.payload,
            };
        case "GET_WEIGHT":
            return {
                ...state,
                weights: action.payload,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            }
        case "GOOGLE_API_LOADED":
            return {
                ...state,
                isGoogleApiLoaded: true
            }
    }
    return state;
}

export default AppReducer;
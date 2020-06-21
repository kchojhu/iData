import {GoogleLoginResponse} from "react-google-login";
import {Theme} from "@material-ui/core";

export interface AppFile {
    id: string,
    name: string,
    mimeType: "application/vnd.google-apps.folder",
    type: 'file' | 'folder'
}

export interface Weights {
    startDate: Date;
    endDate: Date;
    weights: {
        [day: number]: number[];
    };
}

export interface User {
    profile: {
        imageUrl: string;
        googleId: string;
    };
    accessToken: string;
}

export const isGoogleLoginResponse = (arg: any): arg is LoginResponse => {
    return arg.googleId !== undefined;
};

export interface LoginResponse extends GoogleLoginResponse {
    wc: {
        access_token: string;
    };
}

export interface AppTheme extends Theme {
    app: {
        iconButton: any;
    };
}
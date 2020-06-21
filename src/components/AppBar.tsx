import React, {useContext} from 'react';
import {AppBar as MuAppBar, Avatar, IconButton, Toolbar, Typography, Link as MLink} from "@material-ui/core";
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from "react-google-login";
import _ from "lodash";
import {AccountCircle} from "@material-ui/icons";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import AddPhotoIcon from "@material-ui/icons/AddAPhoto";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import ChartIcon from "@material-ui/icons/TrendingDown";
import {makeStyles} from "@material-ui/core/styles";
import {AppTheme, isGoogleLoginResponse} from "../typings";
import {Link, useHistory} from 'react-router-dom';
import AppContext from "../context/AppContext";

const AppBar: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {state, actions} = useContext(AppContext);

    const successResponseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if (isGoogleLoginResponse(response) && response.isSignedIn()) {
            actions.setUser({
                accessToken: response.wc.access_token,
                profile: {
                    googleId: response.googleId,
                    imageUrl: response.profileObj.imageUrl,
                }
            });
        }
    }

    const failResponseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.error('Failed Login', response);
        logout();
    }

    const logout = () => {
        console.info('logout');
        actions.setUser(null);
        history.push('/');
    }
    return (
        <MuAppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title} onClick={() => {
                    history.push('/');
                }}>
                    iData
                </Typography>
                {!state.user && (
                    <GoogleLogin
                        clientId='1063738380556-51c0d5ilm1tk7594jn27o9us47viqcih.apps.googleusercontent.com'
                        buttonText="Sign in with Google"
                        theme='dark'
                        scope='https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/fitness.body.read'
                        onSuccess={successResponseGoogle}
                        onFailure={failResponseGoogle}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    />
                )}
                {state.user && (
                    <>
                        <IconButton component={Link} to='/addphoto'>
                            <AddPhotoIcon className={classes.iconButton}/>
                        </IconButton>
                        <IconButton component={MLink} href={`https://drive.google.com/drive/folders/${state.photoFolder?.id}`} target='_blank'>
                            <PhotoLibraryIcon className={classes.iconButton}/>
                        </IconButton>
                        <IconButton component={Link} to='/chart'>
                            <ChartIcon className={classes.iconButton}/>
                        </IconButton>
                        <GoogleLogout
                            clientId='1063738380556-51c0d5ilm1tk7594jn27o9us47viqcih.apps.googleusercontent.com'
                            buttonText="Sign out"
                            onLogoutSuccess={logout}
                            render={(renderProps: { onClick: () => void, disabled?: boolean }): JSX.Element => (
                                <IconButton onClick={renderProps.onClick} size='small'>
                                    <LogoutIcon className={classes.iconButton}/>
                                </IconButton>
                            )}
                        >
                        </GoogleLogout>
                        {_.isEmpty(state.user.profile.imageUrl) ? <AccountCircle/> :
                            <Avatar className={classes.avatarSize} src={state.user.profile.imageUrl}/>}
                    </>

                )}
            </Toolbar>
        </MuAppBar>
    );
}

const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        cursor: 'pointer',
    },
    avatarSize: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    iconButton: theme.app.iconButton
}));

export default AppBar;
import {createMuiTheme, Theme} from "@material-ui/core";

const theme: Theme = createMuiTheme({
    overrides: {
        MuiAppBar: {
            root: {
                boxShadow: 'none'
            }
        }
    },
}, {
    app: {
        iconButton: {
            color: '#e2dede',
        }
    }
})



export default theme;
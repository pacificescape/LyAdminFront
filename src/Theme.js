import React, { Component } from 'react'
import Cookies from 'universal-cookie';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

function createTheme(type, primary) {
    return createMuiTheme({
        palette: {
            type: type,
            primary: primary,
            secondary: { main: '#E53935' }
        },
        status: {
            danger: 'orange',
        },

        MuiAppBar: {
            flexDirection: "row"
        }
    });
}

function withTheme(WrappedComponent) {

    class ThemeWrapper extends Component {
        constructor(props) {
            super(props)

            this.state = {}
            const cookies = new Cookies();
            const { type, primary } = cookies.get('themeOptions') || { type: 'dark', primary: { main: '#5B8AF1' } };
            const theme = createTheme(type, primary);

            this.state = { theme };
        }

    render() {
        const { theme } = this.state;

        return (
            <StylesProvider injectFirst={true}>
                <MuiThemeProvider theme={theme}>
                    <WrappedComponent {...this.props} />
                </MuiThemeProvider>
            </StylesProvider>
        );
    }
}

return ThemeWrapper;
}

export default withTheme;

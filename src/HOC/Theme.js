import React, { Component } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';

function withTheme(WrappedComponent) {

    class ThemeWrapper extends Component {
        constructor(props) {
            super(props)

            this.state = {}
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

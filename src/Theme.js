import React, { Component } from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import {
    toggleThemeThunk
} from './redux/reducers/App'

import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import deepOrange from '@material-ui/core/colors/deepOrange';

function createTheme(type, primary) {
    return createMuiTheme({
        palette: {
            type: type,
            primary: primary,
            secondary: { main: '#E53935' },

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
            const { type, primary } = cookies.get('lyAdminTheme') || this.props.theme //{ type: 'dark', primary: { main: deepPurple.A200 } };
            const theme = createTheme(type, primary);

            this.state = { theme };
        }

        componentDidMount() {
            console.log('theme is mount')
        }

        onChangeTheme = (type, primary) => {
            let theme = createTheme(this.props.theme.type, this.props.theme.primary)
            debugger;
            this.setState({ theme })
        }

        render() {
            const { theme } = this.state;

            return (
                <StylesProvider injectFirst={true}>
                    <MuiThemeProvider theme={theme}>
                        <WrappedComponent {...this.props} onChangeTheme={this.onChangeTheme}/>
                    </MuiThemeProvider>
                </StylesProvider>
            );
        }
    }

    let mapStateToProps = (state) => {
        return {
            theme: state.App.theme
        }
    }

    return connect(mapStateToProps)(ThemeWrapper);
}

export default withTheme;

// подключить стору

// let mapStateToProps = (state) => {
//     return {
//       type: state.App.theme.type,
//       primary: state.App.theme.primary
//     }
//   }

// export default connect(mapStateToProps)(withTheme)

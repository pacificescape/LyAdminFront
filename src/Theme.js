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

    class ThemeWrapper extends Component { // переписать на хуки
        constructor(props) {
            super(props)

            this.state = {}
            // const cookies = new Cookies();
            // console.log(cookies.get('lyAdminTheme'))
            // const { type, primary } = cookies.get('lyAdminTheme') || { type: 'dark', primary: { main: deepPurple.A200 } };
            const theme = createTheme(this.props.type, this.props.primary);

            this.state = { theme }
        }

        componentDidMount() {
            console.log('theme is mount')
        }


        onChangeTheme = () => {
            let theme = createTheme(this.props.type, this.props.primary)
            debugger;
            this.setState({ theme })
            // const cookies = new Cookies();
            // cookies.set('lyAdminTheme', {type: this.state.theme.palette.type, primary: this.state.theme.palette.primary})
            // console.log(cookies.get('lyAdminTheme'))
        }

        render() {
            const { theme } = this.state;
            // debugger;
            // if (this.props.type) {
            //     if (this.props.type !== this.state.theme.palette.type || this.props.primary[500] !== this.state.theme.palette.primary[500]) {
            //         this.onChangeTheme()
            //     }
            // }

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
            type: state.App.theme.type,
            primary: state.App.theme.primary
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

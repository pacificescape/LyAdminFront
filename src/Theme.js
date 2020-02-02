import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

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

            const theme = createTheme(this.props.type, this.props.primary);

            this.state = { theme }
        }

        componentDidMount() {
            console.log('theme is mount')
        }

        // onChangeTheme = () => {
        //         let theme = createTheme(this.props.type, this.props.primary)
        //         debugger;
        //         const cookies = new Cookies();
        //         console.log(cookies.get('lyAdminTheme'))
        //         this.setState({ theme })
        // }


        render() {
            const theme = createTheme(this.props.type, this.props.primary);
            // debugger;
            // if (this.props.type) {
            //     if (this.props.type !== this.state.theme.palette.type || this.props.primary[500] !== this.state.theme.palette.primary[500]) {
            //         this.onChangeTheme()
            //     }
            // }

            return (
                <StylesProvider injectFirst={true}>
                    <MuiThemeProvider theme={theme}>
                        <WrappedComponent {...this.props} />
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

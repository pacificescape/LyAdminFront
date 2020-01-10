import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import { compose } from 'recompose'
import Button from '@material-ui/core/Button'
import GroupsStore from './Stores/GroupsStore'
import { connect } from 'react-redux'
import {
  getUserGroupsThunk,
  toggleIsAuthThunk
} from './redux/reducers/App'
import GroupsList from './Components/GroupsList'
import Loader from './Components/Loader/Loader'
import './LyAdminApp.css';
// import { ThemeConsumer } from 'styled-components';

const styles = theme => ({
  '@global': {
    a: {
      color: theme.palette.primary.main
    },
    code: {
      color: theme.palette.primary.dark
    },
    pre: {
      borderColor: theme.palette.divider,
      color: theme.palette.primary.dark,
      // background: theme.palette.primary.main + '11'
      '&::selection': {
        color: theme.palette.text.primary,
        backgroundColor: 'highlight'
      }
    },
    body: {
      textAlign: 'center',
      background: theme.palette.type === 'dark' ? theme.palette.grey[900] : '#ffffff',
      color: theme.palette.text.primary
    }
  }
});



class LyAdminApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isAuth: false,
      open: false
    }
  }
  handleClick = () => {
    this.setState({open: !this.state.open})
  }

  // let open = useStore(dialogToggler)

  componentDidMount() {
    this.props.toggleIsAuth(true)
  }

  render() {
    if(!this.state.isAuth && this.state.isLoading) {
      return <Loader
        isAuth={this.state.isAuth}
        isLoading={this.state.isLoading}
        />
    }

    return (
      <div id="app">
        <header className="">
          LyAdminApp
        <p>{this.state.counter}</p>
        </header>
        <Button variant="outlined" color="primary" onClick={this.handleClick}>
          Open simple dialog
        </Button>
        <GroupsList open={this.state.open} handleClose={this.handleClick} />
      </div>
    )
  }
}

// const Theme = styled.div`
//     background-color: #181a1b;
//     color: #ffffff;
//     margin: auto;
//     height: 100vh;
// `
let mapStateToProps = (state) => {
  return {
      isAuth: state.App.isAuth,
      isLoading: state.App.isFetching,
      groups: state.App.groups,
  }

}

let mapDispatchTooProps = (dispatch) => {
  return {
    getUserGroups: () => {
      dispatch(getUserGroupsThunk())
    },
    toggleIsAuth: (isAuth) => {
      dispatch(toggleIsAuthThunk(isAuth))
    }
  }
}


const LyAdminAppContainer = connect(mapStateToProps, mapDispatchTooProps)(LyAdminApp)

const enhance = compose(
  // withLanguage,
  // withTranslation(),
  withTheme,
  withStyles(styles, { withTheme: true })
);

export default enhance(LyAdminAppContainer);

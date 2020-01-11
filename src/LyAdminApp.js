import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import { compose } from 'recompose'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import {
  getUserGroupsThunk,
  getCurrentGroupThunk,
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
      isLoading: props.isFetching,
      isAuth: props.isAuth,
      isError: props.isError,
      open: false
    }
  }
  handleClick = () => {
    this.setState({open: !this.state.open})
  }

  // let open = useStore(dialogToggler)

  componentDidMount() {
    if (this.props.groups.length === 0 && !this.props.isError) {
      this.props.getUserGroups()
    }
  }

  componentDidUpdate() {
    console.log('did update')
  }

  render() {
    if(!this.props.isAuth) {
      return <Loader
        isAuth={this.props.isAuth}
        isLoading={this.props.isLoading}
        />
    }

    let title = this.props.currentGroup.title || 'Group title'

    if (this.props.isError) {
      title = 'isError'
    }

    return (
      <div id="app">
        <header className="">
          LyAdminApp
        <p>{this.props.currentGroup.title}</p>
        </header>
        <Button variant="outlined" color="primary" onClick={this.handleClick}>
          {title}
        </Button>
        {/* <ListOfGroups groups={this.props.groups}/> */}
        <GroupsList
          open={this.state.open}
          groups={this.props.groups}
          handleClose={this.handleClick} />
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
    isError: state.App.isError,
    groups: state.App.groups,
    currentGroup: state.App.currentGroup
  }
}

let mapDispatchTooProps = (dispatch) => {
  return {
    getUserGroups: () => {
      dispatch(getUserGroupsThunk())
    },
    getGroup: () => {
      dispatch(getCurrentGroupThunk())
    },
    toggleIsAuth: (isAuth) => {
      dispatch(toggleIsAuthThunk(isAuth))
    }
  }
}

const LyAdminAppContainer = connect(mapStateToProps, mapDispatchTooProps)(LyAdminApp)

const enhance = compose(
  withTheme,
  withStyles(styles, { withTheme: true })
);

export default enhance(LyAdminAppContainer);

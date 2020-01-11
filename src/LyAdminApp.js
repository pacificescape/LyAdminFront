import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { connect } from 'react-redux'
import {
  getUserGroupsThunk,
  getCurrentGroupThunk,
  toggleIsAuthThunk
} from './redux/reducers/App'
import { compose } from 'recompose'
import GroupsList from './Components/GroupsList'
import Loader from './Components/Loader/Loader'
import './LyAdminApp.css';
import styled from 'styled-components'
// import { ThemeConsumer } from 'styled-components';

import Cookies from 'universal-cookie'
import { useRouteMatch } from 'react-router-dom'


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
    const cookies = new Cookies() // сделать добавление
    const userName = cookies.get('userName')
    const userPhoto = cookies.get('userPhoto')

    this.state = {
      isLoading: props.isFetching,
      isAuth: props.isAuth,
      isError: props.isError,
      open: false,
      userName,
      userPhoto
    }
  }
  handleClick = () => {
    this.setState({ open: !this.state.open })
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
    if (!this.props.isAuth) {
      return <Loader
        isAuth={this.props.isAuth}
        isLoading={this.props.isLoading}
      />
    }

    let title = this.props.currentGroup.info.title || 'Group title'

    if (this.props.isError) {
      title = 'isError'
    }

    return (
      <div id="app">
        <div>
          <Header className="">
            <Avatar src={this.state.userPhoto} />
            <span>{this.state.userName}</span>
          </Header>
        </div>
        <Button variant="outlined" color="primary" onClick={this.handleClick}>
          {title}
        </Button>
        {/* <ListOfGroups groups={this.props.groups}/> */}
        <GroupsList
          open={this.state.open}
          groups={this.props.groups}
          getGroup={this.props.getGroup}
          handleClose={this.handleClick} />
      </div>
    )
  }
}

const Header = styled.div`
    vertical-align: middle;
    display: inline-block;
    margin-left: 20px;
    width: 90%;

    div {
      float: left;
    }

    span {
      display: inline-block;
      margin-left: 20px;
      vertical-align: middle
    }
`

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
    getGroup: (groupId) => {
      dispatch(getCurrentGroupThunk(groupId))
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

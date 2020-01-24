import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import {
  getUserGroupsThunk,
  getCurrentGroupThunk,
  toggleIsAuthThunk,
  getGroupMembersThunk,
  getUserThunk
} from './redux/reducers/App'
import { compose } from 'recompose'

import Loader from './Components/Loader/Loader'
import Header from './Components/Header'
import Firstline from './Components/Firstline'
import MemberList from './Components/MemberList'
import './LyAdminApp.css';
// import styled from 'styled-components'
// import { ThemeConsumer } from 'styled-components';

import Cookies from 'universal-cookie'
import getDataFromUrl from './utils/getDataFromUrl'
import { useLocation, useParams, useRouteMatch } from 'react-router-dom'

const maxAge = 30 * 24 * 60 * 60

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
      background: theme.palette.primary.main + '11',
      '&::selection': {
        color: theme.palette.text.primary,
        backgroundColor: 'highlight'
      }
    },
    body: {
      textAlign: 'center',
      background: theme.palette.type === 'dark' ? theme.palette.grey[900] : '#ffffff',
      color: theme.palette.text.primary
    },
    header: {
      flexDirection: 'row',
      backgroundColor: theme.palette.grey[700]
    },
    IconButton: {
      flexGrow: 1
    },
    Typography: {
      flexGrow: 2
    }
  }
});



class LyAdminApp extends Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies()

    if (props.location.pathname.indexOf('login') !== -1) {
      let { first_name, photo_url, group_id } = getDataFromUrl(props.location.search)

      cookies.set('defaultGroup', group_id, { maxAge })
      cookies.set('userName', first_name, { maxAge })
      cookies.set('userPhoto', photo_url, { maxAge })
    }


    this.state = {
      userPhoto: cookies.get('userPhoto'),
      userName: cookies.get('userName'),
      defaultGroup: cookies.get('defaultGroup'),
      isLoading: props.isFetching,
      isAuth: props.isAuth,
      isError: props.isError,
    }
  }

  // users = async () => {
  //   return await Promise.all(this.props.groupmembers[this.props.currentGroup.info.id].map((user) => {
  //     this.props.getUser(user.telegram_id)
  //   }))
  // }

  componentDidMount() {
    if (this.props.groups.length === 0 && !this.props.isError) {
      this.props.getUserGroups()
      this.props.getGroup(this.state.defaultGroup)
    }

    this.props.getGroupMembers(this.state.defaultGroup)
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


    return (
      <div id="app">
        <Header
          userPhoto={this.state.userPhoto}
          getGroup={this.props.getGroup}
          groups={this.props.groups}
          currentGroup={this.props.currentGroup}
        />
        {/* <Firstline groupTitle={this.props.currentGroup.info.title}/> */}
        <span>Участники</span>
        <MemberList
        groupmembers={this.props.groupmembers}
        id={this.props.currentGroup.info.id}
        getGroupMembers={this.props.getGroupMembers}
        currentGroup={this.props.currentGroup}
        getUser={this.props.getUser}
        isLoading={this.props.isLoading}
        />
        <p>Еще что то</p>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    isAuth: state.App.isAuth,
    isLoading: state.App.isFetching,
    isError: state.App.isError,
    groups: state.App.groups,
    currentGroup: state.App.currentGroup,
    groupmembers: state.App.groupmembers
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
    getUser: (userId, groupId) => {
      dispatch(getUserThunk(userId, groupId))
    },
    toggleIsAuth: (isAuth) => {
      dispatch(toggleIsAuthThunk(isAuth))
    },
    getGroupMembers: (groupId) => {
      dispatch(getGroupMembersThunk(groupId))
    }
  }
}

const LyAdminAppContainer = connect(mapStateToProps, mapDispatchTooProps)(LyAdminApp)

const enhance = compose(
  withTheme,
  withStyles(styles, { withTheme: true })
);

export default enhance(LyAdminAppContainer);

// смена чатов, ширина таблички, отдельная стора?

// сделать метод выдающий страницы таблицы

import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import {
  setCurrentGroupIdThunk,
  toggleIsAuthThunk,
  changeThemeThunk,
  toggleIsError
} from './redux/reducers/App'
import {
  getGroupSettingsThunk,
  getUserGroupsThunk
} from './redux/reducers/Groups'
import {
  getGroupMembersThunk,
  getUserThunk
} from './redux/reducers/Users'
import { compose } from 'recompose'

import Loader from './Components/Loader/Loader'
import Header from './Components/Header'
import MemberList from './Components/MemberList'
import Gifs from './Components/Gifs'
import Texts from './Components/Texts'
import GroupSettings from './Components/GroupSettings'
import './LyAdminApp.css'
// import styled from 'styled-components'
// import { ThemeConsumer } from 'styled-components'

import Cookies from 'universal-cookie'
import getDataFromUrl from './utils/getDataFromUrl'

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
      background: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300],
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
    },
    MemberList: {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300],
    }
  }
})

class LyAdminApp extends Component {
  constructor(props) {
    super(props)
    const cookies = new Cookies()
    // debugger
    this.props.getUserGroups()
    // debugger

    if (props.location.pathname.indexOf('login') !== -1) {
      let { first_name, photo_url, group_id } = getDataFromUrl(props.location.search)

      cookies.set('defaultGroup', group_id, { maxAge })
      cookies.set('userName', first_name, { maxAge })
      cookies.set('userPhoto', photo_url, { maxAge })
    }

    this.state = {
      userPhoto: cookies.get('userPhoto'),
      userName: cookies.get('userName'),
      isLoading: props.isFetching
    }
  }

  componentDidMount() {
    if (this.state.groups) {
      this.props.setCurrentGroupId(this.props.currentGroup)
      this.props.getGroup(this.props.currentGroup)
    } else if (this.props.isAuth) {
      this.props.getGroup(this.props.currentGroup)
    }
  }

  render() {
    if (!this.props.isAuth && !this.props.isError) {
      return <Loader
        isAuth={this.props.isAuth}
      />
    }

    if (!this.props.isInitialized) {
      return <Loader
        isAuth={this.props.isAuth}
      />
    }



    return (
      <div id="app">
        <Header/>
        <MemberList
        className={this.props.MemberList}
        getGroupMembers={this.props.getGroupMembers}
        getUser={this.props.getUser}
        />
        <GroupSettings/>
        <Gifs/>
        <Texts/>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    isInitialized: state.App.isInitialized,
    isAuth: state.App.isAuth,
    isLoading: state.App.isFetching,
    isLoadingGetGroupMembers: state.App.api.getGroupMembers,
    isError: state.App.isError,
    currentGroup: state.App.currentGroupId
  }
}

let mapDispatchTooProps = (dispatch) => {
  return {
    getUserGroups: () => {
      dispatch(getUserGroupsThunk())
    },
    getGroup: (groupId) => {
      dispatch(getGroupSettingsThunk(groupId))
    },
    getUser: (userId, groupId) => {
      dispatch(getUserThunk(userId, groupId))
    },
    toggleIsAuth: (isAuth) => {
      dispatch(toggleIsAuthThunk(isAuth))
    },
    toggleIsError: (isError) => {
      toggleIsError(isError)
    },
    getGroupMembers: (groupId) => {
      dispatch(getGroupMembersThunk(groupId))
    },
    toggleTheme: () => {
      dispatch(changeThemeThunk())
    },
    setCurrentGroupId: (groupId) => {
      dispatch(setCurrentGroupIdThunk(groupId))
  }
  }
}

const LyAdminAppContainer = connect(mapStateToProps, mapDispatchTooProps)(LyAdminApp)

const enhance = compose(
  withTheme,
  withStyles(styles, { withTheme: true })
)

export default enhance(LyAdminAppContainer)

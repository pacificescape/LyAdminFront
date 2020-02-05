import React, { Component } from 'react'
import withTheme from './Theme'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import {
  getUserGroupsThunk,
  getGroupSettingsThunk,
  toggleIsAuthThunk,
  getGroupMembersThunk,
  getUserThunk,
  changeThemeThunk,
  toggleIsError
} from './redux/reducers/App'
import { compose } from 'recompose'

import Loader from './Components/Loader/Loader'
import Header from './Components/Header'
import MemberList from './Components/MemberList'
import Gifs from './Components/Gifs'
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
    this.props.getUserGroups()

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
    }


  }

  componentDidMount() {
      this.props.getGroup(this.state.defaultGroup)
    // this.props.getGroupMembers(this.state.defaultGroup)
  }



  render() {
    if (!this.props.isAuth) {
      return <Loader
        isAuth={this.props.isAuth}
      />
    }

    // if (this.props.isError) {
    //   this.props.getGroupMembers(this.props.currentGroup.info.id)
    //   this.props.toggleIsError(false)
    // }



    return (
      <div id="app">
        <Header
          userPhoto={this.state.userPhoto}
          groups={this.props.groups}
          currentGroup={this.props.currentGroup}
        />
        {/* <Firstline groupTitle={this.props.currentGroup.info.title}/> */}
        <MemberList
        className={this.props.MemberList}
        getGroupMembers={this.props.getGroupMembers}
        getUser={this.props.getUser}
        />
        <Gifs/>
        <GroupSettings/>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    isAuth: state.App.isAuth,
    isLoading: state.App.isFetching,
    isLoadingGetGroupMembers: state.App.api.getGroupMembers,
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
    }
  }
}

const LyAdminAppContainer = connect(mapStateToProps, mapDispatchTooProps)(LyAdminApp)

const enhance = compose(
  withTheme,
  withStyles(styles, { withTheme: true })
)

export default enhance(LyAdminAppContainer)

// сделать метод выдающий страницы таблицы

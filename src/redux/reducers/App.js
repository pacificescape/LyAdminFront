import Cookies from 'universal-cookie';

import getUserGroups from '../../Api/getUserGroups'
import getGroup from '../../Api/getGroup'
import getUser from '../../Api/getUser'
import getGroupMembers from '../../Api/getGroupMembers'

import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import deepOrange from '@material-ui/core/colors/deepOrange';

const SET_GROUPS = 'SET_GROUPS'
const SET_CURRENT_GROUP = 'SET_CURRENT_GROUP'
const SET_GROUP_MEMBERS = 'SET_GROUP_MEMBERS'
const SET_USER = 'SET_USER'

const TOGGLE_THEME = 'TOGGLE_THEME'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_ERROR = 'TOGGLE_IS_ERROR'

const cookies = new Cookies();
const theme = cookies.get('lyAdminTheme') || {}

let initialState = {
    isAuth: false,
    isFetching: true,
    isError: false,
    groups: [],
    currentGroup: {
        id: '',
        info: {},
        settings: {}
    },
    groupmembers: {
        empty: true
    },
    users: {},
    api: {
        getUserGroups: false,
        getGroupMembers: false,
        getUser: false
    },
    theme: {
        type: theme.type || 'dark',
        primary: theme.primary || { main: deepPurple.A200 }
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_IS_AUTH: {
            return { ...state, isAuth: action.isAuth }
        }
        case TOGGLE_IS_FETCHING: {
            if (action.method) {
                return { ...state, api: { ...state.api, [action.method]: action.isFetching}}
            }
            return { ...state, isFetching: action.isFetching }
        }
        case TOGGLE_IS_ERROR: {
            return { ...state, isError: action.isError }
        }
        case SET_GROUPS: {
            return { ...state, groups: action.groups }
        }
        case SET_CURRENT_GROUP: {
            return { ...state, currentGroup: action.group }
        }
        case SET_GROUP_MEMBERS: {
            let newmembers = {}
            Object.assign(newmembers, action.members, state.groupmembers)
            newmembers.empty = false
            debugger;
            return { ...state, groupmembers: newmembers }
        }
        case SET_USER: {
            let newusers = {}
            Object.assign(newusers, action.users, state.users[action.groupId])
            newusers.empty = false
            debugger;
            return { ...state, users: { ...state.users, [action.groupId]: newusers} }
        }
        case TOGGLE_THEME: {
            // if(!action.primary[500] && !action.primary.main) {
            //     action.primary = state.theme.primary
            // }
            const newtheme = {
                type: action.themeType,
                primary: action.primary || state.theme.primary
            }
            debugger;
            cookies.set('lyAdminTheme', {type: action.themeType, primary: action.primary})
            return { ...state, theme: newtheme }
        }
        default: return state
    }
}

export const setGroups = (groups) => ({ type: SET_GROUPS, groups })
export const setCurrentGroup = (group) => ({ type: SET_CURRENT_GROUP, group })
export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (users, groupId) => ({ type: SET_USER, users, groupId })

export const changeTheme = (themeType, primary) => ({ type: TOGGLE_THEME, themeType, primary })

export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetching = (isFetching, method) => ({ type: TOGGLE_IS_FETCHING, isFetching, method })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })

export const getUserGroupsThunk = () => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUserGroups'))

    getUserGroups().then(res => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            dispatch(toggleIsFetching(false, 'getUserGroups'))
            return
        }

        dispatch(toggleIsAuth(true))
        let { groups } = res.result
        dispatch(setGroups(groups))
        dispatch(toggleIsFetching(false, 'getUserGroups'))
    })
        .catch((err) => {
            dispatch(toggleIsError(true))
            console.log('getUserGroups thunk failed', err)
        })
}

export const getCurrentGroupThunk = (groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true))

    getGroup(groupId).then((res) => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        let groupInfo = res.result
        dispatch(setCurrentGroup(groupInfo))
        dispatch(toggleIsFetching(false))
    })
}

export const getUserThunk = (userIds, groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUser'))

    let grabUsers = Promise.all(userIds.map( async (userId) => {

        return getUser(userId.telegram_id).then((res) => {
            if (!res.ok) {
                dispatch(toggleIsError(true))
                return
            }
            return res.result
        })
    }))

    let usersObj = {}

    grabUsers.then((users) => {
        users.forEach((user) => {
            usersObj[user.telegram_id] = user
        })
        debugger
        dispatch(setUser(usersObj, groupId))
        dispatch(toggleIsFetching(false, 'getUser'))
    })
}

export const toggleIsAuthThunk = (isAuth) => (dispatch) => {
    dispatch(toggleIsAuth(isAuth))
    dispatch(toggleIsFetching(false))
}

export const getGroupMembersThunk = (groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getGroupMembers'))

    getGroupMembers(groupId).then((res) => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        let members = res.result
        dispatch(setGroupMembers({[groupId]: members}))
        dispatch(toggleIsFetching(false, 'getGroupMembers'))
    })
    .catch((err) => {
        dispatch(toggleIsError(true))
        console.log('getUserGroups thunk failed', err)
    })
}

export const changeThemeThunk = (type, primary) => (dispatch) => {
        dispatch(changeTheme(type, primary))
}

// отдельный стор для groupmembers

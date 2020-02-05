import Cookies from 'universal-cookie';

import getUserGroups from '../../Api/getUserGroups'
import getGroup from '../../Api/getGroup'
import getUser from '../../Api/getUser'
import getGroupMembers from '../../Api/getGroupMembers'

import deepPurple from '@material-ui/core/colors/deepPurple';

const SET_GROUPS = 'SET_GROUPS'
const SET_CURRENT_GROUP = 'SET_CURRENT_GROUP'
const SET_CURRENT_GROUP_ID = 'SET_CURRENT_GROUP_ID'
const SET_GROUP_MEMBERS = 'SET_GROUP_MEMBERS'
const SET_USER = 'SET_USER'

const TOGGLE_THEME = 'TOGGLE_THEME'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_ERROR = 'TOGGLE_IS_ERROR'
const TOGGLE_IS_CHANGING_SETTINGS = 'TOGGLE_IS_CHANGING_SETTINGS'

const cookies = new Cookies();
const theme = cookies.get('lyAdminTheme') || {}

const initialSettings = {
    settings: {
        welcome: {
            enable: true,
            timer: 180,
            gifs: [],
            texts: []
        },
        banan: {
            default: 300
        },
        cas: true
    }
}

let initialState = {
    isAuth: false,
    isFetching: true,
    isError: false,
    isChangingSettings: false,
    groups: {},
    currentGroupId: cookies.get('defaultGroup'),
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
                return { ...state, api: { ...state.api, [action.method]: action.isFetching } }
            }
            return { ...state, isFetching: action.isFetching }
        }
        case TOGGLE_IS_CHANGING_SETTINGS: {
            return { ...state, isChangingSettings: action.isChanging }
        }
        case TOGGLE_IS_ERROR: {
            return { ...state, isError: action.isError }
        }
        case SET_CURRENT_GROUP_ID: {
            return { ...state, currentGroupId: action.groupId }
        }
        case SET_GROUPS: {
            debugger
            return { ...state, groups: action.groups }
        }
        case SET_CURRENT_GROUP: {
            debugger
            let currentGroup = state.groups[action.group.info.id]
            return {
                ...state,
                currentGroupId: action.group.info.id,
                groups: {
                    ...state.groups,
                    [action.group.info.id]: {
                        ...currentGroup,
                        ...action.group
                    }
                }
            }
        }
        case SET_GROUP_MEMBERS: {
            let newmembers = {}
            newmembers = { ...action.members, ...state.groupmembers }
            newmembers.empty = false
            return { ...state, groupmembers: newmembers }
        }
        case SET_USER: {
            let newusers = {}
            newusers = { ...action.users, ...state.users[action.groupId] }
            newusers.empty = false
            return { ...state, users: { ...state.users, [action.groupId]: newusers } }
        }
        case TOGGLE_THEME: {
            // if(!action.primary[500] && !action.primary.main) {
            //     action.primary = state.theme.primary
            // }
            const newtheme = {
                type: action.themeType,
                primary: action.primary || state.theme.primary
            }
            cookies.set('lyAdminTheme', { type: action.themeType, primary: action.primary })
            return { ...state, theme: newtheme }
        }
        default: return state
    }
}

export const setGroups = (groups) => ({ type: SET_GROUPS, groups })
export const setCurrentGroup = (group) => ({ type: SET_CURRENT_GROUP, group })
export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (users, groupId) => ({ type: SET_USER, users, groupId })
export const setCurrentGroupId = (groupId) => ({ type: SET_CURRENT_GROUP_ID, groupId })
export const changeTheme = (themeType, primary) => ({ type: TOGGLE_THEME, themeType, primary })

export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetching = (isFetching, method) => ({ type: TOGGLE_IS_FETCHING, isFetching, method })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })
export const toggleisChangingSettings = (isChanging) => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })

export const getUserGroupsThunk = () => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUserGroups'))

    getUserGroups().then(res => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            dispatch(toggleIsFetching(false, 'getUserGroups'))
            return
        }
        debugger
        const arrOfGroups = res.result.groups || []

        let groups = {}
        arrOfGroups.forEach( group => {
            groups = { ...groups, [group.id]: { ...group, ...initialSettings }}
        })

        dispatch(setGroups(groups))
        dispatch(toggleIsAuth(true))
        dispatch(toggleIsFetching(false, 'getUserGroups'))
    })
        .catch((err) => {
            dispatch(toggleIsError(true))
            console.log('getUserGroups thunk failed', err)
        })
}

export const setCurrentGroupIdThunk = groupId => (dispatch) => {
    dispatch(setCurrentGroupId(groupId))
}

export const getGroupSettingsThunk = (groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true))
    debugger
    getGroup(groupId).then((res) => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        let groupInfo = res.result
        debugger;
        dispatch(setCurrentGroup(groupInfo))
        dispatch(toggleIsFetching(false))
    })
}

export const getUserThunk = (userIds, groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUser'))

    let grabUsers = Promise.all(userIds.map((userId) => {

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
        dispatch(setGroupMembers({ [groupId]: members }))
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

export const applySettingsThunk = () => (dispatch) => {
    dispatch(toggleisChangingSettings(true))

    // saveSettings then applySettings

    // dispatch(applySettings())

    // then dispatch(toggleisChangingSettings(false))
}

// отдельный стор для groupmembers

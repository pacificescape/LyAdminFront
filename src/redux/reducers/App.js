import Cookies from 'universal-cookie';

import getUserGroups from '../../Api/getUserGroups'
import getGroup from '../../Api/getGroup'
import getUser from '../../Api/getUser'
import getGroupMembers from '../../Api/getGroupMembers'

import deepPurple from '@material-ui/core/colors/deepPurple';

const INITIALIZE_APP = 'INITIALIZE_APP'

const SET_GROUPS = 'SET_GROUPS'
const SET_GROUP_SETTINGS = 'SET_GROUP_SETTINGS'
const SET_CURRENT_GROUP_ID = 'SET_CURRENT_GROUP_ID'
const SET_GROUP_MEMBERS = 'SET_GROUP_MEMBERS'
const SET_USER = 'SET_USER'

const TOGGLE_THEME = 'TOGGLE_THEME'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_INITIALIZING = 'TOGGLE_IS_INITIALIZING'
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
    isInitialized: false,
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
        case INITIALIZE_APP: {
            return { ...state, isInitialized: action.isInitialized }
        }
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
            let newGroups = state.groups
            for (const group in action.groups) {
                if (newGroups[group]) {
                    delete action.groups[group].settings
                }
                newGroups = { ...newGroups, [group]: { ...action.groups[group], ...newGroups[group] } }
                debugger
            }

            return { ...state, groups: newGroups }
        }
        case SET_GROUP_SETTINGS: {
            debugger
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.group.info.id]: {
                        ...state.groups[action.group.info.id],
                        info: action.group.info,
                        settings: action.group.settings
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
export const setGroupSettings = (group) => ({ type: SET_GROUP_SETTINGS, group })
export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (users, groupId) => ({ type: SET_USER, users, groupId })
export const setCurrentGroupId = (groupId) => ({ type: SET_CURRENT_GROUP_ID, groupId })
export const changeTheme = (themeType, primary) => ({ type: TOGGLE_THEME, themeType, primary })

export const toggleIsInitialized = (isInitialized) => ({ type: INITIALIZE_APP, isInitialized })
export const toggleiIsInitializing = (initializing) => ({ type: TOGGLE_IS_INITIALIZING, initializing })
export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetching = (isFetching, method) => ({ type: TOGGLE_IS_FETCHING, isFetching, method })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })
export const toggleisChangingSettings = (isChanging) => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })

export const initialazeAppThunk = () => async (dispatch) => {
    dispatch(toggleiIsInitializing(true))
    let response = await getUserGroups().catch(err => {
        console.log('getUserGroups failed', err)
        dispatch(toggleIsError(true))
    })

    if (!response.ok) {
        console.log('server didn\'t respond in initialazing')
        dispatch(toggleIsError(true))
        dispatch(toggleiIsInitializing(false))
        return
    }

    dispatch(toggleiIsInitializing(false))
}

export const getUserGroupsThunk = () => async (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUserGroups'))
    dispatch(toggleiIsInitializing(true))

    let response = await getUserGroups().catch(err => {
            console.log('getUserGroups failed', err)
            dispatch(toggleIsError(true))
        })

    if (!response.ok) {
        console.log('server didn\'t respond')
        dispatch(toggleIsError(true))
        dispatch(toggleIsFetching(false, 'getUserGroups'))
        dispatch(toggleiIsInitializing(false))
        return
    }
    debugger
    const arrOfGroups = response.result.groups || []

    let groups = {}
    arrOfGroups.forEach(group => {
        groups = { ...groups, [group.id]: { ...group, ...initialSettings } }
    })

    dispatch(setGroups(groups))


    dispatch(toggleIsFetching(false, 'getUserGroups'))
    dispatch(toggleIsAuth(true))
    dispatch(toggleiIsInitializing(false))
    dispatch(toggleIsInitialized(true))

}

export const setCurrentGroupIdThunk = groupId => (dispatch) => {
    dispatch(setCurrentGroupId(groupId))
}

export const getGroupSettingsThunk = (groupId) => async (dispatch) => {
    if (!groupId) {
        console.log('getgroupSettings: no group')
        return
    }

    dispatch(toggleIsFetching(true))
    // debugger
    const response = await getGroup(groupId).catch(err => console.log(err))

    if (!response.ok) {
        dispatch(toggleIsError(true))
        return
    }

    let groupInfo = response.result
    // debugger
    dispatch(setGroupSettings(groupInfo))
    dispatch(toggleIsFetching(false))
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

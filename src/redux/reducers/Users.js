
import getUserGroups from '../../Api/getUserGroups'
import getGroup from '../../Api/getGroup'//
import getUser from '../../Api/getUser'
import getGroupMembers from '../../Api/getGroupMembers' //

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

const initialSettings = {
    users: {},
    groupmembers: {}
}

export default (state = initialSettings, action) => {
    switch (action.type) {
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
        default: return state
    }
}


export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (users, groupId) => ({ type: SET_USER, users, groupId })


export const toggleIsInitialized = (isInitialized) => ({ type: INITIALIZE_APP, isInitialized })
export const toggleiIsInitializing = (initializing) => ({ type: TOGGLE_IS_INITIALIZING, initializing })
export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetching = (isFetching, method) => ({ type: TOGGLE_IS_FETCHING, isFetching, method })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })
export const toggleisChangingSettings = (isChanging) => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })


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

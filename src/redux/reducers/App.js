import getUserGroups from '../../Api/getUserGroups'
import getGroup from '../../Api/getGroup'
import getUser from '../../Api/getUser'
import getGroupMembers from '../../Api/getGroupMembers'

const SET_GROUPS = 'SET_GROUPS'
const SET_CURRENT_GROUP = 'SET_CURRENT_GROUP'
const SET_GROUP_MEMBERS = 'SET_GROUP_MEMBERS'
const SET_USER = 'SET_USER'

const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_ERROR = 'TOGGLE_IS_ERROR'


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
    users: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_IS_AUTH: {
            return { ...state, isAuth: action.isAuth }
        }
        case TOGGLE_IS_FETCHING: {
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
            let usersGroup = state.users[action.id] || {}
            Object.assign(usersGroup, {[action.id]: action.user})
            Object.assign(newusers, usersGroup, state.users)
            newusers.empty = false
            debugger;
            return { ...state, users: newusers }
        }
        default: return state
    }
}

export const setGroups = (groups) => ({ type: SET_GROUPS, groups })
export const setCurrentGroup = (group) => ({ type: SET_CURRENT_GROUP, group })
export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (user, id) => ({ type: SET_USER, user })

export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })

export const getUserGroupsThunk = () => (dispatch) => {
    dispatch(toggleIsFetching(true))

    getUserGroups().then(res => {
        dispatch(toggleIsFetching(false))

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        dispatch(toggleIsAuth(true))
        let { groups } = res.result
        dispatch(setGroups(groups))
    })
        .catch((err) => {
            dispatch(toggleIsError(true))
            console.log('getUserGroups thunk failed', err)
        })
}

export const getCurrentGroupThunk = (groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true))

    getGroup(groupId).then((res) => {
        dispatch(toggleIsFetching(false))

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        let { groupInfo } = res.result
        dispatch(setCurrentGroup(groupInfo))
    })
}

export const getUserThunk = (userId, groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true))

    getUser(userId).then((res) => {
        dispatch(toggleIsFetching(false))

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }
        debugger
        let userInfo = res.result
        dispatch(setUser(userInfo, groupId))
    })
}

export const toggleIsAuthThunk = (isAuth) => (dispatch) => {
    dispatch(toggleIsAuth(isAuth))
    dispatch(toggleIsFetching(false))
}

export const getGroupMembersThunk = (groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true))

    getGroupMembers(groupId).then((res) => {
        dispatch(toggleIsFetching(false))

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }

        let members = res.result
        dispatch(setGroupMembers({[groupId]: members}))
    })
    .catch((err) => {
        dispatch(toggleIsError(true))
        console.log('getUserGroups thunk failed', err)
    })
}

// отдельный стор для groupmembers

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
    users: {},
    api: {
        getUserGroups: false,
        getGroupMembers: false,
        getUser: false
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
            Object.assign(newusers, action.user, state.users[action.groupId])
            newusers.empty = false
            debugger;
            return { ...state, users: { ...state.users, [action.groupId]: newusers} }
        }
        default: return state
    }
}

export const setGroups = (groups) => ({ type: SET_GROUPS, groups })
export const setCurrentGroup = (group) => ({ type: SET_CURRENT_GROUP, group })
export const setGroupMembers = (members) => ({ type: SET_GROUP_MEMBERS, members })
export const setUser = (user, groupId) => ({ type: SET_USER, user, groupId })

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

        let { groupInfo } = res.result
        dispatch(setCurrentGroup(groupInfo))
        dispatch(toggleIsFetching(false))
    })
}

export const getUserThunk = (userId, groupId) => (dispatch) => {
    dispatch(toggleIsFetching(true, 'getUser'))

    getUser(userId).then((res) => {

        if (!res.ok) {
            dispatch(toggleIsError(true))
            return
        }
        debugger
        let userInfo = res.result
        dispatch(setUser({ [userInfo.telegram_id]: userInfo }, groupId))
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
        dispatch(toggleIsFetching(false, 'getGroupMembers'))

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

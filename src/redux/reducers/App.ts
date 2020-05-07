import Cookies from 'universal-cookie';

import getUserGroups from '../../Api/getUserGroups'
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

const cookies = new Cookies();
const theme = cookies.get('lyAdminTheme') || {}
const groupId = cookies.get('defaultGroup') || ''

let initialState = {
    isInitialized: false,
    isAuth: false,
    isFetching: true,
    isError: false,
    isChangingSettings: false,
    currentGroupId: groupId,
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

export type InitialStateType = typeof initialState

interface ActionType {
    type: string,
    method: 'getUserGroups'| 'getGroupMembers' | 'getUser',
    themeType: 'dark' | 'light',
    isInitialized: boolean,
    isFetching: boolean,
    isChanging: boolean,
    isError: boolean,
    isAuth: boolean,
    groupId: string,
    primary: string
}

export default (state = initialState, action: ActionType): InitialStateType => {
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

        case TOGGLE_THEME: {
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


type SetGroupsType = {
    type: typeof SET_GROUPS,
    groups: Array<object>
}
export const setGroups = (groups: Array<object>): SetGroupsType => ({ type: SET_GROUPS, groups })

type SetGroupSettingsType = {
    type: typeof SET_GROUP_SETTINGS,
    group: object
}
export const setGroupSettings = (group: object): SetGroupSettingsType => ({ type: SET_GROUP_SETTINGS, group })

type SetGroupMembersType = {
    type: typeof SET_GROUP_MEMBERS,
    members: Array<object>
}
export const setGroupMembers = (members: Array<object>): SetGroupMembersType => ({ type: SET_GROUP_MEMBERS, members })

type SetUserType = {
    type: typeof SET_USER,
    users: Array<object>,
    groupId: string
}
export const setUser = (users: Array<object>, groupId: string): SetUserType => ({ type: SET_USER, users, groupId })

type SetCurrentGroupIdType = {
    type: typeof SET_CURRENT_GROUP_ID,
    groupId: string
}
export const setCurrentGroupId = (groupId: string): SetCurrentGroupIdType => ({ type: SET_CURRENT_GROUP_ID, groupId })

type ChangeThemeType = {
    type: typeof TOGGLE_THEME, themeType:string,
    primary:string
}
export const changeTheme = (themeType:string, primary:string): ChangeThemeType => ({ type: TOGGLE_THEME, themeType, primary })


type ToggleIsInitializedType = {
    type: typeof INITIALIZE_APP,
    isInitialized: boolean
}
export const toggleIsInitialized = (isInitialized: boolean): ToggleIsInitializedType => ({ type: INITIALIZE_APP, isInitialized })

type ToggleiIsInitializingType = {
    type: typeof TOGGLE_IS_INITIALIZING,
    initializing: boolean
}
export const toggleiIsInitializing = (initializing: boolean): ToggleiIsInitializingType => ({ type: TOGGLE_IS_INITIALIZING, initializing })

type ToggleIsAuthType = {
    type: typeof TOGGLE_IS_AUTH,
    isAuth: boolean
}
export const toggleIsAuth = (isAuth: boolean): ToggleIsAuthType => ({ type: TOGGLE_IS_AUTH, isAuth })

type ToggleIsFetchingType = {
    type: typeof TOGGLE_IS_FETCHING,
    isFetching: boolean,
    method: string | undefined
}
export const toggleIsFetching = (isFetching: boolean, method: string | undefined): ToggleIsFetchingType => ({ type: TOGGLE_IS_FETCHING, isFetching, method })

type ToggleIsErrorType = {
    type: typeof TOGGLE_IS_ERROR,
    isError: boolean
}
export const toggleIsError = (isError: boolean): ToggleIsErrorType => ({ type: TOGGLE_IS_ERROR, isError })

type ToggleisChangingSettingsType = {
    type: typeof TOGGLE_IS_CHANGING_SETTINGS,
    isChanging: boolean
}
export const toggleisChangingSettings = (isChanging: boolean): ToggleisChangingSettingsType => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })

// THUNKS

export const initialazeAppThunk = () => async (dispatch: (arg0: { type: string; initializing?: boolean; isError?: boolean; }) => void) => {
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

export const setCurrentGroupIdThunk = (groupId: string) => (dispatch: (arg0: { type: string; groupId: string; }) => void) => {
    dispatch(setCurrentGroupId(groupId))
}

export const toggleIsAuthThunk = (isAuth: boolean) => (dispatch: (arg0: { type: string; isAuth?: boolean; isFetching?: boolean; method?: string; }) => void) => {
    dispatch(toggleIsAuth(isAuth))
    dispatch(toggleIsFetching(false, undefined))
}

export const changeThemeThunk = (type: string, primary: string) => (dispatch: (arg0: { type: string; themeType: string; primary: string; }) => void) => {
    dispatch(changeTheme(type, primary))
}

export const applySettingsThunk = () => (dispatch: (arg0: { type: string; isChanging: boolean; }) => void) => {
    dispatch(toggleisChangingSettings(true))

    // saveSettings then applySettings

    // dispatch(applySettings())

    // then dispatch(toggleisChangingSettings(false))
}

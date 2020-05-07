import getUserGroups from '../../Api/getUserGroups' // list of groups
import getGroup from '../../Api/getGroup' // settings of group
import { InitialStateType } from '../../types/types'

const SET_GROUPS = 'SET_GROUPS' // groups
const SET_GROUP_SETTINGS = 'SET_GROUP_SETTINGS'

const INITIALIZE_APP = 'INITIALIZE_APP'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING_SETTINGS = 'TOGGLE_IS_FETCHING_SETTINGS'
const TOGGLE_IS_INITIALIZING = 'TOGGLE_IS_INITIALIZING'
const TOGGLE_IS_ERROR = 'TOGGLE_IS_ERROR'
const TOGGLE_IS_CHANGING_SETTINGS = 'TOGGLE_IS_CHANGING_SETTINGS'

let initialState:InitialStateType = {
    groups: {},
    settings: {},
    ids: [],
    isFetchingSettings: true
}

export default (state = initialState, action: any): InitialStateType => {
    switch (action.type) {
        case SET_GROUPS: {
            let keys = Object.keys(action.groups)

            let newGroups = keys.reduce((acc: Record<string, any>, key: string) => {
                if (state.groups[key]) {
                    delete acc[key].settings
                }

                return { ...acc, [key]: { ...action.groups[key], ...state.groups[key] } }
            }
                , { ...state.groups })

            return { ...state, groups: newGroups }
        }
        case SET_GROUP_SETTINGS: {
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [action.groupInfo.info.id]: {
                        ...action.groupInfo.info,
                        ...action.groupInfo.settings
                    }
                }
            }
        }
        case TOGGLE_IS_FETCHING_SETTINGS: {
            return {
                ...state,
                isFetchingSettings: action.isFetchingSettings
            }
        }
        default: return state
    }
}


type ActionType = {
    type: typeof TOGGLE_IS_CHANGING_SETTINGS
        | typeof SET_GROUPS
        | typeof SET_GROUP_SETTINGS
        | typeof INITIALIZE_APP
        | typeof TOGGLE_IS_AUTH
        | typeof TOGGLE_IS_FETCHING_SETTINGS
        | typeof TOGGLE_IS_INITIALIZING
        | typeof TOGGLE_IS_ERROR
        | typeof TOGGLE_IS_CHANGING_SETTINGS
    }

export const setGroups = (groups: Array<object>) => ({ type: SET_GROUPS, groups })
export const setGroupSettings = (groupInfo: object) => ({ type: SET_GROUP_SETTINGS, groupInfo })

export const toggleIsInitialized = (isInitialized: boolean) => ({ type: INITIALIZE_APP, isInitialized })
export const toggleiIsInitializing = (initializing: boolean) => ({ type: TOGGLE_IS_INITIALIZING, initializing })
export const toggleIsAuth = (isAuth: boolean) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetchingSettings = (isFetchingSettings: boolean) => ({ type: TOGGLE_IS_FETCHING_SETTINGS, isFetchingSettings })
export const toggleIsError = (isError: boolean) => ({ type: TOGGLE_IS_ERROR, isError })
export const toggleisChangingSettings = (isChanging: boolean): Record<string, any> => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })



export const getUserGroupsThunk = () => async (dispatch: any) => {
    dispatch(toggleIsFetchingSettings(true))
    dispatch(toggleiIsInitializing(true))

    let response = await getUserGroups().catch(err => {
            console.log('getUserGroups failed', err)
            dispatch(toggleIsError(true))
        })

    if (!response.ok) {
        console.log('server didn\'t respond')
        dispatch(toggleIsError(true))
        dispatch(toggleIsFetchingSettings(false))
        dispatch(toggleiIsInitializing(false))
        return
    }
    const arrOfGroups = response.result.groups || []

    let groups = arrOfGroups.reduce((groups: object, group: Record<string, any>) => { return { ...groups, [group.id]: { ...group } } }, {})

    dispatch(setGroups(groups))

    setTimeout(() => {
        dispatch(toggleIsFetchingSettings(false))
        dispatch(toggleIsAuth(true))
        dispatch(toggleiIsInitializing(false))
        dispatch(toggleIsInitialized(true))
    }, 10)
}

export const getGroupSettingsThunk = (groupId: string) => async (dispatch: any) => {
    if (!groupId) {
        console.log('getgroupSettings: no group')
        return
    }

    dispatch(toggleIsFetchingSettings(true))
    // dispatch(toggleIsFetchingSettings(true))
    const response = await getGroup(groupId).catch(err => console.log(err))

    if (!response.ok) {
        dispatch(toggleIsError(true))
        return
    }

    let groupInfo = response.result
    dispatch(setGroupSettings(groupInfo))
    dispatch(toggleIsFetchingSettings(false))
}

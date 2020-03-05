import getUserGroups from '../../Api/getUserGroups' // list of groups
import getGroup from '../../Api/getGroup' // settings of group

const SET_GROUPS = 'SET_GROUPS' // groups
const SET_GROUP_SETTINGS = 'SET_GROUP_SETTINGS'

const INITIALIZE_APP = 'INITIALIZE_APP'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING_SETTINGS = 'TOGGLE_IS_FETCHING_SETTINGS'
const TOGGLE_IS_INITIALIZING = 'TOGGLE_IS_INITIALIZING'
const TOGGLE_IS_ERROR = 'TOGGLE_IS_ERROR'
const TOGGLE_IS_CHANGING_SETTINGS = 'TOGGLE_IS_CHANGING_SETTINGS'

let initialState = {
    groups: {},
    settings: {},
    ids: [],
    isFetchingSettings: true
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUPS: {
            let keys = Object.keys(action.groups)

            let newGroups = keys.reduce((acc, key) => {
                if (state.groups[key]) {
                    delete acc[key].settings
                }

                return { ...acc, [key]: { ...action.groups[key], ...state.groups[key] } }
            }
                , { ...state.groups })

            return { ...state, groups: newGroups }
        }
        case SET_GROUP_SETTINGS: {
            debugger
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



export const setGroups = (groups) => ({ type: SET_GROUPS, groups })
export const setGroupSettings = (groupInfo) => ({ type: SET_GROUP_SETTINGS, groupInfo })

export const toggleIsInitialized = (isInitialized) => ({ type: INITIALIZE_APP, isInitialized })
export const toggleiIsInitializing = (initializing) => ({ type: TOGGLE_IS_INITIALIZING, initializing })
export const toggleIsAuth = (isAuth) => ({ type: TOGGLE_IS_AUTH, isAuth })
export const toggleIsFetchingSettings = (isFetchingSettings) => ({ type: TOGGLE_IS_FETCHING_SETTINGS, isFetchingSettings })
export const toggleIsError = (isError) => ({ type: TOGGLE_IS_ERROR, isError })
export const toggleisChangingSettings = (isChanging) => ({ type: TOGGLE_IS_CHANGING_SETTINGS, isChanging })



export const getUserGroupsThunk = () => async (dispatch) => {
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

    let groups = arrOfGroups.reduce((groups, group) => { return { ...groups, [group.id]: { ...group } } }, {})

    dispatch(setGroups(groups))

    setTimeout(() => {
        dispatch(toggleIsFetchingSettings(false))
        dispatch(toggleIsAuth(true))
        dispatch(toggleiIsInitializing(false))
        dispatch(toggleIsInitialized(true))
    }, 1000)
}

export const getGroupSettingsThunk = (groupId) => async (dispatch) => {
    if (!groupId) {
        console.log('getgroupSettings: no group')
        return
    }

    dispatch(toggleIsFetchingSettings(true))
    // dispatch(toggleIsFetchingSettings(true))
    debugger
    const response = await getGroup(groupId).catch(err => console.log(err))

    if (!response.ok) {
        dispatch(toggleIsError(true))
        return
    }

    let groupInfo = response.result
    debugger
    dispatch(setGroupSettings(groupInfo))
    dispatch(toggleIsFetchingSettings(false))
}

import GroupsStore from '../../Stores/GroupsStore'

const SET_GROUPS = 'SET_GROUPS'
const TOGGLE_IS_AUTH = 'TOGGLE_IS_AUTH'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'


let initialState = {
    isAuth: false,
    isFetching: true,
    groups: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_IS_AUTH: {
            return {...state, isFetching: action.isAuth}
        }
        case TOGGLE_IS_FETCHING: {
            return {...state, isFetching: action.isFetching}
        }
        case SET_GROUPS: {
            // state.groups = {...action.payload.groups}
            return {...state, groups: action.payload.groups}
        }
        default: return state
    }
}

export const setGroups = (groups) => ({type: SET_GROUPS, groups})
export const toggleIsAuth = (isAuth) => ({type: TOGGLE_IS_AUTH, isAuth})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})

export const getUserGroupsThunk = (isAuth, isLoading) => (dispatch) => {

    dispatch(toggleIsFetching(true))

    GroupsStore.getUserGroups().then(res => {

        dispatch(toggleIsFetching(false))

        let { groups }= res.result
        dispatch(setGroups(groups))
    })
    .catch((err) => console.log('getUserGroups thunk failed', err))
}

export const toggleIsAuthThunk = (isAuth) => (dispatch) => {
    dispatch(toggleIsAuth(isAuth))
}

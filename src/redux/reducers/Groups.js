import GroupsStore from '../../Stores/GroupsStore'

const SET_GROUPS = 'SET_GROUPS'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'


let initialState = {
    isFetching: false,
    groups: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUPS: {
            state.groups = action.payload.groups
            return state
          }
        case TOGGLE_IS_FETCHING: {
            return {...state, isFetching: action.isFetching}
          }
        default: return state
    }
}

export const setGroups = (groups) => ({type: SET_GROUPS, groups})
export const toggleIsFetching = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})

export const getUserGroups = (dispatch) => {

    dispatch(toggleIsFetching(true))

    GroupsStore.getUserGroups().then(res => {

        dispatch(toggleIsFetching(false))

        let { groups }= res.result
        dispatch(setGroups(groups))
    })
    .catch((err) => console.log('getUserGroups thunk failed', err))
}

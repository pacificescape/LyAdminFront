let initialState = {
    id: '',
    info: {},
    settings: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT' :
            let { id, info, settings } = action.payload.result;
            state = { id, info, settings}
            return state
        default: return state
    }
}

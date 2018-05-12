const initState = {
    packages: '',
    vars: '',
    configs: '',
    base: 0
}

const TYPES = {
    update: Symbol('update')
}

module.exports.reducers = (state = initState, {type, payload}) => {
    if (type === TYPES.update) {
        return Object.assign({}, state, payload)
    }
    return state;
}
module.exports.TYPES = TYPES;
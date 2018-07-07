const initState = {
    // webpack
    Packages: {},
    Vars: {},
    Configs: {},
    VarsProd: {},
    ConfigsProd: {},
    DLLCount: 0,

    // gulp
    gPackages: {},
    gVars: {},
    gConfigs: {}
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
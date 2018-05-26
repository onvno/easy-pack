/**
 * 处理基本配置
 */
const path = require('path');
const merge = require('webpack-merge');
const Util = require('../utils.js');
const { TYPES } = require('../reducer.js');

const EasyRoot = process.env['APP_PATH']; //运行环境根目录


const baseRender = (dispatch, state, version) => {

    const PackRoot = path.resolve(process.env['APP_PATH'], 'process', version);
    const baseVarConfig = require(path.resolve(PackRoot, './base/config.js'));
    const baseVarConfigProd = require(path.resolve(PackRoot, './base/config.prod.js'));
    const baseJSON = require(path.resolve(PackRoot,'./base/package.json'));

    const {Packages} = state;
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: merge(Packages, baseJSON),
            // Packages: baseJSON,
            Vars: baseVarConfig.var,
            Configs: baseVarConfig.config,
            VarsProd: baseVarConfigProd.var,
            ConfigsProd: baseVarConfigProd.config,
        }
    })
}

module.exports = baseRender
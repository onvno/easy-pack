/**
 * 处理基本配置
 */
const path = require('path');
const Util = require('../utils.js');
const { TYPES } = require('../reducer.js');

const EasyRoot = process.env['APP_PATH']; //运行环境根目录
const PackRoot = path.resolve(process.env['APP_PATH'], 'process/pack');

const baseVarConfig = require(path.resolve(PackRoot, './base/config.js'));
const baseVarConfigProd = require(path.resolve(PackRoot, './base/config.prod.js'));
const baseJSON = require(path.resolve(PackRoot,'./base/package.json'));

const baseRender = (dispatch) => {
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: baseJSON,
            Vars: baseVarConfig.var,
            Configs: baseVarConfig.config,
            VarsProd: baseVarConfigProd.var,
            ConfigsProd: baseVarConfigProd.config,
        }
    })
}

module.exports = baseRender
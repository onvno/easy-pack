/**
 * 处理基本配置
 */
const path = require('path');
const Util = require('../utils.js');
const { TYPES } = require('../reducer.js');

const EasyRoot = process.cwd(); //运行环境根目录
const PackRoot = path.resolve(process.cwd(), 'process/pack');

const baseVarConfig = require(path.resolve(PackRoot, './base/config.js'));
const baseJSON = require(path.resolve(PackRoot,'./base/package.json'));

const baseRender = (dispatch) => {
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: baseJSON,
            Vars: baseVarConfig.var,
            Configs: baseVarConfig.config,
        }
    })
}

module.exports = baseRender
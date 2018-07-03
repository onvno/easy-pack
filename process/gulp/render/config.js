/**
 * 编译文件类型处理
 */
const path = require('path');
const merge = require('webpack-merge');
const { TYPES } = require('../../reducer.js');

const EasyRoot = process.env['APP_PATH']; //运行环境根目录

const configRender = (state, part, dispatch) => {
    const { gPackages, gVars, gConfigs } = state;
    const GulpRoot = path.resolve(EasyRoot, 'process', 'gulp')
    const packVarConfig = require(path.resolve(GulpRoot, `./${part}/gulpfile.js`));
    const packJSON = require(path.resolve(GulpRoot,`./${part}/package.json`));
    
    // fix数组转成对象，原值被覆盖
    let mergeConfigs = {};
    const toString = Object.prototype.toString;
    if(toString.call(gConfigs) === '[object Object]'){
        const lastConfig = Object.values(gConfigs);
        mergeConfigs = Object.assign({}, lastConfig.concat(packVarConfig.config));
    }

    dispatch({
        type: TYPES.update,
        payload: {
            gPackages: merge(gPackages, packJSON),
            gVars: merge(gVars, packVarConfig.var),
            gConfigs: mergeConfigs,
        }
    })
}

module.exports = configRender
/**
 * 编译文件类型处理
 */
const path = require('path');
const merge = require('webpack-merge');
const Util = require('../utils.js');
const { TYPES } = require('../reducer.js');

const EasyRoot = process.cwd(); //运行环境根目录

const dllRender = (state, part, dispatch) => {
    const {Packages, Vars, Configs} = state;
    
    const packObj = {};
    packObj[part] = "*";
    const packJSON = {
        "dependencies": packObj
    }

    dispatch({
        type: TYPES.update,
        payload: {
            Packages: merge(Packages, packJSON),
        }
    })
}

module.exports = dllRender
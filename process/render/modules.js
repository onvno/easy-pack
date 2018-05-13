/**
 * 编译文件类型处理
 */
const path = require('path');
const merge = require('webpack-merge');
const Util = require('../utils.js');
const { TYPES } = require('../reducer.js');

const EasyRoot = process.cwd(); //运行环境根目录

const moduleRender = (name, state, part, dispatch) => {
    const {Packages, Vars, Configs} = state;
    const ModuleRoot = path.resolve(EasyRoot, `process/pack/${name}`);
    const packVarConfig = require(path.resolve(ModuleRoot, `./${part}/config.js`));
    const packJSON = require(path.resolve(ModuleRoot,`./${part}/package.json`));
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: merge(Packages, packJSON),
            Vars: merge(Vars, packVarConfig.var),
            Configs: merge.strategy(
                {
                    entry: 'replace', // or 'replace', defaults to 'append'
                    //plugins: 'replace',
                    // 因为项目中使用了`<%`的字符串，所以默认replace方式不可行，只能通过避免重复书写plugin
                    'module.loaders': 'replace'
                }
            )(Configs, packVarConfig.config),
        }
    })
}

module.exports = moduleRender
/**
 * 文件写入
 */
const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const Util = require('./utils.js');

const writeFile = (state , ProjectPath) => {
    const {Packages, Vars, Configs} = state;

    /**
     * 写入package.json
     */
    const mergeJsonFile = path.resolve(ProjectPath, './package.json');
    const JSONStr = JSON.stringify(Packages, null, 4);
    fs.writeFileSync(mergeJsonFile, JSONStr, 'utf-8');


    /**
     * 写入webpack文件
     */
    const mergeFile = path.resolve(ProjectPath, './config/webpack.config.js');
    const webPackConfigStr = JSON.stringify(Configs, Util.newReplace, 4);
    const webPackConfigStrWrap = `module.exports = ` + webPackConfigStr;

    let webPackVarStr = "";
    const webPackVarKeys = Object.keys(Vars);
    webPackVarKeys.map( (wKey, wIndex) => {
        webPackVarStr = webPackVarStr +`const ${wKey} = "${Vars[wKey]}";\n`
    })

    const webPackConcat = webPackVarStr + '\n' + webPackConfigStrWrap;
    
    fs.writeFileSync(mergeFile, webPackConcat, 'utf-8');
    const mergeData = fs.readFileSync(mergeFile, "utf-8")
            .replace(/"@(\/\\)(\\)(\S*)"/g, "$1$3")
            .replace(/"@(\/\S*)"/g, "$1")     // 处理"@/node_modules/"
            .replace(/"<%/g, '')
            .replace(/%>"/g, '');
    fs.writeFileSync(mergeFile, mergeData, 'utf-8');
    return true;
}

module.exports = writeFile;
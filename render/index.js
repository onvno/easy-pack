const ipc = require('electron').ipcMain
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path')
const url = require('url')
const merge = require('webpack-merge');
const Redux = require('redux');

const Util = require('./utils.js');
const {reducers, TYPES} = require('./reducer.js');
const {
    createStore,
    combineReducers,
    bindActionCreators,
    applyMiddleware,
    compose
} = Redux;
const store = createStore(reducers);

function rendering() {
    console.log(store.getState())
};
store.subscribe(rendering)
store.dispatch({ 
    type: TYPES.update,
    payload: {
        packages: 1
    }
})

const EasyRoot = process.cwd(); //运行环境根目录
let ProjectDir; //输出项目目录

ipc.on('custom', function (event, arg) {
    const {
        dirSelect, // 项目目录
        project, // 项目名称
        opt, // 编译文件类型
        plug, // 插件
        dll, // dll
        global, // 全局变量
    } = arg;


    /**
     * 赋值全局常量
     */
    ProjectPath = path.resolve(dirSelect, project)


    /**
     * 创建项目目录
     */
    if(Util.fsExistsSync(ProjectPath)){
        event.sender.send('customReply', '当前目录项目已存在，请重新创建');
        return 
    }
    fse.ensureDirSync(ProjectPath);
  

    /**
     * 拷贝静态资源 & server.js & 全局变量
     */
    const copyDirPath = path.resolve(EasyRoot, 'copyDir');
    fse.copySync(copyDirPath, ProjectPath);
    fse.copySync(
        path.resolve(EasyRoot, 'server/server.js'),
        path.resolve(ProjectPath, 'bin/server.js')
    );

    if(global) {
        const globalPath = path.resolve(ProjectPath, 'bin/constant.json');
        fs.writeFileSync(globalPath, JSON.stringify(global, null, 4), 'utf-8');
    }
  

  /**
   * 合并js / json并生成文件
   */
  const basePath = path.resolve(EasyRoot, "modules");
  const plugBasePath = path.resolve(EasyRoot, "plugins");
  const mergeFile = path.resolve(ProjectPath, './config/webpack.config.js');
  const mergeJsonFile = path.resolve(ProjectPath, 'package.json');

  const baseVarConfig = require(path.resolve(EasyRoot, './base/dev.config'));
  const baseVar = baseVarConfig.var;
  const baseConfig = baseVarConfig.config;
  const baseJSON = require(path.resolve(EasyRoot,'./base/package'));

  let webpackVar = baseVar;
  let webPackConfig = baseConfig;
  let packageJSON = baseJSON;

  // 处理rule
  opt.map((part, index) => {
    const partPath = path.resolve(basePath, part, 'config.js')
    const jsonPath = path.resolve(basePath, part, 'package');
    const partVarConfig = require(partPath);
    // console.log("partPath:", partPath);

    const partVar = partVarConfig.var;
    webpackVar = merge(webpackVar, partVar);

    const partConfig = partVarConfig.config;
    webPackConfig = merge(webPackConfig, partConfig)

    const partJSON = require(jsonPath);
    packageJSON = merge(packageJSON, partJSON);
  })

  // 处理plug
  plug.map((part, index) => {
    const partPath = path.resolve(plugBasePath, part, 'config.js');
    const jsonPath = path.resolve(plugBasePath, part, 'package');
    const partVarConfig = require(partPath);
    
    const partVar = partVarConfig.var;
    webpackVar = merge(webpackVar, partVar);

    const partConfig = partVarConfig.config;
    webPackConfig = merge(webPackConfig, partConfig)

    const partJSON = require(jsonPath);
    packageJSON = merge(packageJSON, partJSON);
  })



  // 文件写入 -webpack
  // let webPackVarStr = "";
  // const webPackVarKeys = Object.keys(webpackVar);
  // webPackVarKeys.map( (wKey, wIndex) => {
  //   webPackVarStr = webPackVarStr +`const ${wKey} = "${webpackVar[wKey]}";\n`
  // })
  // const webPackConfigStr = JSON.stringify(webPackConfig, Util.newReplace, 4);
  // const webPackConfigStrWrap = `const configs = ` + webPackConfigStr;
  // const webPackConcat = webPackVarStr + '\n' + webPackConfigStrWrap;
  // fs.writeFileSync(mergeFile, webPackConcat, 'utf-8');
  // const mergeData = fs.readFileSync(mergeFile, "utf-8")
  //         .replace(/"@(\/\\)(\\)(\S*)"/g, "$1$3")
  //         .replace(/"@(\/\S*)"/g, "$1")     // 处理"@/node_modules/"
  //         .replace(/"<%/g, '')
  //         .replace(/%>"/g, '');
  // fs.writeFileSync(mergeFile, mergeData, 'utf-8');

  // 文件写入 - json
  // const JSONStr = JSON.stringify(packageJSON, null, 4);
  // fs.writeFileSync(mergeJsonFile, JSONStr, 'utf-8');



  // 如dll不存在则上边结束，写入文件， 如dll存在，则执行以下
  const Mustache = require('mustache');
  const dllTempPath = path.resolve(EasyRoot, './split/dll/webpack.dll.temp')
  // console.log('dllTempPath:', dllTempPath);
  const dllTempData = fs.readFileSync(dllTempPath, 'utf-8');
  // console.log("dllTempData:", dllTempData);
  const dllConfigPath = path.resolve(ProjectPath, './config/webpack.dll.js');
  const renderData = Mustache.render(dllTempData, dll);
  fs.writeFileSync(dllConfigPath, renderData, 'utf-8');
  // console.log("m:", mustache);
  //baseAry frameAry
  

  const latestVersion = require('latest-version');
  const dllPackage = dll.baseAry.concat(dll.frameAry);
  let packObj = {};
  const getVersion = async (package) => {
    const version = await latestVersion(package)
    packObj[package] = `^${version}`;
    return `^${version}`;
  }
  let promises = dllPackage.map((pack) => getVersion(pack))
  Promise.all(promises)
      .then((data) => {
          const dllPackageDepend = {
            "dependencies": packObj
          }
          packageJSON = merge(packageJSON, dllPackageDepend);
          const dllEntryConfigPath = path.resolve(EasyRoot, './split/dll/config.js')
          const dllEntryConfig = require(dllEntryConfigPath);
          webPackConfig = merge(webPackConfig, dllEntryConfig);
          
          // 写入文件 - json
          const JSONStr = JSON.stringify(packageJSON, null, 4);
          fs.writeFileSync(mergeJsonFile, JSONStr, 'utf-8');

          // 写入文件 - webpack
          const partVar = dllEntryConfig.var;
          webpackVar = merge(webpackVar, partVar);
          const partConfig = dllEntryConfig.config;
          webPackConfig = merge(webPackConfig, partConfig)
          const webPackConfigStr = JSON.stringify(webPackConfig, Util.newReplace, 4);
          const webPackConfigStrWrap = `const configs = ` + webPackConfigStr;

          let webPackVarStr = "";
          const webPackVarKeys = Object.keys(webpackVar);
          webPackVarKeys.map( (wKey, wIndex) => {
            webPackVarStr = webPackVarStr +`const ${wKey} = "${webpackVar[wKey]}";\n`
          })

          const webPackConcat = webPackVarStr + '\n' + webPackConfigStrWrap;
          fs.writeFileSync(mergeFile, webPackConcat, 'utf-8');
          const mergeData = fs.readFileSync(mergeFile, "utf-8")
                  .replace(/"@(\/\\)(\\)(\S*)"/g, "$1$3")
                  .replace(/"@(\/\S*)"/g, "$1")     // 处理"@/node_modules/"
                  .replace(/"<%/g, '')
                  .replace(/%>"/g, '');
          fs.writeFileSync(mergeFile, mergeData, 'utf-8');

      })
      .catch((err) => {
          console.log("err:", err);
      })

  event.sender.send('customReply', '创建完成');
})
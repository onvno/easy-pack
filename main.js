const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ROOTPATH = __dirname;

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 650})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 测试请求
  const {net} = require('electron')
  const request = net.request('https://github.com')
  request.on('response', (response) => {
      // console.log(`STATUS: ${response.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
      response.on('data', (chunk) => {
          // console.log(`BODY: ${chunk}`)
      })
      response.on('end', () => {
          // console.log('No more data in response.')
      })
  })
  request.end()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require('electron').ipcMain
const fse = require('fs-extra');
const fs = require('fs');
const merge = require('webpack-merge');

/**
 * 判断路径是否存在
 * @param {String} path 
 */
function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

/**
 * 正则替换 
 * @param {*} key 
 * @param {*} value 
 */
function newReplace(key, value) {
  if (value instanceof RegExp){
      // console.log(value.toString().slice(1,-1));
      // console.log(value.toString());
      // console.log("@" + value.toString());
      return ("@" + value.toString());
  }
  else
      return value;
}

ipc.on('custom', function (event, arg) {
  // 返回arg对象后台处理
  const dir = arg.dirSelect;
  const pro = arg.project;
  const {opt, plug, dll, global} = arg;
  const dirPath = path.resolve(dir, pro);
  

  if(fsExistsSync(dirPath)){
    event.sender.send('customReply', '已存在，请重新输入');
    return 
  }

  event.sender.send('customReply', '正在生成中');
  fse.ensureDirSync(dirPath);
  
  /**
   * 拷贝目录
   */
  const tempDirPath = path.resolve(__dirname, 'dir')
  fse.copySync(tempDirPath, dirPath);

  const serverPath = path.resolve(__dirname, 'server/server.js');
  const serverProPath = path.resolve(dirPath, 'bin/server.js');
  fse.copySync(serverPath, serverProPath)

  /**
   * 生成全局变量 - 缺判断
   */
  if(global) {
    const globalPath = path.resolve(dirPath, 'bin/constant.json');
    fs.writeFileSync(globalPath, JSON.stringify(global, null, 4), 'utf-8');
  }
  

  /**
   * 合并js / json并生成文件
   */
  const basePath = path.resolve(__dirname, "modules");
  const plugBasePath = path.resolve(__dirname, "plugins");
  const mergeFile = path.resolve(dirPath, './config/webpack.config.js');
  const mergeJsonFile = path.resolve(dirPath, 'package.json');

  const baseVarConfig = require('./base/dev.config')
  const baseVar = baseVarConfig.var;
  const baseConfig = baseVarConfig.config;
  const baseJSON = require('./base/package');

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
  // const webPackConfigStr = JSON.stringify(webPackConfig, newReplace, 4);
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
  const dllTempPath = path.resolve(__dirname, './split/dll/webpack.dll.temp')
  // console.log('dllTempPath:', dllTempPath);
  const dllTempData = fs.readFileSync(dllTempPath, 'utf-8');
  // console.log("dllTempData:", dllTempData);
  const dllConfigPath = path.resolve(dirPath, './config/webpack.dll.js');
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
          const dllEntryConfigPath = path.resolve(__dirname, './split/dll/config.js')
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
          const webPackConfigStr = JSON.stringify(webPackConfig, newReplace, 4);
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
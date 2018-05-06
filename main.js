const electron = require('electron');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ROOTPATH = __dirname;

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
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

function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

ipc.on('custom', function (event, arg) {
  // 返回arg对象后台处理
  const dir = arg.dirSelect;
  const pro = arg.project;
  const {opt} = arg;
  const dirPath = path.resolve(dir, pro);
  

  if(fsExistsSync(dirPath)){
    event.sender.send('customReply', '已存在，请重新输入');
  } else {
    event.sender.send('customReply', '正在生成中');
    fse.ensureDirSync(dirPath);
    
    /**
     * 合并json并生成文件
     */
    const basePath = path.resolve(__dirname, "modules");
    const mergeFile = path.resolve(dirPath, 'webpack.config.js');
    let webPackConfig = {};

    opt.map((part, index) => {
      const partPath = path.resolve(basePath, part, 'config.js')
      const partConfig = require('./modules/less/config.js');
      webPackConfig = merge(webPackConfig, partConfig)
    })

    const webPackStr = JSON.stringify(webPackConfig, null, 4);
    fs.writeFileSync(mergeFile, webPackStr, 'utf-8');
    event.sender.send('customReply', '创建完成');
  }
  
})
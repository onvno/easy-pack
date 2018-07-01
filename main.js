const electron = require('electron');
const { app, protocol, BrowserWindow } = electron;

const path = require('path')
const url = require('url')
const ROOTPATH = __dirname;


// 更新提醒
const updater = require('electron-simple-updater');
updater.init({
  checkUpdateOnStart: false,
  autoDownload: false,
});

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 812})
  // mainWindow = new BrowserWindow({
  //   width: 350,
  //   height: 812,
  //   resizable:false,
  //   fullscreenable:false
  // })
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 开启调试
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // 测试请求
  // const {net} = require('electron')
  // const request = net.request('https://github.com')
  // request.on('response', (response) => {
  //     response.on('data', (chunk) => {
  //         // console.log(`BODY: ${chunk}`)
  //     })
  //     response.on('end', () => {
  //         // console.log('No more data in response.')
  //     })
  // })
  // request.end()
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

// console.log("path:", app.getAppPath())
process.env['APP_PATH'] = app.getAppPath();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./process/index.js')
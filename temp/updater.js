// 来自
// updater.js
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
let updater
// 禁用自动下载，给用户选择余地
autoUpdater.autoDownload = false
autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error)
})
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    } else {
      updater.enabled = true
      updater = null
    }
  })
})
autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates', 
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})
// 下载完成时，提醒用户
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    autoUpdater.quitAndInstall()
  })
})
// 将这个回调输出给更新功能所在的菜单项的 click 回调
function checkForUpdates (menuItem, focusedWindow, event) {
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates
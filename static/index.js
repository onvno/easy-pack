// 1.选择文件夹
// 2.传递webpack参数
// 3.收到参数合并文件
// 4.输出文件到指定文件夹



// 选择目录
const electron = require('electron');
const { buildDir, devDllDir } = require('./constant.js');
const { shell, ipcRenderer } = electron;
const { dialog } = electron.remote;
const os = require('os')

const exLinksBtn = document.getElementById('open-ex-links')


// 处理链接
const links = document.querySelectorAll('a[href]')
Array.prototype.forEach.call(links, function (link) {
  const url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})

// 打开目录dir
const fileManagerBtn = document.getElementById('dir')
fileManagerBtn.addEventListener('click', function (event) {
  shell.showItemInFolder(os.homedir())
})

// 保存目录dir
const dirSelect = document.getElementById('dirSelect');
dirSelect.addEventListener('click', (e) => {
    dialog.showOpenDialog( { 
        properties: [ 'openDirectory' ],
        message: "请选择创建项目的目录"
    }, ( path ) => {
        // console.log("path:", path);
        dirSelect.value = path[0];
    } )
})

// 数据传递
const btn = document.getElementById("submit");
submit.addEventListener('click', (e) => {
    e.stopPropagation();
    let res = {};
    let opt = [];
    let plug = [];

    // 目录
    const dirDom = document.getElementById('dirSelect');
    res.dirSelect = dirDom.value;

    // 项目名
    const projectDom = document.getElementById('project');
    res.project = projectDom.value;

    // rules集合
    const optDoms = document.querySelectorAll('.opt');
    for(let i=0; i<optDoms.length; i++) {
        if(optDoms[i].checked === true) {
            opt.push(optDoms[i].value)
        }
    }
    res.opt = opt;

    // 插件集合
    const plugDoms = document.querySelectorAll('.plug');
    for(let j=0; j<plugDoms.length; j++) {
        if(plugDoms[j].checked === true) {
            plug.push(plugDoms[j].value)
        }
    }
    res.plug = plug

    // dll相关
    const dllStatus = document.querySelector('.dll').checked;
    const baseAryDom = document.getElementById('baseAry');
    baseAry = baseAryDom.value.split(',');

    const frameAryDom = document.getElementById('frameAry');
    frameAry = frameAryDom.value.split(',');


    res.dll = {
        dllStatus,
        baseAry,
        frameAry,
        buildDir,
        devDllDir,
    }

    // 服务器配置相关
    const mockStatus = document.getElementById('mock').checked;
    const proxyStatus = document.getElementById('proxy').checked;
    const global = {
        mock: mockStatus,
        proxy: proxyStatus,
        buildDir,
        devDllDir
    }
    res.global = global;


    ipcRenderer.send('custom', res)
})

ipcRenderer.on('customReply', function (event, arg) {
    const message = `异步消息回复: ${arg}`
    document.getElementById('reply').innerHTML = message
})

// 1.选择文件夹
// 2.传递webpack参数
// 3.收到参数合并文件
// 4.输出文件到指定文件夹



// 选择目录
const electron = require('electron');
const { shell, ipcRenderer } = electron;
const { dialog } = electron.remote;
const os = require('os')

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

    const dirDom = document.getElementById('dirSelect');
    res.dirSelect = dirDom.value;

    const projectDom = document.getElementById('project');
    res.project = projectDom.value;

    const optDoms = document.querySelectorAll('.opt');
    for(let i=0; i<optDoms.length; i++) {
        if(optDoms[i].checked === true) {
            opt.push(optDoms[i].value)
        }
    }
    res.opt = opt;

    ipcRenderer.send('custom', res)
})

ipcRenderer.on('customReply', function (event, arg) {
    const message = `异步消息回复: ${arg}`
    document.getElementById('reply').innerHTML = message
})

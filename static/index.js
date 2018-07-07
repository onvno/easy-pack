// 1.选择文件夹
// 2.传递webpack参数
// 3.收到参数合并文件
// 4.输出文件到指定文件夹
// 5 更新提醒

const tabWrap = document.getElementById('tabWrap');
tabWrap.addEventListener('click', (e) => {
    const tabLikeAry = document.querySelectorAll('#tabWrap li');
    const tabAry = Array.prototype.slice.call(tabLikeAry);
    const index = tabAry.indexOf(e.target.parentNode);
    const contLikeAry = document.querySelectorAll('.switch');
    const epackAry = document.querySelectorAll('.epack');
    // const index = e.target.parent
    
    // outer wrap
    if(index === 2){
        // gulp
        epackAry[0].classList.add('wrap_hide');
        epackAry[1].classList.remove('wrap_hide');
        tabAry[2].classList.add('active');
        
        tabAry[0].classList.remove('active');
        tabAry[1].classList.remove('active');
    } else if(index >= 0) {
        // webpack
        epackAry[0].classList.remove('wrap_hide');
        epackAry[1].classList.add('wrap_hide');
        tabAry[2].classList.remove('active');

        // webpack3 & 4 切换
        for(var i=0; i<tabAry.length-1; i++) {
            if(i !== index){ 
                tabAry[i].classList.remove('active') 
                contLikeAry[i].classList.add('hide');
            } else {
                tabAry[i].classList.add('active')
                contLikeAry[i].classList.remove('hide');
            }
        }
    }
})


// 选择目录
const electron = require('electron');
const { buildDir, devDllDir } = require('./constant.js');
const { shell, ipcRenderer } = electron;
const { dialog } = electron.remote;
const os = require('os')
const Util = require('../process/utils.js');

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


// 处理dll可编辑与否
const dllDOM = document.querySelector('.dll');
dllDOM.addEventListener('click', (e) => {
    const checkStatus = e.target.checked;
    const baseAryDOM = document.getElementById('baseAry');
    const frameAry = document.getElementById('frameAry');

    // console.log("checkStatus:", checkStatus);

    if(checkStatus){
        baseAryDOM.disabled = false;
        frameAry.disabled = false;
    } else {
        baseAryDOM.disabled = true;
        frameAry.disabled = true;
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
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let res = {};
    let opt = [];
    let plug = [];
    let style = [];
    let js = [];

    // webpack版本
    let webpackVersion = document.querySelector('#tabWrap li.active a').dataset.version;
    res.webpackVersion = webpackVersion;

    // cachegroup
    const cacheGroupStatus = document.querySelector('.cachegroup').checked;
    res.cacheGroupStatus = cacheGroupStatus;


    // dll相关
    const dllStatus = document.querySelector('.dll').checked;
    const baseAryDom = document.getElementById('baseAry');
    baseAry = Util.arrayTrim(baseAryDom.value.split(','));

    const frameAryDom = document.getElementById('frameAry');
    frameAry = Util.arrayTrim(frameAryDom.value.split(','));

    if(dllStatus && (baseAry.length === 0 || frameAry.length === 0)){
        ipcRenderer.send('open-error-dialog');
        return;
    }
    res.dll = {
        dllStatus,
        baseAry,
        frameAry,
        buildDir,
        devDllDir,
    }

    // 目录
    const dirDom = document.getElementById('dirSelect');
    res.dirSelect = dirDom.value;

    // 项目名
    const projectDom = document.getElementById('project');
    res.project = projectDom.value;

    // style集合
    const styleDom = document.querySelectorAll('.style');
    for(let sd=0; sd<styleDom.length; sd++) {
        if(styleDom[sd].checked === true) {
            style.push(styleDom[sd].value)
        }
    }
    res.style = style;

    
    // js集合
    const jsDom = document.querySelectorAll('.jsdom');
    for(let jd=0; jd<jsDom.length; jd++) {
        if(jsDom[jd].checked === true) {
            js.push(jsDom[jd].value)
        }
    }
    res.js = js;


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


    // send消息 & loading
    const replayDOM = document.getElementById('reply');
    const loaderDOM = document.getElementById('loading');
    replayDOM.classList.remove('show');
    replayDOM.classList.add('hide');
    loaderDOM.classList.remove('hide');
    loaderDOM.classList.add('show');

    ipcRenderer.send('custom', res);
    

})

ipcRenderer.on('customReply', function (event, arg) {
    const message = `结果: ${arg}`

    const replayDOM = document.getElementById('reply');
    const loaderDOM = document.getElementById('loading');
    replayDOM.innerHTML = message;
    setTimeout(()=>{
        replayDOM.classList.remove('hide');
        replayDOM.classList.add('show');
        loaderDOM.classList.remove('show');
        loaderDOM.classList.add('hide');
        setTimeout(() => {
            replayDOM.innerHTML = '继续对自己好一点，Easy Pack !'
        }, 5000);
    }, 1000)
})



// 更新提醒
const { remote } = require('electron');
const packageFile = require('../package.json');
const updater = remote.require('electron-simple-updater');
let newVersion = '';

updater.on('update-available', (meta) => {
    newVersion = meta.version;
    // console.log('可更新版本:', meta.version);
    // dialog.showErrorBox('更新提醒', `可从QQ交流群下载最新版本${meta.version}`)
    document.querySelector('#easy-tit span').classList.add('show');
    document.querySelector('#easy-tit').classList.add('cursor');
});
updater.on('update-not-available', () => {
    document.querySelector('#easy-tit span').classList.remove('show');
    document.querySelector('#easy-tit').classList.remove('cursor');
})
updater.on('error', (err) => {"错误提醒:", err});
updater.checkForUpdates();

document.getElementById('easy-tit').addEventListener('click', ()=>{
    const hasShow = document.querySelector('#easy-tit span').classList.contains('show');
    if(hasShow) {
        dialog.showErrorBox('更新提醒', `当前版本: v${packageFile.version}\n可从QQ交流群下载最新版本 ${newVersion}`);
    }
})


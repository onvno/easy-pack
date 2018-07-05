// 以下为Gulp
const electron = require('electron');
const { dialog } = electron.remote;
const { shell, ipcRenderer } = electron;
const { buildDir, devDllDir } = require('./constant.js');

// 保存目录dir
const gulpDirSelect = document.getElementById('gulpDirSelect');
gulpDirSelect.addEventListener('click', (e) => {
    dialog.showOpenDialog( { 
        properties: [ 'openDirectory' ],
        message: "请选择创建项目的目录"
    }, ( path ) => {
        // console.log("path:", path);
        gulpDirSelect.value = path[0];
    } )
})

// 数据传递
const submitGulp = document.getElementById("gulpSubmit");
submitGulp.addEventListener('click', (e) => {
    e.stopPropagation();
    let res = {};
    let plug = [];
    let style = '';
    let js = [];
    let template = [];

    // 目录
    const dirDom = document.getElementById('gulpDirSelect');
    res.dirSelect = dirDom.value;

    // 项目名
    const projectDom = document.getElementById('gulpProject');
    res.project = projectDom.value;

    // style集合
    const radios = document.getElementsByName("styleSelect");
	for (ri=0; ri<radios.length; ri++) {
		if (radios[ri].checked) {
            style = radios[ri].value
            break;
		}
    }
    res.style = style

    
    // js集合
    const jsDom = document.querySelectorAll('.gulpJs');
    for(let jd=0; jd<jsDom.length; jd++) {
        if(jsDom[jd].checked === true) {
            js.push(jsDom[jd].value)
        }
    }
    res.js = js;


    // template集合
    const optDoms = document.querySelectorAll('.gulpTemp');
    for(let i=0; i<optDoms.length; i++) {
        if(optDoms[i].checked === true) {
            template.push(optDoms[i].value)
        }
    }
    res.template = template;


    // 服务器配置相关
    const mockStatus = false;
    const proxyStatus = document.getElementById('gulpProxy').checked;
    const browserStatus = document.getElementById('gulpBrwoser').checked;
    const global = {
        mock: mockStatus,
        proxy: proxyStatus,
        browser: browserStatus,
        buildDir,
        devDllDir
    }
    res.global = global;


    // send消息 & loading
    const replayDOM = document.getElementById('gulpReply');
    const loaderDOM = document.getElementById('gulpLoading');
    replayDOM.classList.remove('show');
    replayDOM.classList.add('hide');
    loaderDOM.classList.remove('hide');
    loaderDOM.classList.add('show');

    ipcRenderer.send('gulp', res);
})
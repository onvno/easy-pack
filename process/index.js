const ipc = require('electron').ipcMain
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path')
const url = require('url')
const merge = require('webpack-merge');
const Redux = require('redux');

const baseRender = require('./render/base.js');
const moduleRender = require('./render/modules.js');
const dllRender = require('./render/dll.js');
const writeFile = require('./write.js');

const aa = require('./render/base.js');
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
const {getState, dispatch, subscribe} = store;

// console.log(Object.keys(getState().Configs.plugins.length))
function rendering() {
    if(getState().Configs.plugins){
        // console.log(getState().Configs.plugins.length)
    }
};
subscribe(rendering)

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
    const copyDirPath = path.resolve(EasyRoot, './process/copy');
    fse.copySync(copyDirPath, ProjectPath);
    fse.copySync(
        path.resolve(EasyRoot, 'server/server.js'),
        path.resolve(ProjectPath, 'bin/server.js')
    );

    if(global) {
        const globalPath = path.resolve(ProjectPath, 'config/constant.json');
        fs.writeFileSync(globalPath, JSON.stringify(global, null, 4), 'utf-8');
    }

    /**
     * 基本配置
     */
    baseRender(dispatch);

    /**
     * opt - 类型处理
     */
    opt.map(part => {
        moduleRender("modules", getState(), part, dispatch);
    })

    /**
     * plugin
     */
    plug.map(part => {
        moduleRender("plugins", getState(), part, dispatch);
    })

    /**
     * dll处理
     */
    if(dll) {
        // 模块render
        moduleRender("", getState(), "dll", dispatch);
        const dllDataAry = dll.baseAry.concat(dll.frameAry);
        if(dllDataAry.length){
            dllDataAry.map(part => {
                dllRender(getState(), part, dispatch);
            })
        }

        // webpack.dll.js 文件写入
        const handleDLLCopy = () => {
            const Mustache = require('mustache');
            const dllTempPath = path.resolve(EasyRoot, './process/pack/dll/webpack.dll.temp')
            const dllTempData = fs.readFileSync(dllTempPath, 'utf-8');
            const dllConfigPath = path.resolve(ProjectPath, './config/webpack.dll.js');
            const renderData = Mustache.render(dllTempData, dll);
            fs.writeFileSync(dllConfigPath, renderData, 'utf-8');
        }
        handleDLLCopy()
    }

    /**
     * 整体文件写入
     */
    const writeRes = writeFile(getState(), ProjectPath, dispatch)
    
    if(writeRes) {
        event.sender.send('customReply', '创建完成');
    }
})
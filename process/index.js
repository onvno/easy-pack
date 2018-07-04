const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
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
const CONST = require('./constant.js');
const beautify = require('js-beautify').js_beautify;

const gulpRender = require('./gulp/render/config.js');

// console.log(process.env['APP_PATH']);

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

const EasyRoot = process.env['APP_PATH'];
let ProjectDir; //输出项目目录

/**
 * 错误处理
 */
ipc.on('open-error-dialog', function (event) {
    dialog.showErrorBox('出错了', '开启DLL的情况,需要填写至少一个依赖')
})

// webpack
ipc.on('custom', function (event, arg) {

    const {
        dirSelect, // 项目目录
        project, // 项目名称
        style, //样式相关
        js, //js相关
        opt, // 编译文件类型
        plug, // 插件
        dll, // dll
        global, // 全局变量
        webpackVersion, // webpack版本
        cacheGroupStatus, // webpack4的三方包策略
    } = arg;


    /**
     * 赋值全局常量
     */
    ProjectPath = path.resolve(dirSelect, project)

    /**
     * 创建项目目录
     */
    if(fs.existsSync(ProjectPath)){
        event.sender.send('customReply', '项目已存在，请重新输入目录');
        return 
    }
    fse.ensureDirSync(ProjectPath);
  

    /**
     * 拷贝静态资源 & server.js & 全局变量 & packjson写入
     */
    const copyDirPath = path.resolve(EasyRoot, './process/copy');
    fse.copySync(copyDirPath, ProjectPath);
    fse.copySync(
        path.resolve(EasyRoot, 'server/server.js'),
        path.resolve(ProjectPath, 'bin/server.js')
    );
    const serverPackJSON = require(path.resolve(EasyRoot,`server/package.json`));
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: serverPackJSON
        }
    })

    if(global) {
        const globalPath = path.resolve(ProjectPath, 'config/constant.json');
        fs.writeFileSync(globalPath, JSON.stringify(global, null, 4), 'utf-8');
    }

    /**
     * 拷贝demo
     */
    const demoDirPath = path.resolve(EasyRoot, './process/demo');
    if(opt.includes('react')) {
        fse.copySync(
            path.resolve(demoDirPath, 'react'),
            path.resolve(ProjectPath, 'src')
        )
    }
    else if(opt.includes('vue')) {
        fse.copySync(
            path.resolve(demoDirPath, 'vue'),
            path.resolve(ProjectPath, 'src')
        )
    }
    else {
        fse.copySync(
            path.resolve(demoDirPath, 'es6'),
            path.resolve(ProjectPath, 'src')
        )
    }

    /**
     * 基本配置
     */
    baseRender(dispatch, getState(), webpackVersion);


    /**
     * style - 样式处理 & 拷贝postcss.config
     */
    if(style.includes('postcss')){
        fse.copySync(
            path.resolve(EasyRoot, 'process', webpackVersion, 'style/postcss.config.js'),
            path.resolve(ProjectPath, 'postcss.config.js')
        );
    }
    const handleStyle = (styleAry) => {
        let styleParseAry;
        if(styleAry.includes('postcss')){
            styleAry.splice(styleAry.indexOf('postcss'), 1);
            styleParseAry = styleAry.map((item) => {
                return item + '-post';
            })
        } else {
            styleParseAry = styleAry;
        }

        styleParseAry.map((part) => {
            moduleRender("style", getState(), part, dispatch, webpackVersion);
        })

    }
    handleStyle(style);


    /**
     * js - js处理
     */
    const handleJS = (jsAry) => {
        let jsParseAry;

        // 拷贝ts配置文件
        if(jsAry.includes('ts')) {
            const tsConfigPath = path.resolve(EasyRoot, 'process', webpackVersion, 'js/ts/tsconfig.json');
            const copyTsConfigPath = path.resolve(ProjectPath, './tsconfig.json');
            fse.copySync(tsConfigPath, copyTsConfigPath);
        }

        if(jsAry.includes('cache')){
            jsAry.splice(jsAry.indexOf('cache'), 1);
            jsParseAry = jsAry.map((item) => {
                return item + '-cache'
            })
        } else {
            jsParseAry = jsAry;
        }

        jsParseAry.map((part) => {
            moduleRender("js", getState(), part, dispatch, webpackVersion);
        })
    }
    handleJS(js);


    /**
     * opt - 类型处理
     */
    opt.map(part => {
        moduleRender("modules", getState(), part, dispatch, webpackVersion);
        if(part === 'react') {
            const babelrcPath = path.resolve(EasyRoot, 'process', webpackVersion, 'modules/react/.babelrc');
            const copyBabelrcPath = path.resolve(ProjectPath, './.babelrc');
            fse.copySync(babelrcPath, copyBabelrcPath);
        }
    })


    /**
     * plugin
     */
    plug.map(part => {
        moduleRender("plugins", getState(), part, dispatch, webpackVersion);
    })

    /**
     * dll处理 - 暂时只对webpack3开发
     */
    if(webpackVersion === CONST.webpackDLL.version && dll.dllStatus) {
        // 模块render
        moduleRender("", getState(), "dll", dispatch, webpackVersion);
        const dllDataAry = dll.baseAry.concat(dll.frameAry);
        if(dllDataAry.length){
            dllDataAry.map(part => {
                dllRender(getState(), part, dispatch);
            })
        }

        // webpack.dll.js 文件写入
        const handleDLLCopy = () => {
            const Mustache = require('mustache');
            const dllTempPath = path.resolve(
                EasyRoot, 'process', webpackVersion, 'dll/webpack.dll.temp');
            const dllTempData = fs.readFileSync(dllTempPath, 'utf-8');
            const dllConfigPath = path.resolve(ProjectPath, './config/webpack.dll.js');
            const renderData = Mustache.render(dllTempData, dll);
            fs.writeFileSync(dllConfigPath, renderData, 'utf-8');
        }
        handleDLLCopy()
    }

    /**
     * cacheGroup = 支持webpack4
     */
    if(webpackVersion === CONST.webpackCacheGroup.version && cacheGroupStatus == true) {
        moduleRender("", getState(), "cachegroup", dispatch, webpackVersion);
    }

    /**
     * 整体文件写入
     */
    const writeRes = writeFile(getState(), ProjectPath, dispatch)
    
    if(writeRes) {
        event.sender.send('customReply', '创建完成');
    }
})

// gulp
ipc.on('gulp', function (event, arg) {
    // console.log("arg:", arg);

    const {
        dirSelect, // 项目目录
        project, // 项目名称
        style, //样式相关
        js, //js相关
        global, // 全局变量
        template, //模板
    } = arg;
    // console.log("arg.global:", arg.global);
    

    /**
     * 赋值全局常量
     */
    const ProjectPath = path.resolve(dirSelect, project)
    // console.log("dirSelect:", dirSelect, '\nproject:', project);

    /**
     * 创建项目目录
     */
    if(fs.existsSync(ProjectPath)){
        event.sender.send('gulpReply', '项目已存在，请重新输入目录');
        return 
    }
    fse.ensureDirSync(ProjectPath);

    /**
     * 拷贝静态资源 & server.js & 全局变量 & packjson写入
     */
    const copyDirPath = path.resolve(EasyRoot, './process/gulp/copy');
    fse.copySync(copyDirPath, ProjectPath);

    // base
    gulpRender(getState(), 'base', dispatch);

    // css
    gulpRender(getState(), 'less', dispatch);

    // js
    gulpRender(getState(), 'js', dispatch);

    // img
    gulpRender(getState(), 'img', dispatch);

    // 浏览器
    gulpRender(getState(), 'browser', dispatch);

    // 获取状态写入文件
    const {gPackages, gVars, gConfigs} = getState();
    const gulpFilePath = path.resolve(ProjectPath, 'gulpfile.js');
    
    // 写入gulpfile.js
    let gConfigVarStr = "";
    let webPackVarStr = "";
    const webPackVarKeys = Object.keys(gVars);

    webPackVarKeys.map( (wKey, wIndex) => {
        webPackVarStr = webPackVarStr +`const ${wKey} = "${gVars[wKey]}";\n`
    })

    const gVarStr = webPackVarStr.replace(/"<%/g, '').replace(/%>"/g, '').replace('PROXYSTATUS', arg.global.proxy);
    
    let gConfigStr = "";
    Object.keys(gConfigs).map( (key, index) => {
        gConfigStr = gConfigStr + `${gConfigs[key]}\n`;
    })
    gConfigVarStr = gVarStr + '\n' + gConfigStr;

    const writeRes = fse.writeFileSync(gulpFilePath, gConfigVarStr, 'utf-8');
    const gulpFilePathData = fse.readFileSync(gulpFilePath, "utf-8");
    const beautifyData = beautify(
        gulpFilePathData, { 
        indent_size: 4,
        break_chained_methods: true
    });
    fse.writeFileSync(gulpFilePath, beautifyData, 'utf-8');

    // 写入package.json
    const gulpPackJSON = path.resolve(ProjectPath, 'package.json');
    const JSONStr = JSON.stringify(gPackages, null, 4);
    const writeJSON = fse.writeFileSync(gulpPackJSON, JSONStr, 'utf-8')

    // 清空状态
    dispatch({
        type: TYPES.update,
        payload: {
            Packages: {},
            Vars: {},
            Configs: {},
            VarsProd: {},
            ConfigsProd: {},

            gPackages: {},
            gVars: {},
            gConfigs: {}
        }
    })
    
    if(writeRes && writeJSON) {
        event.sender.send('gulpReply', '创建完成');
    }
})



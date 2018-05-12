const chalk = require("chalk");
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../config/webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require("http-proxy-middleware");
// const history = require('connect-history-api-fallback');

const CONST = require('./constant.json');

const app = express();
const compiler = webpack(config);
const router = express.Router();

// app.use(history());

app.use(webpackDevMiddleware(compiler, {
    noInfo: true, //false将打印编译信息（建议true，false会打印很多信息）
    publicPath: config.output.publicPath //绑定middleware
}));

app.use(webpackHotMiddleware(compiler));


// 处理dll
app.get(/ui.js$/, (req, res) => {
    res.sendFile(`${config.output.path}/ui.js`);
});
app.get(/frame.js$/, (req, res) => {
    res.sendFile(`${config.output.path}/frame.js`);
});
app.get(/base.js$/, (req, res) => {
    res.sendFile(`${config.output.path}/base.js`);
});


// 处理代理
if(CONST.proxy) {
    const proxyConfig = require('../config/server.proxy');
    proxyConfig.forEach(function (element) {
        if (element.enable) {//代理开启
            //默认配置项
            let proxyOpt = {
            target: element.url,
            logLevel: "debug",
            changeOrigin: true,
            headers: (typeof element.headers !== 'undefined' ? element.headers : {}),
            onProxyRes: function (proxyRes) {
                proxyRes.headers["Proxy-Server"] = "true";
            }
            }
            app.use(element.router, proxy(proxyOpt));
            console.log(chalk.green(`[proxy] : ${element.router} to ${element.url}`));
        }
    });
}


// 处理mock
if(CONST.mock) {
    const mockConfig = require('../config/server.mock');
    for (let item in mockConfig) {
        for (let i = 0; i < mockConfig[item].length; i++) {
            for (let url in mockConfig[item][i]) {
            console.log(chalk.green(`[mock]:[${url}] to ${mockConfig[item][i][url]}`));
            router.all(url, function (req, res, next) {
                console.log(chalk.green(`[mock]: ${req.method} ${req.ip} client router [${url}]-[${mockConfig[item][i][url]}]`));
                res.sendFile(path.resolve("./", mockConfig[item][i][url]), {
                headers: {
                    "Mock-Server": "true"
                }
                });
            });
            }
        }
    }
}


app.use(router);


// 端口
app.listen(3333, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:3333');
});
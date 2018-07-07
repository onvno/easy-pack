module.exports.var = {
    gulp : "<%require('gulp')%>",
    browserSync : "<%require('browser-sync').create()%>",
    proxy : "<%require('http-proxy-middleware')%>",
    proxyDemo: "<%proxy('/topics', {\
        target: 'https://cnodejs.org/api/v1',\
        changeOrigin: true,\
        logLevel: 'debug'\
    })%>",
    proxyList : "<%PROXYSTATUS ? [proxyDemo] : null%>",
    CONST : "<%require('./constant.json')%>",
}

module.exports.config = [
    "gulp.task('sync', CONST.devTaskList, () => {\
        browserSync.init({\
            port: 3333,\
            server: {\
                baseDir: './src',\
                middleware: proxyList\
            },\
            startPath: 'html/index.html'\
        });\
        gulp.watch('./src/es6/*.js', ['js']);\
        gulp.watch('./src/STYLENAME/*.STYLENAME', ['STYLENAME']);\
        gulp.watch('./src/TEMPLATEFOLDER/**/*.*', ['TEMPLATENAME'])\
    })"
]
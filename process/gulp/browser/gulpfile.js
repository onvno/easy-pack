module.exports.var = {
    gulp : "<%require('gulp')%>",
    browserSync : "<%require('browser-sync').create()%>",
}

module.exports.config = [
    "gulp.task('sync', ['css', 'less', 'js-watch'], () => {\
        browserSync.init({\
            port: 3333,\
            server: {\
                baseDir: './src',\
            },\
        });\
        gulp.watch('./src/style/*.css', ['css']);\
        gulp.watch('./src/less/*.less', ['less']);\
        gulp.watch('./src/js/*.js', ['js-watch']);\
        gulp.watch('./src/*.html').on('change', browserSync.reload)\
    })"
]
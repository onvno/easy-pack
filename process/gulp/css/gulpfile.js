module.exports.var = {
    gulp : "<%require('gulp')%>",
    less : "<%require('gulp-less')%>",
    minifyCSS : "<%require('gulp-csso')%>",
    browserSync : "<%require('browser-sync').create()%>",
}

module.exports.config = [
    "gulp.task('less', () => {\
        return gulp.src('./src/less/*.less')\
            .pipe(less())\
            .pipe(minifyCSS())\
            .pipe(gulp.dest('./src/style'))\
            .pipe(browserSync.stream());\
    })"
]
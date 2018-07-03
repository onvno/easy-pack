module.exports.var = {
    gulp : "<%require('gulp')%>",
    sourcemaps : "<%require('gulp-sourcemaps')%>",
    browserSync : "<%require('browser-sync').create()%>",
}

module.exports.config = [
    "gulp.task('js', () => {\
        return gulp.src('./src/js/*.js')\
            .pipe(sourcemaps.init())\
            .pipe(concat('app.min.js'))\
            .pipe(sourcemaps.write())\
            .pipe(gulp.dest('./dist/js'));\
    })",
    "gulp.task('js-watch', () => {\
        return gulp.src('./src/js/*.js')\
            .pipe(browserSync.stream());\
    })"
]




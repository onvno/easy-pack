module.exports.var = {
    gulp : "<%require('gulp')%>",
    imagemin : "<%require('gulp-imagemin')%>",
}

module.exports.config = [
    "gulp.task('images', () => {\
        gulp.src('src/img/**/*')\
            .pipe(imagemin())\
            .pipe(gulp.dest('dist/img'))\
    })"
]
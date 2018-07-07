module.exports.var = {
    gulp : "<%require('gulp')%>",
}

module.exports.config = [
    "gulp.task('html', () => {\
        return gulp.src('./src/html/**/*.html')\
            .pipe(browserSync.stream());\
    })",
    "gulp.task('html-build', () => {\
        return gulp.src('./src/html/**/*.html')\
            .pipe(gulp.dest('./dist/html'))\
    })"
]
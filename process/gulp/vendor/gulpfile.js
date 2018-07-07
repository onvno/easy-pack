module.exports.var = {
    gulp : "<%require('gulp')%>",
}

module.exports.config = [
    "gulp.task('vendor', () => {\
        return gulp.src('./src/vendor/**/*')\
            .pipe(gulp.dest('./dist/vendor'))\
    })"
]
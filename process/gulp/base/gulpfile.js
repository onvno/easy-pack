module.exports.var = {
    gulp : "<%require('gulp')%>",
    del : "<%require('del')%>",
}

module.exports.config = [
    "gulp.task('del', function() {\
        del('./dist');\
    });",
    "gulp.task('build', ['STYLECOMPILER-build', 'js-build', 'images'], () => {\
        return gulp.src('./src/*.html')\
            .pipe(gulp.dest('./dist'))\
    })"
]
module.exports.var = {
    gulp : "<%require('gulp')%>",
    del : "<%require('del')%>",
}

module.exports.config = [
    "gulp.task('del', function() {\
        del('./dist');\
    });"
]
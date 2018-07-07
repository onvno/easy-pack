module.exports.var = {
    gulp : "<%require('gulp')%>",
    del : "<%require('del')%>",
    CONST : "<%require('./constant.json')%>",
}

module.exports.config = [
    "gulp.task('clean', function() {\
        del('./dist');\
    });",
    "gulp.task('build', CONST.buildTaskList)"
]

// CONST : "<%require('./constant.json')%>",
module.exports.var = {
    gulp : "<%require('gulp')%>",
    rename : "<%require('gulp-rename')%>",
    browserSync : "<%require('browser-sync').create()%>",
    handlebars : "<%require('./utils/gulp-compile-handlebars-batch.js')%>",
    handlebarsDataChange : "<%require('./utils/gulp-handlebars-data-change.js')%>",
    options : "<%{\
        ignorePartials: true,\
        batch : ['./src/templates/partials'],\
        helpers : {\
            capitals : function(str){\
                return str.toUpperCase();\
            }\
        }\
    }%>"
}

module.exports.config = [
    "gulp.task('handlebars', () => {\
        return gulp.src([\
                './src/templates/**/*.handlebars',\
                '!./src/templates/partials/*',\
            ])\
            .pipe(handlebarsDataChange())\
            .pipe(handlebars(options))\
            .pipe(rename({\
                extname: '.html'\
            }))\
            .pipe(gulp.dest('./src/html'))\
            .pipe(browserSync.stream())\
    })",
    "gulp.task('handlebars-build', () => {\
        return gulp.src([\
                './src/templates/**/*.handlebars',\
                '!./src/templates/partials/*',\
            ])\
            .pipe(handlebarsDataChange())\
            .pipe(handlebars(options))\
            .pipe(rename({\
                extname: '.html'\
            }))\
            .pipe(gulp.dest('./dist/html'))\
    })"
]
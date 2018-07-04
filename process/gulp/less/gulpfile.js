module.exports.var = {
    gulp : "<%require('gulp')%>",
    less : "<%require('gulp-less')%>",
    minifyCSS : "<%require('gulp-csso')%>",
    browserSync : "<%require('browser-sync').create()%>",
    autoprefixer : "<%require('gulp-autoprefixer')%>",
}

module.exports.config = [
    "gulp.task('less', () => {\
        return gulp.src('./src/less/*.less')\
            .pipe(less())\
            .pipe(autoprefixer([\
                'ie >= 9',\
                'edge >= 20',\
                'ff >= 44',\
                'chrome >= 48',\
                'safari >= 8',\
                'opera >= 35',\
                'ios >= 8'\
            ]))\
            .pipe(gulp.dest('./src/style'))\
            .pipe(browserSync.stream());\
    })",
    "gulp.task('less-build', () => {\
        return gulp.src('./src/less/*.less')\
            .pipe(less())\
            .pipe(autoprefixer([\
                'ie >= 9',\
                'edge >= 20',\
                'ff >= 44',\
                'chrome >= 48',\
                'safari >= 8',\
                'opera >= 35',\
                'ios >= 8'\
            ]))\
            .pipe(minifyCSS())\
            .pipe(gulp.dest('./dist/style'))\
    })"
]
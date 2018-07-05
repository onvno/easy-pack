module.exports.var = {
    gulp : "<%require('gulp')%>",
    sass : "<%require('gulp-sass')%>",
    minifyCSS : "<%require('gulp-csso')%>",
    browserSync : "<%require('browser-sync').create()%>",
    autoprefixer : "<%require('gulp-autoprefixer')%>",
}

module.exports.config = [
    "gulp.task('scss', () => {\
        return gulp.src('./src/scss/*.scss')\
            .pipe(sass().on('error', sass.logError))\
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
    "gulp.task('scss-build', () => {\
        return gulp.src('./src/scss/*.scss')\
            .pipe(sass().on('error', sass.logError))\
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
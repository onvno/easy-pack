module.exports.var = {
    gulp : "<%require('gulp')%>",
    sourcemaps : "<%require('gulp-sourcemaps')%>",
    browserSync : "<%require('browser-sync').create()%>",
    babel : "<%require('gulp-babel')%>",
    uglify : "<%require('gulp-uglify')%>",
}

module.exports.config = [
    "gulp.task('js-build', () => {\
        return gulp.src('./src/es6/*.js')\
            .pipe(sourcemaps.init())\
            .pipe(babel({\
                presets: ['env']\
            }))\
            .pipe(uglify())\
            .pipe(sourcemaps.write())\
            .pipe(gulp.dest('./dist/js'));	\
    })",
    "gulp.task('js', () => {\
        return gulp.src('./src/es6/*.js')\
            .pipe(sourcemaps.init())\
            .pipe(babel({\
                presets: ['env']\
            }))\
            .pipe(sourcemaps.write())\
            .pipe(gulp.dest('./src/js'))\
            .pipe(browserSync.stream());\
    })"
]




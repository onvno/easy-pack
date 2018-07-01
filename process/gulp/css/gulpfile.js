gulp.task('less', () => {
    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./src/style'))
        .pipe(browserSync.stream());

})
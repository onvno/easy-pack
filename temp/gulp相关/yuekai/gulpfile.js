var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css')
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence'); //控制task顺序
var clean = require('gulp-clean');

var nodeEnv = gulp.env.nodeEnv || 'development';

gulp.task("node", function() {
    nodemon({
        script: 'app.js',
        env: {
            'NODE_ENV': nodeEnv
        }
    })
});

gulp.task('server', ["node"], function() {
    var files = [
        'views-ejs/*.ejs',
        'router/*.js',
        'publish/*.*',
    ];

    browserSync.init(files, {
        proxy: 'http://localhost:3200',
        // browser: 'chrome',
        notify: false,
        port: 3201
    });

    gulp.watch(files).on("change", reload);
});


gulp.task('clean', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean())
});

gulp.task('build-js', function() {
    return gulp.src(['public/**/*.js'])
        .pipe(uglify()) // 压缩
        .pipe(rev()) // 增加MD5
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest()) //产出md5与源文件关系用于替换
        .pipe(gulp.dest('dist/rev/js'));
});

gulp.task('build-css', function() {
    return gulp.src(['public/**/*.css'])
        .pipe(cleancss()) // 压缩css
        .pipe(rev()) // 增加MD5
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest()) //产出md5与源文件关系用于替换
        .pipe(gulp.dest('dist/rev/css'));
});

gulp.task('build-img', function() {
    return gulp.src(['public/images/*.*'])
        .pipe(gulp.dest('dist/images'))
})

gulp.task('build-ejs', ['build-js', 'build-css', 'build-img'], function() {
    return gulp.src(['dist/rev/**/*.json', 'views-ejs/*.ejs'])
        .pipe(revCollector({
            replaceReved: false,
            dirReplacements: {}
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function(callback) {
    runSequence('clean', 'build-ejs')
});

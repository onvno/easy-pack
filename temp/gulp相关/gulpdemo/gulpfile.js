const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const less =require('gulp-less');
const minifyCSS = require('gulp-csso');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');

// const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const Stream = require('stream');
const through = require('through2');
var path = require('path');


const handlebars= require('./utils/gulp-compile-handlebars-batch.js');
const handlebarsDataChange = require('./utils/gulp-handlebars-data-change.js');

const proxy = require('http-proxy-middleware');
// 设置代理
var jsonPlaceholderProxy = proxy('/topics', {
    target: 'https://cnodejs.org/api/v1',
    changeOrigin: true,
    logLevel: 'debug'
})
// http://localhost:3333/topics -> https://cnodejs.org/api/v1/topics


let templateData = {
    styleUrl: 'test'
};

gulp.task('handlebars', () => {

    options = {
		ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        batch : ['./src/templates/partials'],
        helpers : {
			capitals : function(str){
				return str.toUpperCase();
			}
		}
    }

    return gulp.src([
            './src/templates/**/*.handlebars',
            '!./src/templates/partials/*',
        ])
        // .on('data', (file) => {
        //     console.log("ffff:", file.path);
        // })
        .pipe(handlebarsDataChange())
        .pipe(handlebars(options))
        .pipe(rename({
            extname: ".html"
        }))
		.pipe(gulp.dest('./src/html'))
		.pipe(browserSync.stream())
		// .on('end', () => {
		// 	console.log('end!!!!');
		// })
})

gulp.task('handlebars-build', () => {

    options = {
		ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        batch : ['./src/templates/partials'],
        helpers : {
			capitals : function(str){
				return str.toUpperCase();
			}
		}
    }

    return gulp.src([
            './src/templates/**/*.handlebars',
            '!./src/templates/partials/*',
        ])
        // .on('data', (file) => {
        //     console.log("ffff:", file.path);
        // })
        .pipe(handlebarsDataChange())
        .pipe(handlebars(options))
        .pipe(rename({
            extname: ".html"
        }))
		.pipe(gulp.dest('./dist/html'))
		.pipe(browserSync.stream())
		// .on('end', () => {
		// 	console.log('end!!!!');
		// })
})


gulp.task('js-build', () => {
	return gulp.src('./src/es6/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));	
})


gulp.task('js', () => {
	return gulp.src('./src/es6/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/js'))
        .pipe(browserSync.stream());
})

gulp.task('sass', () => {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer([
            'ie >= 9',
            'edge >= 20',
            'ff >= 44',
            'chrome >= 48',
            'safari >= 8',
            'opera >= 35',
            'ios >= 8'
        ]))
		.pipe(gulp.dest('./src/style'))
		.pipe(browserSync.stream());
});

gulp.task('scss-build', () => {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer([
            'ie >= 9',
            'edge >= 20',
            'ff >= 44',
            'chrome >= 48',
            'safari >= 8',
            'opera >= 35',
            'ios >= 8'
		]))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/style'))
})


gulp.task('less', () => {
    return gulp.src('./src/less/*.less')
		.pipe(less())
		.pipe(autoprefixer([
            'ie >= 9',
            'edge >= 20',
            'ff >= 44',
            'chrome >= 48',
            'safari >= 8',
            'opera >= 35',
            'ios >= 8'
        ]))
        .pipe(gulp.dest('./src/style'))
        .pipe(browserSync.stream());
})

gulp.task('less-build', () => {
    return gulp.src('./src/less/*.less')
		.pipe(less())
		.pipe(autoprefixer([
            'ie >= 9',
            'edge >= 20',
            'ff >= 44',
            'chrome >= 48',
            'safari >= 8',
            'opera >= 35',
            'ios >= 8'
        ]))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/style'))
})

gulp.task('images', () => {
	gulp.src('src/assets/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/img'))
})


gulp.task('build', ['less-build', 'js-build', 'images'], () => {
	return gulp.src('./src/*.html')
		.pipe(gulp.dest('./dist'))
})

gulp.task('html', () => {
    return gulp.src('./src/html/**/*.html')
        .pipe(gulp.dest('./dist/html'))
})

gulp.task('sync', ['less', 'sass', 'handlebars', 'js'], () => {
    browserSync.init({
        port: 3333,
        server: {
            baseDir: './src',
			middleware: [jsonPlaceholderProxy]
        },
        startPath: 'html/index.html'
	});
	gulp.watch('./src/templates/**/*.*', ['handlebars'])
	gulp.watch('./src/less/*.less', ['less']);
	gulp.watch('./src/sass/*.scss', ['sass']);
	gulp.watch('./src/es6/*.js', ['js']);
    // gulp.watch('./src/*.html').on('change', browserSync.reload)
})

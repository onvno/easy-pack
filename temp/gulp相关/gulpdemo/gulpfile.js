const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const less =require('gulp-less');
const minifyCSS = require('gulp-csso');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const Stream = require('stream');
const through = require('through2');

const proxy = require('http-proxy-middleware');
// 设置代理
var jsonPlaceholderProxy = proxy('/topics', {
    target: 'https://cnodejs.org/api/v1',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
})
// http://localhost:3333/topics -> https://cnodejs.org/api/v1/topics
  


var gutil = require('gulp-util');
var Handlebars = require('handlebars');
var fs = require('fs');
var extend = require('util')._extend;
var path = require('path');


function handlebars(opts) {

	var options = opts || {};
	var hb = handlebars.Handlebars;

	//Go through a partials object
	if(options.partials){
		for(var p in options.partials){
			hb.registerPartial(p, options.partials[p]);
		}
	}
	//Go through a helpers object
	if(options.helpers){
		for(var h in options.helpers){
			hb.registerHelper(h, options.helpers[h]);
		}
	}

	// Do not search for more than 10 nestings
	var maxDepth = 10;
	// Process only files with given extension names
	var allowedExtensions = ['hb', 'hbs', 'handlebars', 'html'];

	var isDir = function (filename) {
		var stats = fs.statSync(filename);
		return stats && stats.isDirectory();
	};

	var isHandlebars = function (filename) {
		return allowedExtensions.indexOf(filename.split('.').pop()) !== -1;
	};

	var partialName = function (filename, base) {
		var name = path.join(path.dirname(filename), path.basename(filename, path.extname(filename)));
		if (name.indexOf(base) === 0) {
			name = name.slice(base.length);
		}
		// Change the name of the partial to use / in the partial name, not \
		name = name.replace(/\\/g, '/');

		// Remove leading _ and / character
		var firstChar = name.charAt(0);
		if( firstChar === '_' || firstChar === '/'  ){
			name = name.substring(1);
		}
		
		return name;
	};

	var registerPartial = function (filename, base) {
		if (!isHandlebars(filename)) { return; }
		var name = partialName(filename, base);
		var template = fs.readFileSync(filename, 'utf8');

		hb.registerPartial(name, template);
	};

	var registerPartials = function (dir, base, depth) {
		if (depth > maxDepth) { return; }
		base = base || dir;
		fs.readdirSync(dir).forEach(function (basename) {
			var filename = path.join(dir, basename);
			if (isDir(filename)) {
				registerPartials(filename, base);
			} else {
				registerPartial(filename, base);
			}
		});
	};

	// Go through a partials directory array
	if(options.batch){
		// Allow single string
		if(typeof options.batch === 'string') options.batch = [options.batch];

		options.batch.forEach(function (dir) {
			dir = path.normalize(dir);
			registerPartials(dir, dir, 0);
		});
	}

	/**
	 * For handling unknown partials
	 * @method mockPartials
	 * @param  {string}     content Contents of handlebars file
	 */
	var mockPartials = function(content){
		var regex = /{{> (.*)}}/gim, match, partial;
		if(content.match(regex)){
			while((match = regex.exec(content)) !== null){
				partial = match[1];
				//Only register an empty partial if the partial has not already been registered
				if(!hb.partials.hasOwnProperty(partial)){
					hb.registerPartial(partial, '');
				}
			}
		}
	};


	return through.obj(function (file, enc, cb) {
        console.log("templateData:", templateData);
		var _data = extend({}, templateData);

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-compile-handlebars', 'Streaming not supported'));
			return cb();
		}

		try {
			var fileContents = file.contents.toString();
			if(options.ignorePartials){
				mockPartials(fileContents);
			}

			// Enable gulp-data usage, Extend default data with data from file.data
			if(file.data){
				_data = extend(_data, file.data);
			}
			var template = hb.compile(fileContents, options.compile);
			file.contents = new Buffer(template(_data));
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-compile-handlebars', err));
		}

		this.push(file);
		cb();
	});
}

handlebars.reset = function(){
	// Expose the Handlebars object
	handlebars.Handlebars = Handlebars.create();
}

handlebars.reset();



const func = () => {
    return through.obj(function(file, encoding, callback) {
        const dataPath = path.resolve(path.dirname(file.path), 'data.js');
        templateData = require(dataPath);
        console.log("templateData:", templateData);
        callback(null, file);
    });
}


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
            './src/templates/*/*.handlebars',
            '!./src/templates/partials/*',
        ])
        // .pipe(
        //     (()=> {
        //         var transformStream = new Stream.Transform({objectMode: true});

        //         transformStream._transform = function(file, encoding, callback) {
        //             var error = null;
                    
        //             const dataPath = Path.resolve(Path.dirname(file.path), 'data.js');
        //             templateData = require(dataPath);
        //             console.log("templateData:", templateData);

        //             callback(error, file);
        //         };

        //         return transformStream;
        //     })()
        // )
        .on('data', (file) => {
            console.log("ffff:", file.path);
        })
        .pipe(func())
        .pipe(handlebars(options))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest('./src/html'));
})

gulp.task('js', () => {
    return gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
})

gulp.task('js-watch', () => {
    return gulp.src('./src/js/*.js')
        .pipe(browserSync.stream());
})

gulp.task('less', () => {
    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./src/style'))
        .pipe(browserSync.stream());

})

gulp.task('sync', ['less', 'js-watch'], () => {
    browserSync.init({
        port: 3333,
        server: {
            baseDir: './src',
            middleware: [jsonPlaceholderProxy]
        },
        // startPath: '/users'
    });

    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./src/js/*.js', ['js-watch']);
    gulp.watch('./src/*.html').on('change', browserSync.reload)
})
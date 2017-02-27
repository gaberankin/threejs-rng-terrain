var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('babel', function() {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('webpack', ['babel'], function(){
	return gulp.src('build/main.js')
		.pipe(webpack({
			output:{
				filename: 'main.js'
			}
		}))
		.pipe(gulp.dest('public/js'));
});

gulp.task('default',['webpack']);

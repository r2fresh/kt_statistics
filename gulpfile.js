var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rjs = require('gulp-requirejs');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

gulp.task('requirejs-build',function(){
    return rjs({
        name:'App',
        baseUrl:'src/js',
        out:'kt-statistics.js',
        mainConfigFile:'src/js/App.js'
    })
    .on('error', gutil.log)
    .pipe(uglify())
    .pipe(gulp.dest('src/dist/js'));
});

gulp.task('require-min',function(){
    return gulp.src('src/lib/requirejs/require.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('src/dist/js'));
});

gulp.task('build',['requirejs-build','require-min'])

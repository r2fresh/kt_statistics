var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');

var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');

gulp.task('default', function() {
  console.log("sdfdsfds");
});

gulp.task('scripts', function () {
    return gulp.src('src/js/App.js')
        .pipe(requirejsOptimize())
        .pipe(gulp.dest('dist'));
});

gulp.task('bundle', function ()
{
    return gulp.src('src/js/*.js')
        .pipe(amdOptimize('App'))
        .pipe(concat('main-bundle.js'))
        .pipe(gulp.dest('dist'));
});

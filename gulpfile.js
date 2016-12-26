var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rjs = require('gulp-requirejs');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');

gulp.task('dist-clean', function () {
    return gulp.src('src/dist', {read: false})
        .pipe(clean());
});

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

gulp.task('lib-min', function() {
    return gulp.src([
        'src/lib/jquery/dist/jquery.js',
        'src/lib/bootstrap/dist/js/bootstrap.js',
        'src/lib/datatables/media/js/jquery.dataTables.js',
        'src/lib/datatables/media/js/dataTables.bootstrap.js',
        'src/lib/underscore/underscore.js',
        'src/lib/backbone/backbone.js',
        'src/lib/moment/moment.js',
        'src/lib/moment/locale/ko.js',
        'src/lib/numeral/numeral.js',
        'src/lib/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
        'src/lib/store-js/store.js',
        'src/js/utils/r2Common.js',
        'src/js/utils/common.js',
    ])
    .pipe(concat('library.js'))
    .on('error', gutil.log)
    .pipe(uglify())
    .pipe(gulp.dest('src/dist/js'));
});

gulp.task('css-min', function() {
    gulp.src([
        'src/lib/bootstrap/dist/css/bootstrap.css',
        'src/lib/font-awesome/css/font-awesome.css',
        'src/lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
        'src/lib/bootstrap/dist/css/bootstrap.css',
        'src/lib/c3/c3.css',
        'src/css/common.css',
        'src/css/style.css'
    ])
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('src/dist/css'))
})

gulp.task('icon-copy', function() {
    gulp.src('src/lib/font-awesome/fonts/*.{ttf,woff,woff2,eot,svg,otf}')
    .on('error', gutil.log)
    .pipe(gulp.dest('src/dist/fonts'));
});

gulp.task('image-copy', function() {
    gulp.src('src/img/**.*')
    .on('error', gutil.log)
    .pipe(gulp.dest('src/dist/img'));
});

gulp.task('build',['requirejs-build','require-min','lib-min','css-min','icon-copy','image-copy'])

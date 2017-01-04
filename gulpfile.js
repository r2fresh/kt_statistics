/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
var gulp = require('gulp')
, uglify = require('gulp-uglify')
, rjs = require('gulp-requirejs')
, gutil = require('gulp-util')
, rename = require('gulp-rename')
, concat = require('gulp-concat')
, cleanCSS = require('gulp-clean-css')
, clean = require('gulp-clean')
, sourcemaps = require('gulp-sourcemaps')
, banner = require('gulp-banner')
, strip = require('gulp-strip-comments')
, pkg = require('./package.json');

var bannerComment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * <%= pkg.author %>\n' +
    '*/\n';

/**
* dist 폴더 지우기
*/
gulp.task('dist-clean', function () {
    return gulp.src('src/dist', {read: false})
        .pipe(clean());
});

/**
* require를 통한 js파일 minify와 uglify 작업
*/
gulp.task('requirejs-build',function(){
    return rjs({
        name:'App',
        baseUrl:'src/js',
        out:'kt-statistics.js',
        mainConfigFile:'src/js/App.js'
    })
    .on('error', gutil.log)
    .pipe(uglify())
    .pipe(strip({safe:false}))
    .pipe(banner(bannerComment,{pkg:pkg}))
    .pipe(gulp.dest('src/dist/js'));
});

/**
* require를 통한 js파일 minify와 uglify 작업
*/
gulp.task('require-min',function(){
    return gulp.src('src/lib/requirejs/require.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('src/dist/js'));
});

/**
* css 파일 minify
*/
gulp.task('css-min', function() {
    gulp.src([
        'src/lib/bootstrap/dist/css/bootstrap.css',
        'src/lib/font-awesome/css/font-awesome.css',
        'src/lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css',
        'src/lib/datatables/media/css/dataTables.bootstrap.css',
        'src/lib/c3/c3.css',
        'src/css/common.css',
        'src/css/style.css'
    ])
    .pipe(cleanCSS({keepSpecialComments:0}))
    .pipe(concat('style.min.css'))
    .pipe(banner(bannerComment,{pkg:pkg}))
    .pipe(gulp.dest('src/dist/css'))
})

/**
* css에서 사용하는 font-icon 복사
*/
gulp.task('icon-copy', function() {
    gulp.src(['src/lib/font-awesome/fonts/*.{ttf,woff,woff2,eot,svg,otf}','src/lib/bootstrap/dist/fonts/*.{ttf,woff,woff2,eot,svg,otf}'])
    .on('error', gutil.log)
    .pipe(gulp.dest('src/dist/fonts'));
});

/**
* dist안으로 image 파일 복사
*/
gulp.task('image-copy', function() {
    gulp.src('src/img/**.*')
    .on('error', gutil.log)
    .pipe(gulp.dest('src/dist/img'));
});

/**
* build task 작성
*/
gulp.task('build',['dist-clean'],function(){
    gulp.start('requirejs-build','require-min','css-min','icon-copy', 'image-copy')
})

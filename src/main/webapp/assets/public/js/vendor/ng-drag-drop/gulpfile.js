'use strict';
/*global require*/

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

// min.css, hypercard.css, hyperbox.css
gulp.task('styles', function () {
  return gulp.src('styles/**/*.scss')
    .pipe($.rubySass({
      sourcemap: false,
      style: 'expanded',
      precision: 10
    }))
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('dist'));
});

// html template may contains reference to images
gulp.task('scripts', function () {
  return gulp.src(['scripts/**/*.js'])
    .pipe($.uglify())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

//run all tasks after build directory has been cleaned
gulp.task('default', function () {
  gulp.start('styles');
  gulp.start('scripts');
});

gulp.task('watch', function () {
  gulp.watch('styles/*.scss', ['styles']);
  gulp.watch('scripts/*.js', ['scripts']);
});

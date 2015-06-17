var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    newer = require('gulp-newer'),
    globbing = require('gulp-css-globbing'),
    cmq = require('gulp-combine-media-queries');


// ROOT TASKS // ---------------------------------------------------------
// Main style task  
gulp.task('css', function() {
  return gulp.src('assets/dev/sass/application.scss')
    .pipe(globbing({extensions: '.scss'}))
    .pipe(sass())
    .pipe(cmq()) // combine all @media queries into the page base
    .pipe(autoprefixer({cascade: false})) // auto prefix
    .pipe(minifycss()) // minify everything
    .pipe(gulp.dest('assets/public/css/'));
});

// Main Javascript task
gulp.task('js', function() {  
  return gulp.src('assets/dev/js/**/*.js')
    .pipe(newer('assets/public/js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/public/js'));
});

// Main image task
gulp.task('img', function() {
  return gulp.src('assets/dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}')
    .pipe(newer('assets/public/img'))
    .pipe(imagemin({ 
      optimizationLevel: 5,
      progressive: true, 
      interlaced: true,
      svgoPlugins: [{
        collapseGroups: false,
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest('assets/public/img'));
});


// FUNCTIONS // ---------------------------------------------------------
// Initial start function
gulp.task('start', ['img'], function() {
  gulp.start('js', 'css');
});

// Watch function
gulp.task('watch', ['start'], function() {
  gulp.watch('assets/dev/sass/**/*.scss', ['css']);
  gulp.watch('assets/dev/js/**/*.js', ['js']);
  gulp.watch('assets/dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}', ['img']);
 
  livereload.listen();
  gulp.watch(['assets/public/js/**/*.js', 'assets/public/img/**/*.{jpg,jpeg,png,gif,svg,ico}', 'assets/public/css/*.css']).on('change', livereload.changed);
});

// Default function
gulp.task('default', ['watch']);
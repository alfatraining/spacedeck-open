const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', function(done) {
  gulp.src('styles/**/*.scss')
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(autoprefixer({ 
      cascade: false 
    }))
    .pipe(gulp.dest('./public/stylesheets/'))
    .pipe(concat('style.css'))
  done()
})

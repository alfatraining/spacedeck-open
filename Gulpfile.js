const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer');

const generateCSS = (done) => {
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
};

gulp.task('styles', generateCSS)
gulp.task('watch', () => { gulp.watch(['views/alfaview/styles/*.scss', 'styles/*.scss'], generateCSS) });
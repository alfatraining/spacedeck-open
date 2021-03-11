const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const dirs = {
  src: 'public/javascripts/*.js',
  dest: 'public/build/js/',
};

gulp.task('build-sd-js', () =>
  gulp
    .src(dirs.src)
    .pipe(babel({ presets: [['@babel/preset-env', { modules: false }]] }))
    .pipe(uglify())
    .pipe(concat('spacedeck.js'))
    .pipe(gulp.dest(dirs.dest))
);

gulp.task('styles', (done) => {
  gulp
    .src('styles/**/*.scss')
    .pipe(
      sass({
        errLogToConsole: true,
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest('./public/stylesheets/'))
    .pipe(concat('style.css'));
  done();
});

gulp.task('watch', () => {
  gulp.watch(['views/alfaview/styles/*.scss', 'styles/*.scss'], (done) => {
    gulp
      .src('styles/**/*.scss')
      .pipe(
        sass({
          errLogToConsole: true,
        })
      )
      .on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
      })
      .pipe(gulp.dest('./public/stylesheets/'))
      .pipe(concat('style.css'));
    done();
  });
  gulp.watch(dirs.src, () =>
    gulp
      .src(dirs.src)
      .pipe(babel({ presets: [['@babel/preset-env', { modules: false }]] }))
      .pipe(concat('spacedeck.js'))
      .pipe(gulp.dest(dirs.dest))
  );
});

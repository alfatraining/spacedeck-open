const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("styles", (done) => {
  gulp
    .src("styles/**/*.scss")
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
    .pipe(gulp.dest("./public/stylesheets/"))
    .pipe(concat("style.css"));
  done();
});

gulp.task("watch", () => {
  gulp.watch(["views/alfaview/styles/*.scss", "styles/*.scss"], (done) => {
    gulp
      .src("styles/**/*.scss")
      .pipe(
        sass({
          errLogToConsole: true,
        })
      )
      .on("error", function (err) {
        console.log(err.toString());
        this.emit("end");
      })
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .on("error", function (err) {
        console.log(err.toString());
        this.emit("end");
      })
      .pipe(gulp.dest("./public/stylesheets/"))
      .pipe(concat("style.css"));
    done();
  });
});

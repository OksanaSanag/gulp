
const gulp = require("gulp");
//scss
const sass = require("gulp-sass");
const autoprefixer = require('gulp-autoprefixer');
sass.compiler = require("node-sass");
//js
const concat = require("gulp-concat");
const babel = require('gulp-babel');
//img
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
// BrowserSync
const browserSync = require('browser-sync').create();


gulp.task("html", (done) => {
    gulp.src("./src/*.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("scss", (done) => {
    gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("js", (done) => {
    gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("index.js"))
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
    done();
});

gulp.task("img", (done) => {
    gulp.src("./src/img/**/*.*")
    .pipe(cache(
        imagemin(
            [
                imageminPngquant()
            ]
        ), { 
            name: 'img'
            }
    ))
    .pipe(gulp.dest("./dist/img"));
    done();
});

gulp.task("browser-init", (done) => {
    browserSync.init({
        server: "./dist"
    });
    done();
});

gulp.task("build", gulp.series(gulp.parallel("html", "scss", "js", "img")));

gulp.task("watch", gulp.series("build", "browser-init", (done) => {
    gulp.watch("./src/index.html", gulp.series("html"));
    gulp.watch("./src/scss/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    //gulp.watch("./src/img/**/*.*", gulp.series("img"));
    done();
}));

gulp.task("default", gulp.series("watch"));

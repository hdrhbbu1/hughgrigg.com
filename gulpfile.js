var gulp = require("gulp");
var sass = require("gulp-sass");
var sourceMaps = require("gulp-sourcemaps");
var cleanCSS = require("gulp-clean-css");
var autoPrefix = require("gulp-autoprefixer");
var rev = require("gulp-rev");

var htmlTidy = require("gulp-htmltidy");
var htmlMin = require("gulp-htmlmin");

var imageMin = require("gulp-imagemin");
var pngQuant = require("imagemin-pngquant");

var merge = require("merge-stream");

var runSequence = require("run-sequence");

var shell = require("gulp-shell");

var awsPublish = require("gulp-awspublish");
var parallelize = require("concurrent-transform");

var updateReading = require("./tasks/gulp/update-reading");

gulp.task("style", function () {
    return gulp.src("./themes/2016/scss/hg.scss")
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoPrefix())
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(sourceMaps.write("."))
        .pipe(gulp.dest("./themes/2016/static/css"))
        .pipe(rev.manifest("rev_manifest.json"))
        .pipe(gulp.dest("./themes/2016/data"));
});

gulp.task("post-process-html", function () {
    return gulp.src(["./publish/**/*.html", "!./public/**/google*"])
        .pipe(htmlTidy({"doctype": "html5", "new-empty-tags": "span"}))
        .pipe(htmlMin(require("./config/htmlmin-opt.json")))
        .pipe(gulp.dest("./publish/"));
});

gulp.task("imageMin", function () {
    return gulp.src("./static/img/**/*.*")
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()],
            optimizationLevel: 7,
            interlaced: true
        }))
        .pipe(gulp.dest("./static/img/"));
});

gulp.task("theme-imageMin", function () {
    return gulp.src("./themes/2016/static/img/**/*.*")
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()],
            optimizationLevel: 7,
            interlaced: true
        }))
        .pipe(gulp.dest("./themes/2016/static/img/"));
});

gulp.task("update-readings", function () {
    return gulp.src("./content/reading/**/*.md")
        .pipe(updateReading())
        .pipe(gulp.dest("./content/reading/"));
});

gulp.task("watch", function () {
    gulp.watch("./themes/2016/scss/**/*.scss", ["style"]);
    gulp.watch("./public/**/*.html", ["check-html"]);
    gulp.watch("./public/**/*.css", ["check-css"]);
});

gulp.task("write-publish", ["style"], shell.task(
    "hugo --config=config.yaml --theme=2016 --destination=./publish/;"
));

gulp.task("prepare-publish", function (cb) {
    return runSequence(
        "imageMin",
        "theme-imageMin",
        "style",
        "write-publish",
        "post-process-html",
        cb
    );
});

gulp.task("publish", ["prepare-publish"], function () {
    var publisher = awsPublish.create({
        params: {Bucket: "www.hughgrigg.com"}
    });
    var headers = {"Cache-Control": "max-age=315360000, no-transform, public"};
    return gulp.src("./publish/**/*.*")
        .pipe(awsPublish.gzip())
        .pipe(parallelize(publisher.publish(headers), 10))
        .pipe(publisher.sync())
        .pipe(publisher.cache())
        .pipe(awsPublish.reporter());
});

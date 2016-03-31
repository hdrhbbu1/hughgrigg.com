var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var cleanCSS    = require('gulp-clean-css');
var autoprefix  = require('gulp-autoprefixer');
var rev         = require('gulp-rev');

var htmltidy    = require('gulp-htmltidy');
var htmlmin     = require('gulp-htmlmin');

var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');

var merge       = require('merge-stream');

var runSequence = require('run-sequence');

var shell       = require('gulp-shell');

var awspublish  = require('gulp-awspublish');
var parallelize = require('concurrent-transform');

gulp.task('style', function() {
  return gulp.src('./themes/2016/scss/hg.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./themes/2016/static/css'))
    .pipe(rev.manifest('rev_manifest.json'))
    .pipe(gulp.dest('./themes/2016/data'));
});

gulp.task('post-process-html', function() {
  return gulp.src(['./publish/**/*.html', '!./public/**/google*'])
    .pipe(htmltidy({'doctype': 'html5', 'new-empty-tags': 'span'}))
    .pipe(htmlmin(require('./config/htmlmin-opt.json')))
    .pipe(gulp.dest('./publish/'));
});

gulp.task('imagemin', function() {
  return gulp.src('./static/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        optimizationLevel: 7,
        interlaced: true
    }))
    .pipe(gulp.dest('./static/img/'));
});

gulp.task('theme-imagemin', function() {
  return gulp.src('./themes/2016/static/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        optimizationLevel: 7,
        interlaced: true
    }))
    .pipe(gulp.dest('./themes/2016/static/img/'));
});

gulp.task('watch', function() {
  gulp.watch('./themes/2016/scss/**/*.scss', ['style']);
  gulp.watch('./public/**/*.html', ['check-html']);
  gulp.watch('./public/**/*.css', ['check-css']);
});

gulp.task('write-publish', ['style'], shell.task(
  'rm -rf ./publish/*;' +
  'hugo --config=config.yaml --theme=2016 --destination=./publish/;'
));

gulp.task('publish', [
    'write-publish',
    'imagemin',
    'theme-imagemin',
    'write-publish',
    'post-process-html'
  ],
  function() {
    var publisher = awspublish.create({
      params: {Bucket:'www.hughgrigg.com'}
    });
    var headers = {'Cache-Control':'max-age=315360000, no-transform, public'};
    return gulp.src('./publish/**/*.*')
      .pipe(awspublish.gzip())
      .pipe(parallelize(publisher.publish(headers), 10))
      .pipe(publisher.sync())
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
  }
);

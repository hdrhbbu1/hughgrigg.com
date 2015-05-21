var
  gulp        = require('gulp'),
  sass        = require('gulp-sass'),
  sourcemaps  = require('gulp-sourcemaps'),
  minifyCSS   = require('gulp-minify-css'),
  autoprefix  = require('gulp-autoprefixer'),

  htmltidy    = require('gulp-htmltidy'),
  htmlmin     = require('gulp-htmlmin'),

  scsslint    = require('gulp-scss-lint'),
  csslint     = require('gulp-csslint'),
  htmlhint    = require('gulp-htmlhint'),

  imagemin    = require('gulp-imagemin'),
  pngquant    = require('imagemin-pngquant'),

  merge       = require('merge-stream'),

  runSequence = require('run-sequence'),

  shell       = require('gulp-shell'),

  awspublish  = require('gulp-awspublish'),
  parallelize = require('concurrent-transform');

gulp.task('style', function() {
  return gulp.src('./themes/2015/scss/hg.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(minifyCSS({
      'advanced': true,
      'aggressiveMerging': true,
      'keepBreaks': true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./themes/2015/static/css'));
});

gulp.task('post-process-css', function() {
  gulp.src('./publish/**/*.css')
  .pipe(minifyCSS({'advanced': true, 'aggressiveMerging': true}))
  .pipe(gulp.dest('./publish/'));
});

gulp.task('post-process-html', function() {
  return gulp.src(['./publish/**/*.html', '!./public/**/google*'])
    .pipe(htmltidy({'doctype': 'html5', 'new-empty-tags': 'span'}))
    .pipe(htmlmin(require('./config/htmlmin-opt.json')))
    .pipe(gulp.dest('./publish/'));
});

gulp.task('check-scss', function() {
  gulp.src('./themes/2015/scss/**/*.scss')
    .pipe(scsslint());
});

gulp.task('check-css', function() {
  return gulp.src(['./public/**/*.css'])
    .pipe(csslint({
      'box-sizing': false,
      'font-sizes': false,
      'bulletproof-font-face': false,
      'compatible-vendor-prefixes': false
    }))
    .pipe(csslint.reporter());
});

gulp.task('check-html', function() {
  return gulp.src(['./public/**/*.html', '!./public/**/google*'])
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

gulp.task('check', ['check-scss', 'check-css', 'check-html']);

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
  return gulp.src('./themes/2015/static/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        optimizationLevel: 7,
        interlaced: true
    }))
    .pipe(gulp.dest('./themes/2015/static/img/'));
});

gulp.task('watch', function() {
  gulp.watch('./themes/2015/scss/**/*.scss', ['style']);
  gulp.watch('./public/**/*.html', ['check-html']);
  gulp.watch('./public/**/*.css', ['check-css']);
});

gulp.task('write-publish', ['style'], shell.task(
  'rm -rf ./publish/*;' +
  'hugo --config=config.yaml --theme=2015 --destination=./publish/;'
));

gulp.task('prepare-publish', ['imagemin', 'theme-imagemin', 'write-publish'], function(callback) {
  runSequence(['post-process-css', 'post-process-html'], callback);
});

gulp.task('publish', ['write-publish', 'prepare-publish', 'check'], function() {
  var publisher = awspublish.create({bucket:'www.hughgrigg.com'}),
    headers     = {'Cache-Control':'max-age=315360000, no-transform, public'};
  return gulp.src('./publish/**/*.*')
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers), 10))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

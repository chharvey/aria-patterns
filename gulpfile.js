const fs = require('fs')

const gulp         = require('gulp')

const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')

const uglify = require('gulp-uglify-es').default

const kss          = require('kss')
const jsdoc        = require('gulp-jsdoc3')

const createDir = require('./lib/createDir.js')


gulp.task('lessc:each', function () {
  return gulp.src(['./css/src/*.less', '!./css/src/styleguide.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
    }))
    .pipe(gulp.dest('./css/dist/'))
    .pipe(clean_css({
      level: {
        2: {
          overrideProperties: false, // need fallbacks for `initial` and `unset`
          restructureRules: true, // combines selectors having the same rule (akin to `&:extend()`) // REVIEW be careful here
        },
      },
    }))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./css/dist/'))
})

gulp.task('uglify:js', function () {
  return gulp.src('./js/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./js/dist/'))
})

gulp.task('docs:kss', ['test'], function () {
  return kss(require('./config/kss.json'))
})

// HOW-TO: https://github.com/mlucool/gulp-jsdoc3#usage
gulp.task('docs:api', function () {
  return gulp.src(['README.md', './index.js', './tpl/*.tpl.js'], {read: false})
    .pipe(jsdoc(require('./config/jsdoc.json')))
})

gulp.task('docs:all', ['docs:kss', 'docs:api'])

gulp.task('build', ['lessc:each', 'uglify:js', 'docs:all'])

gulp.task('test', async function () {
  await createDir('./docs/test/')
  require('./test/xPermalink.test.js');
  require('./test/xDirectory.test.js');
  require('./test/xPersonFullname.test.js');
  require('./test/xAddress.test.js');
})

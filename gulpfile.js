const fs = require('fs')
const path = require('path')

const gulp         = require('gulp')
const rename       = require('gulp-rename')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')

const uglify = require('gulp-uglify-es').default

const kss          = require('kss')
const jsdoc        = require('gulp-jsdoc3')


gulp.task('lessc:each', function () {
  return gulp.src('./x-*/css/src/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
    }))
    .pipe(clean_css({
      level: {
        2: {
          overrideProperties: false, // need fallbacks for `initial` and `unset`
          restructureRules: true, // combines selectors having the same rule (akin to `&:extend()`) // REVIEW be careful here
        },
      },
    }))
    .pipe(rename(function (p) {
      p.dirname = path.join(p.dirname, '../dist/')
    }))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./'))
})

gulp.task('uglify:js', function () {
  return gulp.src('./x-*/js/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(function (p) {
      p.dirname = path.join(p.dirname, '../dist/')
    }))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./'))
})

// HOW-TO: https://github.com/mlucool/gulp-jsdoc3#usage
gulp.task('docs:api', function () {
  return gulp.src(['README.md', './index.js', './x-*/tpl/*.tpl.js', './tpl/*.tpl.js'], {read: false})
    .pipe(jsdoc(require('./config/jsdoc.json')))
})

// HOW-TO: https://github.com/kss-node/kss-node/issues/161#issuecomment-222292620
gulp.task('docs:kss', ['test'], function () {
  return kss(require('./config/kss.json'))
})

gulp.task('docs:all', ['docs:api', 'docs:kss'])

gulp.task('build', ['lessc:each', 'uglify:js', 'docs:all'])

gulp.task('test', async function () {
  require('./x-directory/test/x-directory.test.js');
  require('./x-person-fullname/test/x-person-fullname.test.js');
  require('./x-address/test/x-address.test.js');
  require('./x-permalink/test/x-permalink.test.js');
})

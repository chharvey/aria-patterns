const fs = require('fs')
const path = require('path')

// require('babel-core')          // DO NOT REMOVE … required by `gulp-babel`
// require('babel-preset-env')    // DO NOT REMOVE … required by babel preset configurations
// require('babel-preset-minify') // DO NOT REMOVE … required by babel preset configurations
const gulp         = require('gulp')
const rename       = require('gulp-rename')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const jsdoc        = require('gulp-jsdoc3')
const babel        = require('gulp-babel')
const sourcemaps   = require('gulp-sourcemaps')
const kss          = require('kss')


gulp.task('test', async function () {
  require('./x-directory/test/x-directory.test.js');
  require('./x-person-fullname/test/x-person-fullname.test.js');
  require('./x-address/test/x-address.test.js');
  require('./x-permalink/test/x-permalink.test.js');
})

// HOW-TO: https://github.com/mlucool/gulp-jsdoc3#usage
gulp.task('docs-api', async function () {
  return gulp.src(['README.md', './index.js', './x-*/tpl/*.tpl.js', './tpl/*.tpl.js'], {read: false})
    .pipe(jsdoc(require('./config/jsdoc.json')))
})

// HOW-TO: https://github.com/kss-node/kss-node/issues/161#issuecomment-222292620
gulp.task('docs-kss', ['test'], async function () {
  return kss(require('./config/kss.json'))
})

gulp.task('docs', ['docs-api', 'docs-kss'])

gulp.task('dist-style', async function () {
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

gulp.task('dist-script', async function () {
  return gulp.src('./x-*/js/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env', 'minify']
    }))
    .pipe(rename(function (p) {
      p.dirname = path.join(p.dirname, '../dist/')
    }))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./'))
})

gulp.task('dist', ['dist-style', 'dist-script'])

gulp.task('build', ['test', 'docs', 'dist'])

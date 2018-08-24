const fs = require('fs')
const path = require('path')

// require('babel-core')          // DO NOT REMOVE … required by `gulp-babel`
// require('babel-preset-env')    // DO NOT REMOVE … required by babel preset configurations
// require('babel-preset-minify') // DO NOT REMOVE … required by babel preset configurations
const gulp         = require('gulp')
const rename       = require('gulp-rename')
const inject       = require('gulp-inject-string')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const jsdoc        = require('gulp-jsdoc3')
const babel        = require('gulp-babel')
const sourcemaps   = require('gulp-sourcemaps')
const kss          = require('kss')


const PACKAGE = require('./package.json')
const META = JSON.stringify({
  package: `https://www.npmjs.com/package/${PACKAGE.name}`,
  version: PACKAGE.version,
  license: PACKAGE.license,
  built  : new Date().toISOString(),
}, null, 2)


gulp.task('test', async function () {
  require('./x-directory/test/x-directory.test.js');
  require('./x-person-fullname/test/x-person-fullname.test.js');
  require('./x-address/test/x-address.test.js');
  require('./x-permalink/test/x-permalink.test.js');
})

// HOW-TO: https://github.com/mlucool/gulp-jsdoc3#usage
gulp.task('docs-api', async function () {
  return gulp.src(['README.md', './index.js', './src/x-*/tpl/*.tpl.js'], {read: false})
    .pipe(jsdoc(require('./config/jsdoc.json')))
})

// HOW-TO: https://github.com/kss-node/kss-node/issues/161#issuecomment-222292620
gulp.task('docs-kss', ['test'], async function () {
  return kss(require('./config/kss.json'))
})

gulp.task('docs', ['docs-api', 'docs-kss'])

gulp.task('dist-style', async function () {
  return gulp.src('./src/x-*/css/*.less')
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
    .pipe(inject.prepend(`/* ${META} */`))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./dist/'))
})

gulp.task('dist-script', async function () {
  return gulp.src('./src/x-*/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env', 'minify']
    }))
    .pipe(inject.prepend(`/* ${META} */`))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./dist/'))
})

gulp.task('dist', ['dist-style', 'dist-script'])

gulp.task('build', ['test', 'docs', 'dist'])

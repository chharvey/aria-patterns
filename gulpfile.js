const fs = require('fs')
const path = require('path')

// require('babel-core')          // DO NOT REMOVE … required by `gulp-babel`
// require('babel-preset-env')    // DO NOT REMOVE … required by babel preset configurations
// require('babel-preset-minify') // DO NOT REMOVE … required by babel preset configurations
const gulp         = require('gulp')
const inject       = require('gulp-inject-string')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const babel        = require('gulp-babel')
const sourcemaps   = require('gulp-sourcemaps')
const typedoc      = require('gulp-typedoc')
const typescript   = require('gulp-typescript')
const kss          = require('kss')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./tsconfig.json')
const typedocconfig = require('./config/typedoc.json')


const PACKAGE = require('./package.json')
const META = JSON.stringify({
  package: `https://www.npmjs.com/package/${PACKAGE.name}`,
  version: PACKAGE.version,
  license: PACKAGE.license,
  built  : new Date().toISOString(),
}, null, 2)


gulp.task('dist-tpl', async function () {
	return gulp.src('./src/x-*/tpl/*.tpl.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./dist/'))
})

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

gulp.task('dist', ['dist-tpl', 'dist-style', 'dist-script'])

gulp.task('test-out', async function () {
	return gulp.src('./test/src/*.test.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/out/'))
})

gulp.task('test-run', async function () {
	await Promise.all([
		require('./test/out/x-address.test.js'        ).default,
		require('./test/out/x-directory.test.js'      ).default,
		require('./test/out/x-permalink.test.js'      ).default,
		require('./test/out/x-person-fullname.test.js').default,
	])
	console.info('All tests ran successfully!')
})

gulp.task('test', ['test-out', 'test-run'])

gulp.task('docs-api', async function () {
	return gulp.src('./src/*/tpl/*.tpl.ts')
		.pipe(typedoc(typedocconfig))
})

// HOW-TO: https://github.com/kss-node/kss-node/issues/161#issuecomment-222292620
gulp.task('docs-kss', ['test-run'], async function () {
	return kss(require('./config/kss.json'))
})

gulp.task('docs', ['docs-api', 'docs-kss'])

gulp.task('build', ['dist', 'test', 'docs'])

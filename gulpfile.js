const fs = require('fs')
const path = require('path')
const util = require('util')

// require('@babel/core')         // DO NOT REMOVE … required by `gulp-babel`
// require('@babel/preset-env')   // DO NOT REMOVE … required by babel preset configurations
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
const mkdirp       = require('make-dir')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./tsconfig.json')


const PACKAGE = require('./package.json')
const META = JSON.stringify({
  package: `https://www.npmjs.com/package/${PACKAGE.name}`,
  version: PACKAGE.version,
  license: PACKAGE.license,
  built  : new Date().toISOString(),
}, null, '\t')


function dist_tpl() {
	return gulp.src('./src/x-*/tpl/*.tpl.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./dist/'))
}

function dist_style() {
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
}

function dist_script() {
  return gulp.src('./src/x-*/js/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(babel({
			presets: [
				'@babel/preset-env',
				'minify',
			]
    }))
    .pipe(inject.prepend(`/* ${META} */`))
    .pipe(sourcemaps.write('./')) // writes to an external .map file
    .pipe(gulp.dest('./dist/'))
}

const dist = gulp.parallel(dist_tpl, dist_style, dist_script)

function test_out() {
	return gulp.src('./test/src/*.test.ts')
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/out/'))
}

async function test_run() {
	await mkdirp(path.join(__dirname, './test/docs/'))
	await Promise.all([
		'address',
		'directory',
		'permalink',
		'person-fullname',
	].map(async (compname) => util.promisify(fs.writeFile)(
		path.join(__dirname, `./test/docs/x-${compname}.test.html`),
		require(`./test/out/x-${compname}.test.js`).default,
		'utf8'
	)))
	console.info('All tests ran successfully!')
}

const test = gulp.series(test_out, test_run)

function docs_api() {
	return gulp.src('./src/x-*/tpl/*.tpl.ts')
		.pipe(typedoc(tsconfig.typedocOptions))
}

// HOW-TO: https://github.com/kss-node/kss-node/issues/161#issuecomment-222292620
async function docs_kss() {
	return kss(require('./config/kss.json'))
}

const docs = gulp.parallel(docs_api, gulp.series(test_run, docs_kss))

const build = gulp.parallel(
	gulp.series(
		gulp.parallel(
			dist,
			test_out
		),
		test_run,
		docs_kss,
	),
	docs_api
)

module.exports = {
	dist,
	dist_tpl,
	dist_style,
	dist_script,
	test_out,
	test_run,
	test,
	docs_api,
	docs_kss,
	docs,
	build,
}

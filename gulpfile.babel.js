import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'
import stylelint from 'gulp-stylelint'
import webpack from 'webpack'
import webpackConfig from './webpack.config'
import imagemin from 'gulp-imagemin'
import svgstore from 'gulp-svgstore'
import sourcemaps from 'gulp-sourcemaps'
import swPrecache from 'sw-precache'
import cp from 'child_process'
import gutil from 'gulp-util'
import sequence from 'run-sequence'
import del from 'del'
import BrowserSync from 'browser-sync'
import pkg from './package'

const browserSync = BrowserSync.create()

gulp.task('clean', () => {
  return del(['./public/assets/'])
})

gulp.task('styles', ['styles-lint'], () => {
  return gulp.src(pkg.paths.styles.entry)
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions', '> 5%'], { cascade: true }))
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemaps.write('maps') : gutil.noop())
    .pipe(process.env.NODE_ENV === 'production' ? cssnano() : gutil.noop())
    .pipe(gulp.dest(pkg.paths.styles.dest))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('styles-lint', () => {
  return gulp.src(pkg.paths.styles.glob)
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
})

gulp.task('scripts', (callback) => {
  const myConfig = Object.assign({}, webpackConfig)

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }))
    browserSync.reload()
    callback()
  })
})

gulp.task('images', () => {
  return gulp.src(pkg.paths.images.glob)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [
        { cleanupListOfValues: { floatPrecision: 2 } },
        { cleanupNumericValues: { floatPrecision: 2 } },
        { convertPathData: { floatPrecision: 2 } }
      ]
    }))
    .pipe(gulp.dest(pkg.paths.images.dest))
})

gulp.task('icons', () => {
  return gulp.src(pkg.paths.icons.glob)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [
        { cleanupListOfValues: { floatPrecision: 2 } },
        { cleanupNumericValues: { floatPrecision: 2 } },
        { convertPathData: { floatPrecision: 2 } }
      ]
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(pkg.paths.icons.dest))
})

gulp.task('files', () => {
  return gulp.src(pkg.paths.static.glob)
    .pipe(gulp.dest(pkg.paths.static.dest))
})

gulp.task('fonts', () => {
  return gulp.src(pkg.paths.fonts.glob)
    .pipe(gulp.dest(pkg.paths.fonts.dest))
})

gulp.task('generate-service-worker', (callback) => {
  const rootDir = 'public'

  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{js,css,png,jpg,gif,svg,woff2,woff}'],
    stripPrefix: rootDir
  }, callback)
})

gulp.task('watch', () => {
  browserSync.init({
    notify: false,
    server: { baseDir: 'public/' },
    // proxy: 'butane.local'
  })

  gulp.watch(pkg.paths.styles.glob, ['styles'])
  gulp.watch(pkg.paths.scripts.glob, ['scripts'])
  gulp.watch(pkg.paths.images.glob, ['images'])
  gulp.watch(pkg.paths.icons.glob, ['icons'])
})

gulp.task('build', () => {
  sequence('clean', ['styles', 'scripts', 'images', 'icons', 'fonts', 'files'])
})

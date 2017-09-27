import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'
import stylelint from 'gulp-stylelint'
import webpack from 'webpack'
import webpackConfig from './webpack.config'
import imagemin from 'gulp-imagemin'
import sourcemaps from 'gulp-sourcemaps'
import swPrecache from 'sw-precache'
import cp from 'child_process'
import gutil from 'gulp-util'
import sequence from 'run-sequence'
import critical from 'critical'
import fancyLog from 'fancy-log'
import chalk from 'chalk'
import del from 'del'
import BrowserSync from 'browser-sync'
import pkg from './package'

const browserSync = BrowserSync.create()

gulp.task('clean', () => {
  return del(pkg.paths.clean)
})

gulp.task('styles', ['styles-lint'], () => {
  return gulp.src(pkg.paths.styles.entry)
    .pipe(process.env.NODE_ENV !== 'production' ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .on('error', showErrors)
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
        { formatter: 'string', console: true }
      ]
    }))
})

gulp.task('criticalcss', ['styles'], (callback) => {
  doSynchronousLoop(pkg.critical.pages, processCriticalCSS, () => {
    callback()
  })
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
    // proxy: pkg.urls.local
  })

  gulp.watch(pkg.paths.styles.glob, ['styles'])
  gulp.watch(pkg.paths.scripts.glob, ['scripts'])
  gulp.watch(pkg.paths.images.glob, ['images'])
  gulp.watch(pkg.paths.icons.glob, ['icons'])
})

gulp.task('build', () => {
  sequence('clean',
    [
      pkg.critical.init ? 'criticalcss' : 'styles',
      'scripts',
      'images',
      'fonts',
      'files'
    ]
  )
})

function showErrors (error) {
  console.log(error.toString())
  this.emit('end')
}

function doSynchronousLoop (data, processData, done) {
  if (data.length > 0) {
    const loop = (data, i, processData, done) => {
      processData(data[i], i, () => {
        if (++i < data.length) {
          loop(data, i, processData, done)
        } else {
          done()
        }
      })
    }
    loop(data, 0, processData, done)
  } else {
    done()
  }
}

function processCriticalCSS (element, i, callback) {
  const criticalSrc = pkg.urls.local + element.url
  const criticalDest = pkg.critical.dest + element.template + '_critical.min.css'

  fancyLog('-> Generating critical CSS: ' + chalk.cyan(criticalSrc) + ' -> ' + chalk.magenta(criticalDest))
  critical.generate({
    src: criticalSrc,
    dest: criticalDest,
    inline: false,
    ignore: [],
    base: './public/',
    css: [
      './public/assets/css/main.css',
    ],
    minify: true,
    width: 1200,
    height: 1200
  }, (err, output) => {
    callback()
  })
}

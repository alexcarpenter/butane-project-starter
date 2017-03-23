const gulp = require('gulp')
const sass = require('gulp-sass')
const stylelint = require('gulp-stylelint')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const svgstore = require('gulp-svgstore')
const gulpif = require('gulp-if')
const sequence = require('run-sequence')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const path = require('path')

global.production = false

function showErrors (err) {
  console.log(err.toString())
  this.emit('end')
}

const paths = {
  root: path.resolve(__dirname),
  src: path.resolve(__dirname, 'src/'),
  dest: path.resolve(__dirname, 'public/assets/')
}

const config = {
  browserSync: {
    notify: false,
    proxy: 'domain.local'
  }
}

gulp.task('styles', ['style-lint'], () => {
  return gulp.src(`${paths.src}/stylesheets/main.scss`)
    .pipe(sass())
    .on('error', showErrors)
    .pipe(autoprefixer(['last 2 versions', '> 5%'], { cascade: true }))
    .pipe(gulpif(global.production, cssnano()))
    .pipe(gulp.dest(`${paths.dest}/css`))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('style-lint', () => {
  return gulp.src(`${paths.src}/stylesheets/**/*.scss`)
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
})

gulp.task('images', () => {
  return gulp.src(`${paths.src}/images/*.{svg,png,jpg}`)
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
    .pipe(gulp.dest(`${paths.dest}/img`))
})

gulp.task('icons', () => {
  return gulp.src(`${paths.src}/icons/*.svg`)
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
    .pipe(gulp.dest(path.resolve(__dirname, 'templates/_includes')))
})

gulp.task('static', () => {
  return gulp.src(`${paths.src}/static/*.{svg,png,jpg}`)
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
    .pipe(gulp.dest(path.resolve(__dirname)))
})

gulp.task('watch', () => {
  browserSync.init(config.browserSync)
  gulp.watch(`${paths.src}/stylesheets/**/*.scss`, ['styles'])
  gulp.watch(`${paths.src}/images/**/*.{svg,png,jpg}`, ['images'])
  gulp.watch(`${paths.src}/icons/*.svg`, ['icons'])
  gulp.watch(`${paths.src}/static/*.{svg,png,jpg}`, ['static'])
  gulp.watch([
    `${paths.src.dest}/js/*.js`,
    path.resolve(__dirname, 'templates/_includes')
  ]).on('change', reload)
})

gulp.task('default', ['watch'])

gulp.task('build', () => {
  global.production = true
  sequence(['styles', 'scripts', 'images', 'icons'])
})

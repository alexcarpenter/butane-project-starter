const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const svgstore = require('gulp-svgstore')
const gulpif = require('gulp-if')
const sequence = require('run-sequence')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const path = require('path')

global.production = false

const root = {
  src: 'src/',
  dest: 'public/assets/'
}

const config = {
  browserSync: {
    notify: false,
    proxy: 'domain.local'
  }
}

gulp.task('styles', () => {
  return gulp.src(`${root.src}/stylesheets/main.scss`)
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions', '> 5%'], { cascade: true }))
    .pipe(gulpif(global.production, cssnano()))
    .pipe(gulp.dest(`${root.dest}/css`))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('scripts', () => {
  return gulp.src([
      'node_modules/lazysizes/lazysizes.min.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest(`${root.dest}/js`))
})

gulp.task('images', () => {
  return gulp.src(`${root.src}/images/*.{svg,png,jpg}`)
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
    .pipe(gulp.dest(`${root.dest}/img`))
})

gulp.task('icons', () => {
  return gulp.src(`${root.src}/icons/*.svg`)
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
    .pipe(gulp.dest('templates/_includes'))
})

gulp.task('static', () => {
  return gulp.src(`${root.src}/static/*.{svg,png,jpg}`)
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
    .pipe(gulp.dest(public))
})

gulp.task('watch', () => {
  browserSync.init(config.browserSync)
  gulp.watch(`${root.src}/stylesheets/**/*.scss`, ['styles'])
  gulp.watch(`${root.src}/images/**/*.{svg,png,jpg}`, ['images'])
  gulp.watch(`${root.src}/icons/*.svg`, ['icons'])
  gulp.watch(`${root.src}/static/*.{svg,png,jpg}`, ['static'])
  gulp.watch([
    'templates/**/*.twig'
  ]).on('change', reload)
})

gulp.task('default', ['watch'])

gulp.task('build', () => {
  global.production = true
  sequence(['styles', 'scripts', 'images', 'icons'])
})

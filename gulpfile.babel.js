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
import cp from 'child_process'
import gutil from 'gulp-util'
import sequence from 'run-sequence'
import del from 'del'
import BrowserSync from 'browser-sync'

const browserSync = BrowserSync.create()

const paths = {
  styles: {
    entry: './src/stylesheets/main.scss',
    glob: './src/stylesheets/**/*.scss',
    dest: 'public/assets/css'
  },
  scripts: {
    glob: './src/javascripts/**/*.js'
  },
  images: {
    glob: './src/images/**/*',
    dest: './public/assets/img'
  },
  icons: {
    glob: './src/icons/**/*',
    dest: './public/assets/icons'
  },
  static: {
    glob: './src/static/*',
    dest: './public'
  },
  fonts: {
    glob: './src/fonts/*',
    dest: './public/assets/fonts'
  }
}

gulp.task('clean', () => {
  return del(['./public/assets/'])
})

gulp.task('styles', ['styles-lint'], () => {
  return gulp.src(paths.styles.entry)
    .pipe(gutil.env.type !== 'production' ? sourcemaps.init() : gutil.noop())
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions', '> 5%'], { cascade: true }))
    .pipe(gutil.env.type !== 'production' ? sourcemaps.write('maps') : gutil.noop())
    .pipe(gutil.env.type === 'production' ? cssnano() : gutil.noop())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream({ match: '**/*.css' }))
})

gulp.task('styles-lint', () => {
  return gulp.src(paths.styles.glob)
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
})

gulp.task('scripts', (cb) => {
  const myConfig = Object.assign({}, webpackConfig)

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }))
    browserSync.reload()
    cb()
  })
})

gulp.task('images', () => {
  return gulp.src(paths.images.glob)
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
    .pipe(gulp.dest(paths.images.dest))
})

gulp.task('icons', () => {
  return gulp.src(paths.icons.glob)
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
    .pipe(gulp.dest(paths.icons.dest))
})

gulp.task('files', () => {
  return gulp.src(paths.static.glob)
    .pipe(gulp.dest(paths.static.dest))
})

gulp.task('fonts', () => {
  return gulp.src(paths.fonts.glob)
    .pipe(gulp.dest(paths.fonts.dest))
})

gulp.task('watch', () => {
  browserSync.init({
    notify: false,
    server: { baseDir: 'public/' },
    // proxy: 'butane.local'
  })
  
  gulp.watch(paths.styles.glob, ['styles'])
  gulp.watch(paths.scripts.glob, ['scripts'])
  gulp.watch(paths.images.glob, ['images'])
  gulp.watch(paths.icons.glob, ['icons'])
})

gulp.task('build', () => {
  sequence('clean', ['styles', 'scripts', 'images', 'icons', 'fonts', 'files'])
})

// gulpfile.babel.js

// Globally expose config objects
global.PATH_CONFIG = require('./lib/path-config')
global.PRODUCTION = false

// Import gulp
import gulp from 'gulp'

// Import custom tasks
import clean from './tasks/clean'
import criticalcss from './tasks/critical'
import icons from './tasks/icons'
import images from './tasks/images'
import styles from './tasks/styles'

// Instantiate tasks
gulp.task('clean', clean)
gulp.task('criticalcss', criticalcss)
gulp.task('icons', icons)
gulp.task('images', images)
gulp.task('styles', styles)

export function watch () {
  gulp.watch(PATH_CONFIG.styles.glob, styles)
  gulp.watch(PATH_CONFIG.images.glob, images)
  gulp.watch(PATH_CONFIG.icons.glob, icons)
}
gulp.task('watch', watch)

// Build and minify files for production
PRODUCTION = true
const build = gulp.series(
  clean,
  styles,
  gulp.parallel(
    images,
    icons,
    criticalcss
  )
)
gulp.task('build', build)

// Define the default task
gulp.task('default', watch)

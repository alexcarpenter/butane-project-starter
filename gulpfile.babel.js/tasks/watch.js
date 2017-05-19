import gulp from 'gulp'
import images from
import styles from './styles'

export default function watch () {
  gulp.watch(PATH_CONFIG.styles.glob, styles)
  gulp.watch(PATH_CONFIG.images.glob, images)
  gulp.watch(PATH_CONFIG.icons.glob, icons)
}

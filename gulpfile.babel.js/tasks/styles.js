import gulp from 'gulp'
import gulpif from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'

export default function styles () {
  return gulp.src(PATH_CONFIG.styles.entry)
    .pipe(gulpif(!global.PRODUCTION, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer(['last 2 versions'], { cascade: true }))
    .pipe(gulpif(!global.PRODUCTION, sourcemaps.write('')))
    .pipe(gulpif(global.PRODUCTION, cssnano()))
    .pipe(gulp.dest(PATH_CONFIG.styles.dest))
}

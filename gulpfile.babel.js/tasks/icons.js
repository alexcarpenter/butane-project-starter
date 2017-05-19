import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
import svgstore from 'gulp-svgstore'

export default function icons () {
  return gulp.src(PATH_CONFIG.icons.glob, { since: gulp.lastRun(icons) })
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
    .pipe(gulp.dest(PATH_CONFIG.icons.dest))
}

import gulp from 'gulp'
import imagemin from 'gulp-imagemin'

export default function images () {
  return gulp.src(PATH_CONFIG.images.glob, { since: gulp.lastRun(images) })
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
    .pipe(gulp.dest(PATH_CONFIG.images.dest));
}

import gulp from 'gulp'
import critical from 'critical'

// Process data in an array synchronously, moving onto the n+1 item only after the nth item callback
function doSynchronousLoop(data, processData, done) {
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

// Process the critical path CSS one at a time
function processCriticalCSS(element, i, callback) {
  const criticalSrc = PATH_CONFIG.critical.url + element.url
  const criticalDest = PATH_CONFIG.critical.dest + element.template + '_critical.min.css'

  critical.generate({
    src: criticalSrc,
    dest: criticalDest,
    inline: false,
    ignore: [
      '@import'
    ],
    base: './public/',
    css: [
      './public/assets/css/main.css'
    ],
    minify: true,
    width: 1200,
    height: 1200
  }, (err, output) => {
    callback()
  })
}

// Critical css task
export default function criticalcss (callback) {
  doSynchronousLoop(PATH_CONFIG.critical.templates, processCriticalCSS, () => {
    // all done
    callback()
  })
}

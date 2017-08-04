import FontFaceObserver from 'fontfaceobserver'

/* global sessionStorage */

export default function () {
  if (sessionStorage.foutFontsLoaded) {
    document.documentElement.className += ' fonts-loaded'
    return
  }

  const normal = new FontFaceObserver('Source Sans Pro', {
    weight: 'normal',
    style: 'normal'
  })

  const italic = new FontFaceObserver('Source Sans Pro', {
    weight: 'normal',
    style: 'italic'
  })

  const semibold = new FontFaceObserver('Source Sans Pro', {
    weight: '700',
    style: 'normal'
  })

  Promise.all([
    normal.load(),
    italic.load(),
    semibold.load()
  ]).then(function () {
    document.documentElement.className += ' fonts-loaded'
    sessionStorage.foutFontsLoaded = true
  })
}

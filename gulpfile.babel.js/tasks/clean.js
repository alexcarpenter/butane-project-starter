import gulp from 'gulp'
import del from 'del'

const clean = () => del('./public/assets')
export default clean

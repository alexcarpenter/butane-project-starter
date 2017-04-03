import { One } from './modules/example.js'

One()

const arr = [
  'foo',
  'bar',
  'bar',
  'test',
  'test'
]

console.log(Array.from(new Set(arr)))

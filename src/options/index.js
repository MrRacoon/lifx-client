import init from './init'
import hsl from './hsl'
import color from './color'

export default function options (opts) {
  return [ init, hsl, color ]
    .map(fn => fn(opts))
    .reduce((acc, fn) => fn(acc), {})
}

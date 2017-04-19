import init from './init'
import hsl from './hsl'
import color from './color'
import selector from './selector'

export default function options (opts) {
  return [ init, selector, hsl, color ]
    .map(fn => fn(opts))
    .reduce((acc, fn) => fn(acc), {})
}

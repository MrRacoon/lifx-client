const pick = (obj, elems) =>
  elems.reduce((acc, k) => Object.assign({}, acc, { [k]: obj[k] }), {})

export default function init (opts) {
  return function _init (obj) {
    return Object.assign({}, obj, pick(opts, [
      'token',
      'toggle',
      'breathe', 'pulse',
      'from', 'cycles', 'persist', 'peak',
      'scene', 'listScenes',
      'status', 'notify',
      'verbose', 'version'
    ]), {
      power: opts.on ? 'on' : opts.off ? 'off' : undefined,
      duration: +(opts.duration || 0),
      period: +(opts.duration || 0)
    })
  }
}

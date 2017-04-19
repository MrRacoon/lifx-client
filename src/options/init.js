export default function init (opts) {
  return function _init (obj) {
    return Object.assign({}, obj, {
      token: opts.token,
      verbose: opts.verbose,
      status: opts.status,
      toggle: opts.toggle,
      notify: opts.notify,
      duration: opts.duration || 0,
      infrared: opts.infrared,
      kelvin: opts.kelvin,
      power: opts.on ? 'on' : opts.off ? 'off' : undefined
    })
  }
}

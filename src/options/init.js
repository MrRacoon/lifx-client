export default function init (opts) {
  return function _init (obj) {
    return Object.assign({}, obj, {
      token: opts.token,
      verbose: opts.verbose,
      status: opts.status,
      toggle: opts.toggle,
      notify: opts.notify,
      from: opts.from,
      cycles: opts.cycles,
      persist: opts.persist,
      duration: +(opts.duration || 0),
      period: +(opts.duration || 0),
      infrared: opts.infrared,
      kelvin: opts.kelvin,
      power: opts.on ? 'on' : opts.off ? 'off' : undefined,
      breathe: opts.breathe
    })
  }
}

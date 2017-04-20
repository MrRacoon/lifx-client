export default function init (opts) {
  return function _init (obj) {
    return Object.assign({}, obj, {
      token: opts.token,

      infrared: opts.infrared,
      kelvin: opts.kelvin,

      breathe: opts.breathe,
      pulse: opts.pulse,

      from: opts.from,
      cycles: opts.cycles,
      persist: opts.persist,
      duration: +(opts.duration || 0),
      period: +(opts.duration || 0),
      peak: opts.peak,

      scene: opts.listScenes,
      listScenes: opts.listScenes,

      status: opts.status,
      notify: opts.notify,
      power: opts.on ? 'on' : opts.off ? 'off' : undefined,
      toggle: opts.toggle,
      verbose: opts.verbose
    })
  }
}

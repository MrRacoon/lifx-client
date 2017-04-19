import colorParser from 'parse-color'

export default function hsl (opts) {
  return function _hsl (obj) {
    const { color, hue, saturation, brightness, kelvin } = opts
    const hsl = ((colorParser(color) || {}).hsl || [])
    return Object.assign({}, obj, {
      hue: hue || hsl[0] || undefined,
      saturation: (saturation || hsl[1]) / 100 || undefined,
      brightness: (brightness || hsl[2]) / 100 || undefined,
      kelvin: (kelvin || 0) * 65 || undefined
    })
  }
}

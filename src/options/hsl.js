import colorParser from 'parse-color'

export default function hsl (opts) {
  return function _hsl (obj) {
    const { color, hue, saturation, brightness, kelvin } = opts
    const hsl = ((colorParser(color) || {}).hsl || [])

    let ret = {}

    if (typeof hue !== 'undefined' || typeof hsl[0] !== 'undefined') {
      ret.hue = (hue || hsl[0])
    }

    if (typeof saturation !== 'undefined' || typeof hsl[1] !== 'undefined') {
      ret.saturation = (saturation || hsl[1]) / 100
    }

    if (typeof brightness !== 'undefined' || typeof hsl[2] !== 'undefined') {
      ret.brightness = (brightness || hsl[2]) / 100
    }

    if (typeof kelvin !== 'undefined') {
      ret.kelvin = (kelvin * 65) + 2500
    }

    return Object.assign({}, obj, ret)
  }
}

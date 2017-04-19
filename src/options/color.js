export default function color (opts) {
  return function (obj) {
    const { hue, saturation, brightness, kelvin } = obj
    const color =
      (hue ? `hue:${hue} ` : '') +
      (saturation ? `saturation:${saturation} ` : '') +
      (brightness ? `brightness:${brightness} ` : '') +
      (kelvin ? `kelvin:${kelvin} ` : '')
    return Object.assign({}, obj, { color })
  }
}

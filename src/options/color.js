export default function color (opts) {
  return function (obj) {
    const { hue, saturation, brightness, kelvin } = obj
    let color = ''

    if (typeof hue !== 'undefined') {
      color += `hue:${hue} `
    }

    if (typeof saturation !== 'undefined') {
      color += `saturation:${saturation} `
    }

    if (typeof brightness !== 'undefined') {
      color += `brightness:${brightness} `
    }

    if (typeof kelvin !== 'undefined') {
      color += `kelvin:${kelvin} `
    }

    return Object.assign({}, obj, { color })
  }
}

import colorParser from 'parse-color'

import getopt from 'node-getopt'
import rc from 'rc-yaml'

// import notify from './utils/notify'
// import { listLights, setState, togglePower } from './effects'
import choices from './effects'

const APP_NAME = 'lifx'

const commandlineConfig = getopt.create([
    ['c', 'config=ARG', 'Provide a lifx-client configuration file path for setting default settings'],
    // Auth
    ['k', 'token=ARG', 'the token in plainText'],
    // On/Off
    ['T', 'toggle', 'toggle the power of the bulbs'],
    ['1', 'on', 'turn on the lights'],
    ['0', 'off', 'turn off the lights'],
    // Attributes
    ['C', 'color=ARG', 'set color (blue, red, pink...)'],
    ['H', 'hue=ARG', 'set color using hue (0-360)'],
    ['K', 'kelvin=ARG', 'set kelvin (2500-9000)'],
    ['B', 'brightness=ARG', 'set brightness (0.0-1.0)'],
    ['S', 'saturation=ARG', 'set saturation (0.0-1.0)'],
    // Selectors
    ['i', 'id=ARG', 'select bulb(s) by id'],
    ['l', 'label=ARG', 'select bulb(s) by label'],
    ['g', 'group=ARG', 'select bulb(s) by group name'],
    ['p', 'location=ARG', 'select bulb(s) by location name'],
    // Mods
    ['d', 'duration=ARG', 'duration to make the change'],
    // Utility
    ['a', 'status', 'show the status of the lights'],
    ['o', 'logFile=ARG', 'specify a log file to use (default: /tmp/lifx-cli.log)'],
    ['h', 'help', 'display this help'],
    ['n', 'notify', 'provide a system notification with details about the changes'],
    ['v', 'verbose', 'Log out verbose messages to the screen'],
    ['', 'changeString', 'Return the string that would be used in the Api to modify bulb state']
])
  .bindHelp()
  .parseSystem()
  .options

const o = Object.assign(rc(APP_NAME), commandlineConfig)

if (!o.token) {
  console.log('Please provide a token, try lifx -h for more info')
  process.exit(1)
}

// =============================================================================

const hsl = ((colorParser(o.color) || {}).hsl || [])

const hue = o.hue || hsl[0] || undefined
const saturation = (o.saturation || hsl[1]) / 100 || undefined
const brightness = (o.brightness || hsl[2]) / 100 || undefined
const kelvin = (o.kelvin) * 65 || undefined

const colorString =
  (hue ? `hue:${hue} ` : '') +
  (saturation ? `saturation:${saturation} ` : '') +
  (brightness ? `brightness:${brightness} ` : '') +
  (kelvin ? `kelvin:${kelvin} ` : '')

const selection = (o.id && `id:${o.id}`) ||
  (o.label && `label:${o.label}`) ||
  (o.group && `group:${o.group}`) ||
  (o.location && `location:${o.location}`) ||
  'all'

const info = {
  token: o.token,
  verbose: o.verbose,
  status: o.status,
  toggle: o.toggle,
  notify: o.notify,
  selection,
  color: colorString,
  brightness,
  duration: o.duration || 0,
  infrared: o.infrared,
  kelvin: o.kelvin,
  power: o.on ? 'on' : o.off ? 'off' : undefined
}

choices.reduce(
  (prom, fn) => prom.then(fn),
  Promise.resolve(info)
).catch(msg => {
  console.log(msg)
  return msg
})

// // Selection
// const selection =
//   (o.id && `id:${o.id}`) ||
//   (o.label && `label:${o.label}`) ||
//   (o.group && `group:${o.group}`) ||
//   (o.location && `location:${o.location}`) ||
//   "all"
//
// // Color State
// const parsedColor = colorParser(o.color)
//
// console.log('parsedColor', parsedColor);
//
// const [a, b, c] = parsedColor.hsl
// const { hue = a, saturation = b, brightness = c } = o
//
// if (changeString.length > 0) {
//   o.notify && notify(changeString)
//   lifx.setColor(selection, changeString, o.duration, o.on, log)
// }
//
// if (o.toggle) {
//   o.notify && notify("Toggling lights")
//   lifx.togglePower(selection, log)
// } else if (o.off) {
//   o.notify && notify("Turning lights off")
//   lifx.setPower(selection, "off", 1.0, log)
// } else if (o.on) {
//   o.notify && notify("Turning lights on")
//   lifx.setPower(selection, "on", 1.0, log)
// }

import getopt from 'node-getopt'
import rc from 'rc-yaml'

import notify from './utils/notify'
import effects from './effects'
import options from './options'

const APP_NAME = 'lifx'

const commandlineConfig = getopt.create([
  // Auth
  ['k', 'token=STRING', 'the token in plainText'],
  // On/Off
  ['T', 'toggle', 'toggle the power of the bulbs'],
  ['1', 'on', 'turn on the lights'],
  ['0', 'off', 'turn off the lights'],
  // Attributes
  ['C', 'color=STRING', 'set color (blue, red, pink...)'],
  ['H', 'hue=FLOAT', 'set color using hue (0-360)'],
  ['K', 'kelvin=FLOAT', 'set kelvin (0-100)'],
  ['B', 'brightness=FLOAT', 'set brightness (0-100)'],
  ['S', 'saturation=FLOAT', 'set saturation (0-100)'],
  ['I', 'infrared=FLOAT', 'set infrared (0-100)'],
  // Selectors
  ['i', 'id=STRING', 'select bulb(s) by id'],
  ['l', 'label=STRING', 'select bulb(s) by label'],
  ['g', 'group=STRING', 'select bulb(s) by group name'],
  ['L', 'location=STRING', 'select bulb(s) by location name'],
  // Routines
  ['b', 'breathe', 'make the lights do a breathe effect'],
  ['p', 'pulse', 'make the lights do a pulse effect'],
  // Mods
  ['d', 'duration=FLOAT', 'duration/period of time for transitions'],
  ['P', 'persist', 'If true leave the last effect color. (breathe, pulse)'],
  ['f', 'from=ARG', 'The color to start the effect from. defaults to current color (breathe, pulse)'],
  ['y', 'cycles=FLOAT', 'The number of times to repeat the effect. (breathe, pulse)'],
  ['e', 'peak=FLOAT', 'Defines where in a period the target color is at its maximum. (breathe)'],
  // scenet
  ['c', 'scene=UUID', 'activate the scene via uuid'],
  ['', 'listScenes', 'show the currently known set of scenes'],
  // Utility
  ['a', 'status', 'show the status of the lights'],
  ['h', 'help', 'display this help'],
  ['n', 'notify', 'provide a system notification with details about the changes'],
  ['v', 'verbose', 'Log out verbose messages to the screen'],
  ['V', 'version', 'show the current version']
])
  .bindHelp()
  .parseSystem()
  .options

const o = Object.assign(rc(APP_NAME), commandlineConfig)
const opts = options(o)

opts.verbose && console.log('opts', opts)

if (opts.version) {
  const packageJson = require('../package.json')
  console.log('lifx-client version:', packageJson.version)
  process.exit(0)
}

if (!opts.token) {
  console.log('Please provide a token, try lifx -h for more info')
  process.exit(1)
}

effects.reduce(
  (prom, fn) => prom.then(fn),
  Promise.resolve(opts)
)
.then(json => {
  return Promise.reject({ type: 'no match', json }) // eslint-disable-line
})
.catch(msg => {
  console.log(JSON.stringify(msg, null, 2))
  opts.notify && notify(opts, msg)
  return msg
})

import getopt from 'node-getopt'
import rc from 'rc-yaml'

import effects from './effects'
import options from './options'

const APP_NAME = 'lifx'

const commandlineConfig = getopt.create([
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
    ['L', 'location=ARG', 'select bulb(s) by location name'],
    // Routines
    ['b', 'breathe', 'make the lights do a breathe effect'],
    // Mods
    ['p', 'persist', 'finish the routine with the to_color (breathe)'],
    ['f', 'from=ARG', 'color to start the routine with (breathe)'],
    ['d', 'duration=ARG', 'duration/periods to make the change'],
    ['y', 'cycles=ARG', 'number of cycles (breathe)'],
    // Utility
    ['a', 'status', 'show the status of the lights'],
    ['h', 'help', 'display this help'],
    ['n', 'notify', 'provide a system notification with details about the changes'],
    ['v', 'verbose', 'Log out verbose messages to the screen']
])
  .bindHelp()
  .parseSystem()
  .options

const o = Object.assign({}, rc(APP_NAME), commandlineConfig)
const opts = options(o)

if (!opts.token) {
  console.log('Please provide a token, try lifx -h for more info')
  process.exit(1)
}

opts.verbose && console.log('opts', opts)

effects.reduce(
  (prom, fn) => prom.then(fn),
  Promise.resolve(opts)
).then(opts => {
  return Promise.reject({ type: 'no match', opts }) // eslint-disable-line
}).catch(msg => {
  console.log(msg)
  return msg
})

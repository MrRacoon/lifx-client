import getopt from 'node-getopt'
import rc from 'rc-yaml'

// import notify from './utils/notify'
// import { listLights, setState, togglePower } from './effects'
import choices from './effects'
import options from './options'

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
const opts = options(o)

if (!opts.token) {
  console.log('Please provide a token, try lifx -h for more info')
  process.exit(1)
}

// =============================================================================

opts.verbose && console.log('opts', opts)

choices.reduce(
  (prom, fn) => prom.then(fn),
  Promise.resolve(opts)
).catch(msg => {
  console.log(msg)
  return msg
})

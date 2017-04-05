import fs from 'fs'
import lifxObj from 'lifx-api'
import notifier from 'node-notifier'
import path from 'path';
import _ from 'lodash/fp'
import colorParser from 'parse-color'
import getopt from 'node-getopt'

const icon = path.join(__dirname + '../images/icon.png')

const log = console.log.bind(console)

const commandlineConfig = getopt.create([
    ['c'  ,  'config=ARG'     ,  'Provide a lifxcli configuration file path for setting default settings'],
    // Auth
    ['k'  ,  'token=ARG'      ,  'the token in plainText'],
    // On/Off
    ['T'  ,  'toggle'         ,  'toggle the power of the bulbs'],
    ['1'  ,  'on'             ,  'turn on the lights'],
    ['0'  ,  'off'            ,  'turn off the lights'],
    // Attributes
    ['C'  ,  'color=ARG'      ,  'set color (blue, red, pink...)'],
    ['H'  ,  'hue=ARG'        ,  'set color using hue (0-360)'],
    ['K'  ,  'kelvin=ARG'     ,  'set kelvin (2500-9000)'],
    ['B'  ,  'brightness=ARG' ,  'set brightness (0.0-1.0)'],
    ['S'  ,  'saturation=ARG' ,  'set saturation (0.0-1.0)'],
    // Selectors
    ['i'  ,  'id=ARG'         ,  'select bulb(s) by id'],
    ['l'  ,  'label=ARG'      ,  'select bulb(s) by label'],
    ['g'  ,  'group=ARG'      ,  'select bulb(s) by group name'],
    ['p'  ,  'location=ARG'   ,  'select bulb(s) by location name'],
    // Mods
    ['d'  ,  'duration=ARG'   ,  'duration to make the change'],
    // Utility
    ['a'  ,  'status'         ,  'show the status of the lights'],
    ['o'  ,  'logFile=ARG'    ,  'specify a log file to use (default: /tmp/lifx-cli.log)' ],
    ['h'  ,  'help'           ,  'display this help'],
    ['n'  ,  'notify'         ,  'provide a system notification with details about the changes'],
    ['v'  ,  'verbose'        ,  'Log out verbose messages to the screen' ],
    [''   ,  'changeString'   ,  'Return the string that would be used in the Api to modify bulb state' ]
  ])
  .bindHelp()
  .parseSystem()
  .options

const homeDirectory =
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

const defaultConfigFile =
  commandlineConfig.config || homeDirectory + '/.config/lifxcli'

const makeConfig =
  _.compose(JSON.parse, fs.readFileSync)

let o
try {
  o = _.merge(makeConfig(defaultConfigFile), commandlineConfig)
} catch (err) {
  log(err)
  process.exit(1)
}

const lifx = new lifxObj(o.token)

log('status');
if (o.status) {
  try {
    lifx.listLights('all', body => log('body', body))
    process.exit(0)
  } catch (e) {
    console.error(e);
    process.exit(1)
  }
}

const notify = (message) =>
  o.notify && notifier.notify({
    title: 'Lifx-cli',
    message,
    icon,
    time: 1
  })


// Selection
const selection =
  (o.id && `id:${o.id}`) ||
  (o.label && `label:${o.label}`) ||
  (o.group && `group:${o.group}`) ||
  (o.location && `location:${o.location}`) ||
  "all"

// Color State
const parsedColor = colorParser(o.color)
if (parsedColor.hsl) {
  [a, b, c]    = parsedColor.hsl
  o.hue        = o.hue        || a
  o.saturation = o.saturation || b
  o.brightness = o.brightness || c
}

// Create the color change string that we will feed into the API
let changeString = ""
if (o.kelvin) {
  changeString += `kelvin:${(o.kelvin / 100) * 6500} `
} else {
  if (o.hue) {
    changeString += `hue:${o.hue} `
  }
  if (o.saturation) {
    changeString += `saturation:${o.saturation / 100} `
  }
  if (o.brightness) {
    changeString += `brightness:${o.brightness / 100} `
  }
}

const setProp = (prop, sel="all", dur=1, power=false, cb=log) =>
  lifx.setColor(sel, prop, dur, power, cb)

if (changeString.length > 0) {
  notify(changeString)
  setProp(changeString, selection, o.duration, o.on, log)
}

if (o.toggle) {
  notify("Toggling lights")
  lifx.togglePower(selection, cb)
} else if (o.off) {
  notify("Turning lights off")
  lifx.setPower(selection, "off", 1.0, log)
} else if (o.on) {
  notify("Turning lights on")
  lifx.setPower(selection, "on", 1.0, log)
}

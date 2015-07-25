
## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

Alias for the `console.log` function

    log = console.log

## Command Line Argument Parsing

    opts = require 'node-getopt'
        .create [
            ['t' ,  'token=ARG'      ,  'the token in plainText'],
            [''  ,  'toggle[=ARG]'   ,  'toggle the power of the bulbs'],
            [''  ,  'on[=SELECTOR]'  ,  'turn on the lights'],
            [''  ,  'off[=ARG]'      ,  'turn off the lights'],
            ['s' ,  'status'         ,  'show the status of the lights'],
            [''  ,  'color=ARG'      ,  'set color (blue, red, pink...)'],
            [''  ,  'hue=ARG'        ,  'set color using hue (0-360)'],
            [''  ,  'rgb=ARG'        ,  'set color using rgb (#RRGGBB)'],
            [''  ,  'kelvin=ARG'     ,  'set kelvin (2500-9000)'],
            [''  ,  'brightness=ARG' ,  'set brightness (0.0-1.0)'],
            [''  ,  'saturation=ARG' ,  'set saturation (0.0-1.0)'],
            [''  ,  'bright+'        ,  'increase the brightness'],
            [''  ,  'bright-'        ,  'decrease the brightness'],
            ['h' ,  'help'           ,  'display this help']
        ]
        .bindHelp()
        .parseSystem()


make an alias to the options for convinience

    o = opts.options

## Getting the token

    if (opts.options.token)
        token = opts.options.token
    else
        fs           = require 'fs'
        home         = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
        fileContents = fs.readFileSync (home + '/.lifx_token')
        tokenObj     = JSON.parse fileContents
        token        = tokenObj.token

Initialize it with the token

    lifx = new lifxObj token

## Handy functions

Get and set the status of the lights

    getStatus = (cb=log) ->
        log 'Getting Status'
        lifx.listLights 'all', cb

Turn the lights on or off

    power = (selector, state, duration=1.0, cb=log) ->
        if (selector == '')
            selector = "all"
        if (state == undefined)
            log 'toggling bulbs'
            lifx.togglePower selector, cb
        else
            log "turning bulbs ", state
            lifx.setPower selector, state, duration, cb

Set a property of a bulb

    setProp = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        log 'Setting bulb(s) ' + sel + ' to state ' + prop
        lifx.setColor sel, prop, dur, power, cb

## Putting all the logic together

Toggle the lights on/off

    if ! (o.toggle == undefined)
        power o.toggle, undefined

Power the lights on

    if ! (o.on == undefined)
        power o.on, "on"

Power the lights off

    if ! (o.off == undefined)
        power o.off, "off"

Get the status of the lights

    if ! (o.status == undefined)
        getStatus()

Set attributes light color, brightness, etc... 

    if !(o.color == undefined)
        setProp o.color

    if !(o.hue == undefined)
        setProp 'hue:' + o.hue

    if !(o.rgb == undefined)
        setProp '#' + o.rgb

    if !(o.saturation == undefined)
        setProp 'saturation:' + o.saturation

    if !(o.kelvin == undefined)
        setProp 'kelvin:' + o.kelvin

    if !(o.brightness == undefined)
        setProp 'brightness:' + o.brightness




## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

Alias for the `console.log` function

    log = console.log

Command Line Argument Parsing

    args = process.argv
    log args

    opts = require 'node-getopt'
        .create [
            ['t' ,  'token=ARG'      ,  'the token in plainText'],
            [''  ,  'on[=SELECTOR]'  ,  'turn on the lights'],
            [''  ,  'off[=ARG]'      ,  'turn off the lights'],
            ['s' ,  'status'         ,  'show the status of the lights'],
            [''  ,  'color=ARG'      ,  'set color (blue, red, pink...)'],
            [''  ,  'hue=ARG'        ,  'set color using hue (0-360)'],
            [''  ,  'rgb=ARG'        ,  'set color using rgb (#RRGGBB)'],
            [''  ,  'kelvin=ARG'     ,  'set kelvin (2500-9000)'],
            [''  ,  'brightness=ARG' ,  'set brightness (0.0-1.0)'],
            [''  ,  'saturation=ARG' ,  'set saturation (0.0-1.0)'],
            ['h' ,  'help'           ,  'display this help']
        ]
        .bindHelp()
        .parseSystem()

    log opts

    o = opts.options


Get the token

    if (opts.options.token)
        token = opts.options.token
    else
        fs           = require 'fs'
        home         = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
        fileContents = fs.readFileSync (home + '/.lifx_token')
        tokenObj     = JSON.parse fileContents
        token        = tokenObj.token


    console.log 'token is: ', token

Initialize it with the token

    lifx = new lifxObj token

# Handy functions

Get and set the status of the lights

    getStatus = () ->
        log 'Getting Status'
        lifx.listLights 'all', (body) ->
            log body

Turn the lights on or off

    power = (st, dur, sel) ->
        selector = sel || "all"
        state    = st ? "on" : "off"
        log "turning bulbs ", state
        lifx.setPower selector, state, dur, log

Turn the bulbs on

    powerOn = (dur) ->
        power "on", dur, opts.options.on

Turn the bulbs off 

    powerOff = (dur) ->
        power "off", dur, opts.options.off

Set a property of a bulb

    setColor = (col, sel="all", dur=1.0, power=false) ->
        lifx.setColor sel, col, dur, power, log




## Putting all the logic together


Power the lights on

    if ! (opts.options.on == undefined)
        powerOn(1.0)

Power the lights off

    if ! (opts.options.off == undefined)
        powerOff(1.0)

Get the status of the lights

    if ! (opts.options.status == undefined)
        getStatus()

Set attributes light color, brightness, etc... 

    if !(o.color == undefined)
        setColor o.color

    if !(o.hue == undefined)
        setColor 'hue:' + o.hue

    if !(o.rgb == undefined)
        setColor '#' + o.rgb

    if !(o.saturation == undefined)
        setColor 'saturation:' + o.saturation

    if !(o.kelvin == undefined)
        setColor 'kelvin:' + o.kelvin

    if !(o.brightness == undefined)
        setColor 'brightness:' + o.brightness



## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

Require the fs library for file handling

    fs      = require 'fs'

Alias for the `console.log` function

    writeToLogFile = (args...) ->
        logFile = '/tmp/lifx-cli.log'
        fs.appendFile logFile, args.concat(['\n']).join(' ')


    log = (args...) ->
        addTime = [new Date()].concat(args)
        writeToLogFile addTime
        console.log.apply null, addTime

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
            [''  ,  'brightnessUp'   ,  'increase the brightness'],
            [''  ,  'brightnessDown' ,  'decrease the brightness'],
            [''  ,  'kelvinUp'       ,  'increase the kelvin'],
            [''  ,  'kelvinDown'     ,  'decrease the kelvin'],
            [''  ,  'saturationUp'   ,  'increase the saturation'],
            [''  ,  'saturationDown' ,  'decrease the saturation'],
            ['h' ,  'help'           ,  'display this help']
        ]
        .bindHelp()
        .parseSystem()


make an alias to the options for convinience

    o = opts.options

    log o

## Getting the token

    if (opts.options.token)
        token = opts.options.token
    else
        home         = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
        fileContents = fs.readFileSync (home + '/.lifx_token')
        tokenObj     = JSON.parse fileContents
        token        = tokenObj.token

Initialize it with the token

    lifx = new lifxObj token

## Handy functions

Get and set the status of the lights

    getStatus = (cb=log) ->
        log "Getting Status"
        lifx.listLights 'all', cb

Turn the lights on or off

    power = (selector, state, duration=1.0, cb=log) ->
        if (selector == '')
            selector = "all"
        if (state == undefined)
            log "toggling bulbs"
            lifx.togglePower selector, cb
        else
            log "turning bulbs #{state}"
            lifx.setPower selector, state, duration, cb

Set a property of a bulb

    setProp = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        log "Setting bulb(s) #{sel} to state #{prop}"
        lifx.setColor sel, prop, dur, power, cb

    setColor = setProp

    setHue = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp "hue:#{prop}", sel, dur, power, cb

    setRGB = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp "rgb:##{prop}", sel, dur, power, cb

    setBrightness = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp "brightness:#{prop}", sel, dur, power, cb

    setKelvin = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp "kelvin:#{prop}", sel, dur, power, cb

    setSaturation = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp "saturation:#{prop}", sel, dur, power, cb

## Putting all the logic together

Toggle the lights on/off

    if ! (o.toggle == undefined)
        power o.toggle

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
        setColor o.color

    if !(o.hue == undefined)
        setHue o.hue

    if !(o.rgb == undefined)
        setRGB o.rgb

    if !(o.saturation == undefined)
        setSaturation o.saturation

    if !(o.kelvin == undefined)
        setKelvin o.kelvin

    if !(o.brightness == undefined)
        setBrightness o.brightness

## State modifications

Below are high level interfaces to modify the current state by slight
differences. For instance, turning up the current brightness as opposed to
setting it to a specific value.

The payload from `getStatus` returns the following list of objects denoting a
bulbs current state:

```json
[
  {
      "id": "d3b2f2d97452",
      "uuid": "8fa5f072-af97-44ed-ae54-e70fd7bd9d20",
      "label": "Left Lamp",
      "connected": true,
      "power": "on",
      "color": {
            "hue": 250.0,
            "saturation": 0.5,
            "kelvin": 3500
          },
      "brightness": 0.5,
      "group": {
            "id": "1c8de82b81f445e7cfaafae49b259c71",
            "name": "Lounge"
          },
      "location": {
            "id": "1d6fe8ef0fde4c6d77b0012dc736662c",
            "name": "Home"
          },
      "last_seen": "2015-03-02T08:53:02.867+00:00",
      "seconds_since_seen": 0.002869418
    }
]

```

Couple functions to get information from a bulb, will come into play later

We first wrap get status with a higher order function to modify this payload.
We will expect that functions passed into it expect one bulb entry at a time.

    modify = (func) ->
        getStatus (payload) ->
            arr = JSON.parse payload
            arr.forEach(func)

    changeAttribute = (config, isAdd) ->
        (bulb) ->
            id  = bulb.id
            log "id is #{id}"

            cur = config.current bulb
            log "cur is #{cur}"

            if (isAdd)
                stp = config.step
            else
                stp = 0-config.step
            log "stp is #{stp}"

            nex = cur + stp
            log "nex is #{nex}"

            if (nex < config.max && nex > config.min)
                config.change nex, id
            else if (stp > 0)
                log "Hit Maximum bound"
                config.change 1.0, id
            else
                log "Hit Minimum bound"
                config.change 0.0, id

Brightness adjustments

    getBrightness = (bulb) -> bulb.brightness

    brightnessAdjustments =
        change : setBrightness
        current: getBrightness
        step   : 0.1
        min    : 0.0
        max    : 1.0

    if o.brightnessUp
        increaseBrightness = changeAttribute brightnessAdjustments, true
        modify increaseBrightness

    if o.brightnessDown
        decreaseBrightness = changeAttribute brightnessAdjustments, false
        modify decreaseBrightness

Kelvin adjustments

    getKelvin = (bulb) -> bulb.color.kelvin

    kelvinAdjustments =
        change : setKelvin
        current: getKelvin
        step   : 500
        min    : 2500
        max    : 9000

    if o.kelvinUp
        increaseKelvin = changeAttribute kelvinAdjustments, true
        modify increaseKelvin

    if o.kelvinDown
        decreaseKelvin = changeAttribute kelvinAdjustments, false
        modify decreaseKelvin

Hue adjustments

    getHue = (bulb) -> bulb.color.hue

    hueAdjustments =
        change : setHue
        current: getHue
        step   : 45
        min    : 0
        max    : 360

    if o.hueUp
        increaseHue = changeAttribute hueAdjustments, true
        modify increaseHue

    if o.hueDown
        decreaseHue = changeAttribute hueAdjustments, false
        modify decreaseHue

Saturation adjustments

    getSaturation = (bulb) -> bulb.color.saturation

    saturationAdjustments =
        change : setSaturation
        current: getSaturation
        step   : 500
        min    : 2500
        max    : 9000

    if o.saturationUp
        increaseSaturation = changeAttribute saturationAdjustments, true
        modify increaseSaturation

    if o.saturationDown
        decreaseSaturation = changeAttribute saturationAdjustments, false
        modify decreaseSaturation


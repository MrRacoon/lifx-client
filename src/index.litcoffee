
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
            [''  ,  'brightUp'       ,  'increase the brightness'],
            [''  ,  'brightDown'     ,  'decrease the brightness'],
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

    setcolor = setProp

    setBrightness = (prop, sel="all", dur=1.0, power=true, cb=log) ->
        setProp ('brightness:' + prop), sel, dur, power, cb

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

We first wrap get status with a higher order function to modify this payload.
We will expect that functions passed into it expect one bulb entry at a time.

    modify = (func) ->
        getStatus (payload) ->
            arr = JSON.parse payload
            arr.forEach(func)


    changeBrightness = (step) ->
        (bulb) ->
            id  = bulb.id
            log 'id', id

            cur = bulb.brightness
            log 'cur', cur

            nex = cur + step
            log 'nex', nex

            if (nex < 1.0 && nex > 0.0)
                setBrightness nex, id
            else if (step > 0)
                setBrightness 1.0, id
            else
                setBrightness 0.0, id


    increaseBrightness = changeBrightness(0.1)
    decreaseBrightness = changeBrightness(-0.1)

    if !(o.brightUp == undefined)
        modify increaseBrightness

    if !(o.brightDown == undefined)
        modify decreaseBrightness



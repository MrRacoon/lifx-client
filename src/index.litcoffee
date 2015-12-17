
## LIFX-Client

    fs       = require 'fs'
    lifxObj  = require 'lifx-api'
    notifier = require 'node-notifier'
    path     = require 'path'
    R        = require 'ramda'

    colorParser = require 'parse-color'

    lifxclIcon = path.join(__dirname + '/images/icon.png')

    commandlineConfig = require 'node-getopt'
        .create [
            # Config
            ['c'  ,  'config=ARG'     ,  'Provide a lifxcli configuration file path for setting default settings'],
            # Auth
            ['k'  ,  'token=ARG'      ,  'the token in plainText'],
            # On/Off
            ['T'  ,  'toggle'         ,  'toggle the power of the bulbs'],
            ['1'  ,  'on'             ,  'turn on the lights'],
            ['0'  ,  'off'            ,  'turn off the lights'],
            # Attributes
            ['C'  ,  'color=ARG'      ,  'set color (blue, red, pink...)'],
            ['H'  ,  'hue=ARG'        ,  'set color using hue (0-360)'],
            ['K'  ,  'kelvin=ARG'     ,  'set kelvin (2500-9000)'],
            ['B'  ,  'brightness=ARG' ,  'set brightness (0.0-1.0)'],
            ['S'  ,  'saturation=ARG' ,  'set saturation (0.0-1.0)'],
            # Selectors
            ['i'  ,  'id=ARG'         ,  'select bulb(s) by id'],
            ['l'  ,  'label=ARG'      ,  'select bulb(s) by label'],
            ['g'  ,  'group=ARG'      ,  'select bulb(s) by group name'],
            ['p'  ,  'location=ARG'   ,  'select bulb(s) by location name'],
            # Mods
            ['d'  ,  'duration=ARG'   ,  'duration to make the change'],
            # Utility
            ['a'  ,  'status'         ,  'show the status of the lights'],
            ['o'  ,  'logFile=ARG'    ,  'specify a log file to use (default: /tmp/lifx-cli.log)' ],
            ['h'  ,  'help'           ,  'display this help'],
            ['n'  ,  'notify'         ,  'provide a system notification with details about the changes']
            ['v'  ,  'verbose'        ,  'Log out verbose messages to the screen' ]
            [''   ,  'changeString'   ,  'Return the string that would be used in the Api to modify bulb state' ]
        ]
        .bindHelp()
        .parseSystem()
        .options

    homeDirectory      = process.env.HOME or process.env.HOMEPATH or process.env.USERPROFILE
    defaultConfigFile  = commandlineConfig.config or homeDirectory + '/.config/lifxcli'
    makeConfig         = R.compose JSON.parse, fs.readFileSync

    try
        o = R.merge (makeConfig defaultConfigFile), commandlineConfig
    catch err
        console.log err
        return

    lifx = new lifxObj o.token

    if o.status?
        lifx.listLights 'all', console.log
        return # Exit immediately

    log = (args) ->
        console.log args
        logFile = o.logFile or '/tmp/lifx-cli.log'
        str     = "#{new Date()} #{args.join ' '}"
        fs.appendFile logFile, str
        if o.verbose?
            console.log str

    notify = (message) ->
        if o.notify?
            notifier.notify {
                title: 'Lifx-cli',
                message: message,
                icon: lifxclIcon
                time: 1
            }


    # Selection
    selection = switch
        when o.id?
            "id:#{o.id}"
        when o.label?
            "label:#{o.label}"
        when o.group?
            "group:#{o.group}"
        when o.location?
            "location:#{o.location}"
        else
            "all"

    # Color State
    parsedColor = colorParser o.color

    if parsedColor.hsl?
        [a, b, c]    = parsedColor.hsl
        o.hue        = o.hue        or a
        o.saturation = o.saturation or b
        o.brightness = o.brightness or c

    o.saturation = o.saturation / 100 if o.saturation
    o.brightness = o.brightness / 100 if o.brightness
    o.kelvin     = ((o.kelvin / 100) * 6500) + 2500 if o.kelvin

    # Create the color change string that we will feed into the API
    changeString = ""

    if o.kelvin?
        changeString += "kelvin:#{o.kelvin}"
    else
        changeString += "hue:#{o.hue} " if o.hue?
        changeString += "saturation:#{o.saturation} " if o.saturation?
        changeString += "brightness:#{o.brightness} " if o.brightness?

    setProp = (prop, sel="all", dur=1.0, power=false, cb=console.log) ->
        lifx.setColor sel, prop, dur, power, cb

    if changeString.length > 0
        notify changeString
        setProp changeString, selection, o.duration, o.on, console.log

    if o.toggle?
        notify "toggling lights"
        lifx.togglePower selection, cb

    else if o.off?
        notify "Turning lights off"
        lifx.setPower selection, "off", 1.0, console.log

    else if o.on?
        notify "Turning lights on"
        lifx.setPower selection, "on", 1.0, console.log


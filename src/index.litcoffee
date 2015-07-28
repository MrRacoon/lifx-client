## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

A color parser

    colorParser = require 'parse-color'

Require the fs library for file handling

    fs      = require 'fs'


## Command Line Argument Parsing

    opts = require 'node-getopt'
        .create [
            # Auth
            ['t'  ,  'token=ARG'      ,  'the token in plainText'],
            ['f'  ,  'tokenFile=ARG'  ,  'the file that houses the lifx token in json format'],
            # On/Off
            ['T'  ,  'toggle'         ,  'toggle the power of the bulbs'],
            ['1'  ,  'on'             ,  'turn on the lights'],
            ['0'  ,  'off'            ,  'turn off the lights'],
            # Attributes
            ['c'  ,  'color=ARG'      ,  'set color (blue, red, pink...)'],
            ['h'  ,  'hue=ARG'        ,  'set color using hue (0-360)'],
            ['k'  ,  'kel=ARG'        ,  'set kelvin (2500-9000)'],
            ['b'  ,  'bri=ARG'        ,  'set brightness (0.0-1.0)'],
            ['s'  ,  'sat=ARG'        ,  'set saturation (0.0-1.0)'],
            # Selectors
            ['i'  ,  'id=ARG'         ,  'select bulb(s) by id'],
            ['l'  ,  'lab=ARG'        ,  'select bulb(s) by label'],
            ['g'  ,  'grp=ARG'        ,  'select bulb(s) by group name'],
            ['p'  ,  'loc=ARG'        ,  'select bulb(s) by location name'],
            # Mods
            ['d'  ,  'dur=ARG'        ,  'duration to make the change'],
            # Utility
            ['s'  ,  'status'         ,  'show the status of the lights'],
            ['o'  ,  'logFile=ARG'    ,  'specify a log file to use (default: /tmp/lifx-cli.log)' ],
            ['h'  ,  'help'           ,  'display this help'],
            ['v'  ,  'verbose'        ,  'Log out verbose messages to the screen' ]
        ]
        .bindHelp()
        .parseSystem()

I like me a good `console.log` alias. Here we decorate it with things like
verbosity checking and logging to a file in tmp (or some other file specified
by the `--logFile` flag)

    writeToLogFile = (args...) ->
        logFile = o.logFile or '/tmp/lifx-cli.log'
        str     = args
            .concat ['\n']
            .join ' '
        fs.appendFile logFile, str

    log = (args...) ->
        addTime = [new Date()].concat(args)
        writeToLogFile addTime
        if verbose
            console.log.apply null, addTime

Make an alias to the options for convenience, and also check and set the
verbosity level of the app.

    o       = opts.options
    verbose = o.verbose

## Getting the token

Check to see if a token was specified in the arguments. If not, let's look for
it on disk. Check to see if the user specified a file to look in, otherwise
default to `~/.lifx_token`

    if o.token?
        token = o.token
    else
        home         = process.env.HOME or process.env.HOMEPATH or process.env.USERPROFILE
        fileLocation = o.tokenFile or home + '/.lifx_token'

Make an attempt to open the file and log the error if the action is
unsuccessful. Without the token this app is useless, so if an error occurs, we
will immediately halt execution.

        try
            fileContents = fs.readFileSync fileLocation
        catch err
            log err
            return

At this point the file exists, so let's see if it is JSON, and if so, get the
token property from the parsed object. Otherwise, assume that the contents of
the file was the raw token and clean it up a bit.

        try
            tokenObj = JSON.parse fileContents
            token    = tokenObj.token
        catch e
            token    = fileContents
                .replace /\r?\n|\r/, ''
                .replace /\w/, ''

Finally, initialize the lifx object wit our token. Now we are ready to send out
some instructions!

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

        if state?
            nex = if state then "on" else "off"
            log "turning bulbs #{nex}"
            lifx.setPower selector, nex, duration, cb
        else
            log "toggling bulbs"
            lifx.togglePower selector, cb

Set a property of a bulb

    setProp = (prop, sel="all", dur=1.0, power=false, cb=log) ->
        log "Setting bulb(s) #{sel} to state #{prop}"
        lifx.setColor sel, prop, dur, power, cb

## Putting all the logic together

    if ! (o.status == undefined)
        getStatus()
        return # Exit immediately

## State modifications (Take Two)

Listen all this stuff above me is all well and good, but how lame is it that we
have to make multiple API calls for one command involving multiple attribute
changes? Short answer: Really.

Let's do something more tricky. How about an object that collects information
about the next state change from the arguments, and applies them in one go
using some opinions?

Yeah!

    class ColorState
        constructor: (ops) ->
            # A color name takes precedence, since we can extract information
            # about brightness or saturation
            obj = colorParser ops.color
            if obj.hsl?
                {@dur, @kel}       = ops
                [@hue, @sat, @bri] = obj.hsl
                @hue               = ops.hue if ops.hue?
                @sat               = ops.sat if ops.sat?
                @bri               = ops.bri if ops.bri?
            else
                # Get state from cli, Override color props if available
                {@hue, @sat, @bri, @dur, @kel} = ops

            @sat = @sat / 100 if @sat
            @bri = @bri / 100 if @bri
            @kel = ((@kel / 100) * 6500) + 2500 if @kel

            # Selection
            @sel = switch
                when o.id?
                    "id:#{o.id}"
                when o.lab?
                    "label:#{o.lab}"
                when o.grp?
                    "group:#{o.grp}"
                when o.loc?
                    "location:#{o.loc}"
                else
                    "all"

        go: () ->
            changeString = ""
            # I'm going to decide that kelvin always takes precedence. This
            # means that if it is specified, then switch the lights over to a
            # white based color, and ignore all the other color attributes
            if @kel?
                changeString += "kelvin:#{@kel}"
            else
                changeString += "hue:#{@hue} " if @hue?
                changeString += "saturation:#{@sat} " if @sat?
                changeString += "brightness:#{@bri} " if @bri?

            if changeString.length > 0
                log "Applying change to bulbs"
                setProp changeString, @sel, @dur, o.on, log
            else if o.toggle
                power @sel
            else if o.on or o.off
                # I'm going to let off take precedence
                power @sel, (not o.off) && o.on





    t = new ColorState(o)
    log t
    t.go()


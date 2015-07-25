
## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

Get the token

    fs           = require 'fs'
    home         = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    fileContents = fs.readFileSync (home + '/.lifx_token')
    tokenObj     = JSON.parse fileContents
    token        = tokenObj.token
    console.log 'token is: ', token

Initialize it with the token

    lifx = new lifxObj token



# Handy functions

Hold the lights in state

    lights = {}

Alias for the `console.log` function

    log = console.log

log out the lights statuses

    showStatus = () ->
        log lights

Get and set the status of the lights

    setStatus = () ->
        lifx.listLights 'all', (body) ->
            log body
            lights = body

Call the set status fucntion for funsies

    setStatus()






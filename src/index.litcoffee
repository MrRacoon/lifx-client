
## LIFX-Client

Create the lifx object

    lifxObj = require 'lifx-api'

Get the token

    fs = require 'fs'
    fileContents = fs.readFileSync '~/.lifx_token'
    tokenObj = JSON.parse fileContents
    token = tokenObj.token
    console.log 'token is: ', token

Initialize it with the token

    # var lifx = new lifxObj("");

Expose functions to the outside world




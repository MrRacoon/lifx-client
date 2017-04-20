<img src="./images/icon.png" height="100" />
lifx client
===========

[![npm version](https://badge.fury.io/js/lifx-client.svg)](https://badge.fury.io/js/lifx-client)
[![Build Status](https://travis-ci.org/MrRacoon/lifx-client.svg?branch=master)](https://travis-ci.org/MrRacoon/lifx-client)
[![Dependency Status](https://david-dm.org/MrRacoon/lifx-client.svg)](https://david-dm.org/MrRacoon/lifx-client)

Control your lifx system through the command line.

Install
-------

`npm install -g lifx-client`

Usage
-----

turn all lights on;
`lifx -1`

turn all lights off:
`lifx -0`

turn group:Room on:
`lifx -g 'Room' -1`

turn group:Room to the color blue:
`lifx -g 'Room' -C blue`

turn group:Room to the color limegreen with a brightness of 20% and saturation of 42%:
`lifx -g 'Room' -C limegreen -B 20 -S 42`

Try using aliases:

```bash
alias room="lifxcli -g 'Room'"
```

Configuration
-------------

This client uses `rc-yaml` to grab config options. you can use `rc` files for specifying default cli arguments.

( The *best* option to put here is `token` )

```yml
token: [LIFX_API_TOKEN]
```

command line args
-----------------

```bash
Usage: node lifxcli

  -c, --config=ARG      Provide a lifxcli configuration file path for setting default settings
  -k, --token=ARG       the token in plainText
  -T, --toggle          toggle the power of the bulbs
  -1, --on              turn on the lights
  -0, --off             turn off the lights
  -C, --color=ARG       set color (blue, red, pink...)
  -H, --hue=ARG         set color using hue (0-360)
  -K, --kelvin=ARG      set kelvin (2500-9000)
  -B, --brightness=ARG  set brightness (0.0-1.0)
  -S, --saturation=ARG  set saturation (0.0-1.0)
  -i, --id=ARG          select bulb(s) by id
  -l, --label=ARG       select bulb(s) by label
  -g, --group=ARG       select bulb(s) by group name
  -p, --location=ARG    select bulb(s) by location name
  -d, --duration=ARG    duration to make the change
  -a, --status          show the status of the lights
  -o, --logFile=ARG     specify a log file to use (default: /tmp/lifx-cli.log)
  -h, --help            display this help
  -n, --notify          provide a system notification with details about the changes
  -v, --verbose         Log out verbose messages to the screen
      --changeString    Return the string that would be used in the Api to modify bulb state
```

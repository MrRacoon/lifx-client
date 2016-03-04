lifx client
===========

[![npm version](https://badge.fury.io/js/lifx-client.svg)](https://badge.fury.io/js/lifx-client)
[![Build Status](https://travis-ci.org/MrRacoon/lifx-client.svg?branch=master)](https://travis-ci.org/MrRacoon/lifx-client)
[![Dependency Status](https://david-dm.org/MrRacoon/lifx-client.svg)](https://david-dm.org/MrRacoon/lifx-client)

Big fan of home automation. And have to use javascript for work.

so... lifxcli in coffeescript? Oh sure.

Install
-------

grab it from npm using:

`npm install -g lifx-client`

or from source using:

```bash
# Get the repo from space
git clone https://github.com/MrRacoon/lifx-cli.git
cd lifx-cli

# dependencies
npm install -g gulp

# Install into your global space
npm install -g
```

Usage
-----

turn all lights on;
`lifxcli -1`

turn all lights off:
`lifxcli -0`

turn group:Room on:
`lifxcli -g 'Room' -1`

turn group:Room to the color blue:
`lifxcli -g 'Room' -C blue`

turn group:Room to the color limegreen with a brightness of 20% and saturation of 42%:
`lifxcli -g 'Room' -C limegreen -B 20 -S 42`

Try using aliases:

```bash
alias room="lifxcli -g 'Room'"
```

Configuration
-------------

The config requires only one particular value and that is `token`. This should consist of the token you get from [the lifx cloud site](https://cloud.lifx.com/settings). Once you have that, throw it in the file `$HOME/.config/lifx`.


The `$HOME/.config/lifx` file should be JSON and the token should be stored under `token` like such:

```json
{
    "token": "aaaabbbbbbccccdddddeeeeefffffgggghhhhhiiiiijjjjjjkkkkkklllllmmmmm"
}
```

This file can take any long argument setting that the cli `-h` documentation describes. The binary will take any of these options and use themm as default if they aren't provided when invokation occurs. For example, to use a `duration` of 2 seconds for any invokations by default use the following:

```json
{
    "token": "aaaabbbbbbccccdddddeeeeefffffgggghhhhhiiiiijjjjjjkkkkkklllllmmmmm",
    "duration": 2
}
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

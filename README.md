<img src="./images/icon.png" height="100" />

lifx client
===========

[![npm version](https://badge.fury.io/js/lifx-client.svg)](https://badge.fury.io/js/lifx-client)
[![Build Status](https://travis-ci.org/MrRacoon/lifx-client.svg?branch=master)](https://travis-ci.org/MrRacoon/lifx-client)
[![Dependency Status](https://david-dm.org/MrRacoon/lifx-client.svg)](https://david-dm.org/MrRacoon/lifx-client)
[![Known Vulnerabilities](https://snyk.io/test/github/MrRacoon/lifx-client/0d8d49df8b7111af08b7bfbd6dc4b1665505da45/badge.svg)](https://snyk.io/test/github/MrRacoon/lifx-client/0d8d49df8b7111af08b7bfbd6dc4b1665505da45)

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

turn group:Room to the color limegreen with a brightness of 20% and saturation
of 42%:

`lifx -g 'Room' -C limegreen -B 20 -S 42`

pulse group:Room to the color limegreen from the color red with a brightness of
20% and saturation of 42%:

`lifx -g 'Room' -p -C limegreen -f red -B 20 -S 42`

Try using aliases:

```bash
alias room="lifxcli -g 'Room'"
```

Configuration
-------------

This client uses `rc-yaml` to grab config options. you can use `rc` files for specifying default cli arguments.

( I'd suggest saving your `token` here )

```yml
token: [LIFX_API_TOKEN]
duration: 2 // default the duration to 2 seconds  
```

command line args
-----------------

```bash
Usage: node lifx

  -k, --token=STRING      the token in plainText
  -T, --toggle            toggle the power of the bulbs
  -1, --on                turn on the lights
  -0, --off               turn off the lights
  -C, --color=STRING      set color (blue, red, pink...)
  -H, --hue=FLOAT         set color using hue (0-360)
  -K, --kelvin=FLOAT      set kelvin (0-100)
  -B, --brightness=FLOAT  set brightness (0-100)
  -S, --saturation=FLOAT  set saturation (0-100)
  -I, --infrared=FLOAT    set infrared (0-100)
  -i, --id=STRING         select bulb(s) by id
  -l, --label=STRING      select bulb(s) by label
  -g, --group=STRING      select bulb(s) by group name
  -L, --location=STRING   select bulb(s) by location name
  -b, --breathe           make the lights do a breathe effect
  -p, --pulse             make the lights do a pulse effect
  -d, --duration=FLOAT    duration/period of time for transitions
  -P, --persist           If true leave the last effect color. (breathe, pulse)
  -f, --from=COLOR        The color to start the effect from. defaults to current color (breathe, pulse)
  -y, --cycles=FLOAT      The number of times to repeat the effect. (breathe, pulse)
  -e, --peak=FLOAT        Defines where in a period the target color is at its maximum. (breathe)
  -c, --scene=UUID        activate the scene via uuid
      --listScenes        show the currently known set of scenes
  -a, --status            show the status of the lights
  -h, --help              display this help
  -n, --notify            provide a system notification with details about the changes
  -v, --verbose           Log out verbose messages to the screen
  -V, --version           show the current version
```

lifx client
===========

I love LIFX. Very fun to play with and plenty of acedemic challenges in making
them work in fun ways. Here I've taken the taask of creating a node binary,
wrritten in coffeescript.

Install
-------

Soon I will have this on npm, but until then...

```bash

git clone https://github.com/MrRacoon/lifx-cli.git
cd lifx-cli
npm install -g

```

Should work. But as always I love a good issue.

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

The configuration for this app can be found at `~/.config/lifxcli`. The fle
should contain a JSON object with your desired defaults.You only **Have To**
specify only one option, which is the api token that you are given by the lifx
website. This file will act as a set of defaults to any of the options below.
Use the long format of the option (shown below) to save a default value.

For Example:

```json
{
    "token": "Your lifx token here",
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
  -v, --verbose         Log out verbose messages to the screen
      --changeString    Return the string that would be used in the Api to modify bulb state
```

If you like to read source, go [check it out][sauce]. It's wicked easy to read

[sauce]: src/index.litcoffee 'Wicked easy to read'

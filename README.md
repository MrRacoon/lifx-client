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

lifx_token
----------

The token is the fun part. you have four options. Either you save it to
`.lifx_token` in you home dir in JSON format keyed at `token` or in that file
as plain text, nothing fancy. You can also use flags like -t to specify it
directly on the command line, or -f to specify an alternate file.

Here is an exammple of the JSON format I would expect if I were to look for it.

```json

{ "token": "Your lifx token here" }

```

command line args
-----------------

```bash

Usage: lifxcli OPTIONS

  -t, --token=ARG      the token in plainText
  -f, --tokenFile=ARG  the file that houses the lifx token in json format
  -T, --toggle         toggle the power of the bulbs
  -1, --on             turn on the lights
  -0, --off            turn off the lights
  -c, --color=ARG      set color (blue, red, pink...)
  -h, --hue=ARG        set color using hue (0-360)
  -k, --kel=ARG        set kelvin (2500-9000)
  -b, --bri=ARG        set brightness (0.0-1.0)
  -s, --sat=ARG        set saturation (0.0-1.0)
  -i, --id=ARG         select bulb(s) by id
  -l, --lab=ARG        select bulb(s) by label
  -g, --grp=ARG        select bulb(s) by group name
  -p, --loc=ARG        select bulb(s) by location name
      --dur=ARG        duration to make the change
  -s, --status         show the status of the lights
      --logFile=ARG    specify a log file to use (default: /tmp/lifx-cli.log)
  -h, --help           display this help
  -v, --verbose        Log out verbose messages to the screen

```

If you like to read source, go [check it out][sauce]. It's stupid easy to read

[sauce]: src/index.litcoffee 'Wicked easy to read'

lifx client
===========

playing around with the lifx api


Install
-------

```bash

npm install
gulp

```

lifx_token
----------

There are a  couple ideas floating in my head about how this should be
done in the future,but for now, save your token as `.lifx_token` in
your home dir using the following format:

```json

{ "token": "Your lifx token here" }

```


command line args
-----------------

```bash

Usage: node index.js

  -t, --token=ARG       the token in plainText
      --toggle[=ARG]    toggle the power of the bulbs
      --on[=SELECTOR]   turn on the lights
      --off[=ARG]       turn off the lights
  -s, --status          show the status of the lights
      --color=ARG       set color (blue, red, pink...)
      --hue=ARG         set color using hue (0-360)
      --rgb=ARG         set color using rgb (#RRGGBB)
      --kelvin=ARG      set kelvin (2500-9000)
      --brightness=ARG  set brightness (0.0-1.0)
      --saturation=ARG  set saturation (0.0-1.0)
      --brightnessUp    increase the brightness
      --brightnessDown  decrease the brightness
      --kelvinUp        increase the kelvin
      --kelvinDown      decrease the kelvin
      --saturationUp    increase the saturation
      --saturationDown  decrease the saturation
  -h, --help            display this help
  -v, --verbose         Log out verbose messages to the screen

```

If you like to read source, go [check is out][sauce]. It's stupid easy to read


[sauce]: 'src/index.litcoffee' 'Wicked easy to read'

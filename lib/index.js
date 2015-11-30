var R, a, b, c, changeString, colorParser, commandlineConfig, defaultConfigFile, err, fs, homeDirectory, lifx, lifxObj, lifxclIcon, log, makeConfig, notifier, notify, o, parsedColor, path, ref, selection, setProp;

fs = require('fs');

lifxObj = require('lifx-api');

notifier = require('node-notifier');

path = require('path');

R = require('ramda');

colorParser = require('parse-color');

lifxclIcon = path.join(__dirname + '/images/icon.png');

commandlineConfig = require('node-getopt').create([['c', 'config=ARG', 'Provide a lifxcli configuration file path for setting default settings'], ['k', 'token=ARG', 'the token in plainText'], ['T', 'toggle', 'toggle the power of the bulbs'], ['1', 'on', 'turn on the lights'], ['0', 'off', 'turn off the lights'], ['C', 'color=ARG', 'set color (blue, red, pink...)'], ['H', 'hue=ARG', 'set color using hue (0-360)'], ['K', 'kelvin=ARG', 'set kelvin (2500-9000)'], ['B', 'brightness=ARG', 'set brightness (0.0-1.0)'], ['S', 'saturation=ARG', 'set saturation (0.0-1.0)'], ['i', 'id=ARG', 'select bulb(s) by id'], ['l', 'label=ARG', 'select bulb(s) by label'], ['g', 'group=ARG', 'select bulb(s) by group name'], ['p', 'location=ARG', 'select bulb(s) by location name'], ['d', 'duration=ARG', 'duration to make the change'], ['a', 'status', 'show the status of the lights'], ['o', 'logFile=ARG', 'specify a log file to use (default: /tmp/lifx-cli.log)'], ['h', 'help', 'display this help'], ['v', 'verbose', 'Log out verbose messages to the screen'], ['', 'changeString', 'Return the string that would be used in the Api to modify bulb state']]).bindHelp().parseSystem().options;

homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

defaultConfigFile = commandlineConfig.config || homeDirectory + '/.config/lifxcli';

makeConfig = R.compose(JSON.parse, fs.readFileSync);

try {
  o = R.merge(makeConfig(defaultConfigFile), commandlineConfig);
} catch (_error) {
  err = _error;
  console.log(err);
  return;
}

lifx = new lifxObj(o.token);

if (o.status != null) {
  lifx.listLights('all', console.log);
  return;
}

log = function(args) {
  var logFile, str;
  console.log(args);
  logFile = o.logFile || '/tmp/lifx-cli.log';
  str = (new Date()) + " " + (args.join(' '));
  fs.appendFile(logFile, str);
  if (o.verbose) {
    return console.log(str);
  }
};

notify = function(message) {
  return notifier.notify({
    title: 'Lifx-cli',
    message: message,
    icon: lifxclIcon,
    time: 1
  });
};

selection = (function() {
  switch (false) {
    case o.id == null:
      return "id:" + o.id;
    case o.label == null:
      return "label:" + o.label;
    case o.group == null:
      return "group:" + o.group;
    case o.location == null:
      return "location:" + o.location;
    default:
      return "all";
  }
})();

parsedColor = colorParser(o.color);

if (parsedColor.hsl != null) {
  ref = parsedColor.hsl, a = ref[0], b = ref[1], c = ref[2];
  o.hue = o.hue || a;
  o.saturation = o.saturation || b;
  o.brightness = o.brightness || c;
}

if (o.saturation) {
  o.saturation = o.saturation / 100;
}

if (o.brightness) {
  o.brightness = o.brightness / 100;
}

if (o.kelvin) {
  o.kelvin = ((o.kelvin / 100) * 6500) + 2500;
}

changeString = "";

if (o.kelvin != null) {
  changeString += "kelvin:" + o.kelvin;
} else {
  if (o.hue != null) {
    changeString += "hue:" + o.hue + " ";
  }
  if (o.saturation != null) {
    changeString += "saturation:" + o.saturation + " ";
  }
  if (o.brightness != null) {
    changeString += "brightness:" + o.brightness + " ";
  }
}

setProp = function(prop, sel, dur, power, cb) {
  if (sel == null) {
    sel = "all";
  }
  if (dur == null) {
    dur = 1.0;
  }
  if (power == null) {
    power = false;
  }
  if (cb == null) {
    cb = console.log;
  }
  return lifx.setColor(sel, prop, dur, power, cb);
};

if (changeString.length > 0) {
  notify(changeString);
  setProp(changeString, selection, o.duration, o.on, console.log);
}

if (o.toggle != null) {
  notify("toggling lights");
  lifx.togglePower(selection, cb);
} else if (o.off != null) {
  notify("Turning lights off");
  lifx.setPower(selection, "off", 1.0, console.log);
} else if (o.on != null) {
  notify("Turning lights on");
  lifx.setPower(selection, "on", 1.0, console.log);
}

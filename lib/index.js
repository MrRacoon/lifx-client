var ColorState, colorParser, e, err, fileContents, fileLocation, fs, getStatus, home, lifx, lifxObj, log, o, opts, power, setProp, t, token, tokenObj, verbose, writeToLogFile,
  slice = [].slice;

lifxObj = require('lifx-api');

colorParser = require('parse-color');

fs = require('fs');

opts = require('node-getopt').create([['t', 'token=ARG', 'the token in plainText'], ['f', 'tokenFile=ARG', 'the file that houses the lifx token in json format'], ['T', 'toggle', 'toggle the power of the bulbs'], ['1', 'on', 'turn on the lights'], ['0', 'off', 'turn off the lights'], ['c', 'color=ARG', 'set color (blue, red, pink...)'], ['h', 'hue=ARG', 'set color using hue (0-360)'], ['k', 'kel=ARG', 'set kelvin (2500-9000)'], ['b', 'bri=ARG', 'set brightness (0.0-1.0)'], ['s', 'sat=ARG', 'set saturation (0.0-1.0)'], ['i', 'id=ARG', 'select bulb(s) by id'], ['l', 'lab=ARG', 'select bulb(s) by label'], ['g', 'grp=ARG', 'select bulb(s) by group name'], ['p', 'loc=ARG', 'select bulb(s) by location name'], ['d', 'dur=ARG', 'duration to make the change'], ['s', 'status', 'show the status of the lights'], ['o', 'logFile=ARG', 'specify a log file to use (default: /tmp/lifx-cli.log)'], ['h', 'help', 'display this help'], ['v', 'verbose', 'Log out verbose messages to the screen']]).bindHelp().parseSystem();

writeToLogFile = function() {
  var args, logFile, str;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  logFile = o.logFile || '/tmp/lifx-cli.log';
  str = args.concat(['\n']).join(' ');
  return fs.appendFile(logFile, str);
};

log = function() {
  var addTime, args;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  addTime = [new Date()].concat(args);
  writeToLogFile(addTime);
  if (verbose) {
    return console.log.apply(null, addTime);
  }
};

o = opts.options;

verbose = o.verbose;

if (o.token != null) {
  token = o.token;
} else {
  home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  fileLocation = o.tokenFile || home + '/.lifx_token';
  try {
    fileContents = fs.readFileSync(fileLocation);
  } catch (_error) {
    err = _error;
    log(err);
    return;
  }
  try {
    tokenObj = JSON.parse(fileContents);
    token = tokenObj.token;
  } catch (_error) {
    e = _error;
    token = fileContents.replace(/\r?\n|\r/, '').replace(/\w/, '');
  }
}

lifx = new lifxObj(token);

getStatus = function(cb) {
  if (cb == null) {
    cb = log;
  }
  log("Getting Status");
  return lifx.listLights('all', cb);
};

power = function(selector, state, duration, cb) {
  var nex;
  if (duration == null) {
    duration = 1.0;
  }
  if (cb == null) {
    cb = log;
  }
  if (selector === '') {
    selector = "all";
  }
  if (state != null) {
    nex = state ? "on" : "off";
    log("turning bulbs " + nex);
    return lifx.setPower(selector, nex, duration, cb);
  } else {
    log("toggling bulbs");
    return lifx.togglePower(selector, cb);
  }
};

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
    cb = log;
  }
  log("Setting bulb(s) " + sel + " to state " + prop);
  return lifx.setColor(sel, prop, dur, power, cb);
};

if (!(o.status === void 0)) {
  getStatus();
  return;
}

ColorState = (function() {
  function ColorState(ops) {
    var obj, ref;
    obj = colorParser(ops.color);
    if (obj.hsl != null) {
      this.dur = ops.dur, this.kel = ops.kel;
      ref = obj.hsl, this.hue = ref[0], this.sat = ref[1], this.bri = ref[2];
      if (ops.hue != null) {
        this.hue = ops.hue;
      }
      if (ops.sat != null) {
        this.sat = ops.sat;
      }
      if (ops.bri != null) {
        this.bri = ops.bri;
      }
    } else {
      this.hue = ops.hue, this.sat = ops.sat, this.bri = ops.bri, this.dur = ops.dur, this.kel = ops.kel;
    }
    if (this.sat) {
      this.sat = this.sat / 100;
    }
    if (this.bri) {
      this.bri = this.bri / 100;
    }
    if (this.kel) {
      this.kel = ((this.kel / 100) * 6500) + 2500;
    }
    this.sel = (function() {
      switch (false) {
        case o.id == null:
          return "id:" + o.id;
        case o.lab == null:
          return "label:" + o.lab;
        case o.grp == null:
          return "group:" + o.grp;
        case o.loc == null:
          return "location:" + o.loc;
        default:
          return "all";
      }
    })();
  }

  ColorState.prototype.go = function() {
    var changeString;
    changeString = "";
    if (this.kel != null) {
      changeString += "kelvin:" + this.kel;
    } else {
      if (this.hue != null) {
        changeString += "hue:" + this.hue + " ";
      }
      if (this.sat != null) {
        changeString += "saturation:" + this.sat + " ";
      }
      if (this.bri != null) {
        changeString += "brightness:" + this.bri + " ";
      }
    }
    if (changeString.length > 0) {
      log("Applying change to bulbs");
      return setProp(changeString, this.sel, this.dur, o.on, log);
    } else if (o.toggle) {
      return power(this.sel);
    } else if (o.on || o.off) {
      return power(this.sel, (!o.off) && o.on);
    }
  };

  return ColorState;

})();

t = new ColorState(o);

log(t);

t.go();

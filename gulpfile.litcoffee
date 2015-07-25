
# Load the main task runner

    gulp   = require 'gulp'

# Load the coffeescript transpiler

    coffee = require 'gulp-coffee'

# Load the linter

    linter = require 'gulp-coffeelint'

# Provide the paths from source to dist

    paths =
        coffee:
            src: 'src/lifx-client.coffee'
            dest: 'dist'

# Default task

The default task is simple right now. Just take the index file, compile from
coffeescript to js, lint it and move it to dist.

    gulp.task 'default', () ->
        gulp.src paths.coffee.src
            .pipe coffee {bare: true}
            .pipe linter
            .pipe gulp.dest paths.coffee.dest



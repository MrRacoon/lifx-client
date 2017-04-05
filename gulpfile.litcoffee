Load the main task runner

    gulp   = require 'gulp'

Load the coffeescript transpiler

    coffee = require 'gulp-coffee'

Provide the paths from source to lib

    paths =
        coffee:
            src: 'src/index.litcoffee'
            dest: 'lib'
        images:
            src: 'images/*'
            dest: 'lib/images'

Default task

The default task is simple right now. Just take the index file, compile from
coffeescript to js, lint it and move it to lib.

    gulp.task 'default', [], ->
        gulp.src paths.coffee.src
            .pipe coffee {bare: true}
            .pipe gulp.dest paths.coffee.dest

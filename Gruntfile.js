'use strict';

module.exports = function (grunt) {

  var chalk = require('chalk');

  var pkg = {

    'grunt': null,

    msg: function (msg) {

      console.log(chalk.bgWhite(chalk.red('## ') + chalk.black('Pure Angular Advanced Searchbox') +

        chalk.red(' ## ') + chalk.black(msg)));

      return this;

    },

    /**
      * Load grunt tasks automatically
      * Time how long tasks take. Can help when optimizing build times
      * @method init
      * @type Function
    */

    init: function (grunt) {

      this.grunt = grunt;

      require('es6-promise')
        .polyfill();

      require('jit-grunt')(this.grunt, {

        'ngtemplates': 'grunt-angular-templates',

        'ngconstant': 'grunt-ng-constant',

        'replace': 'grunt-text-replace',

        'bump': 'grunt-bump',

        'bump-only': 'grunt-bump'

      });

      require('time-grunt')(this.grunt);

      return this;

    },

    /**
      * Configure grunt plugins
      * @method config
      * @type Function
    */

    config: function () {

      var grunt = this.grunt;

      grunt.initConfig({

        'pkg': grunt.file.readJSON('package.json'),

        'banner': '/*! \n * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <%= pkg.author.url %>\n' +
          ' * License: <%= pkg.license %>\n' +
          ' */\n',

        'paths' : require('./grunt/paths.js'),

        'jshint': require('./grunt/jshint.js'),

        'ngconstant': require('./grunt/ngconstant.js'),

        'postcss': require('./grunt/postcss.js'),

        'copy': require('./grunt/copy.js'),

        'replace': require('./grunt/replace.js'),

        'ngtemplates': require('./grunt/ngtemplates.js'),

        'bowerInstall': require('./grunt/bower-install.js'),

        'compass': require('./grunt/compass.js'),

        'watch' : require('./grunt/watch.js'),

        'clean': require('./grunt/clean.js'),

        'jade': require('./grunt/jade.js'),

        'concat': require('./grunt/concat.js'),

        'connect': require('./grunt/connect.js'),

        'merge-json': require('./grunt/merge-json.js'),

        'ngAnnotate': require('./grunt/ng-annotate.js'),

        'uglify': require('./grunt/uglify.js'),

        'bump': require('./grunt/bump.js')

      });

      return this;

    },

    /**
      * @method tasks
      * Build tasks for build, test, serve, and running the application.
    */

    tasks: function () {

      var self = this,

          grunt = self.grunt;

      grunt.registerTask('build', function (release) {

        var tasks = [

          'clean:dist',

          'compass:server',

          'jade',

          'bowerInstall',

          'ngtemplates',

          'copy:scripts',

          'concat',

          'copy:styles',

          'merge-json:all',

          'ngconstant:all',

          'clean:tmp',

          'ngAnnotate:all',

          'uglify:all',

          'copy:dist'

        ]

        if(!release) {

          tasks.push('connect', 'watch');

        }

        grunt.task.run(tasks);

      });

      grunt.registerTask('makeRelease', function () {

        var msg = grunt.option('m');

        if(msg) {

          grunt.config.merge({

            'bump': {

              'options': {

                'commitMessage': msg +  ' - Release v%VERSION%'

              }

            }

          });

        }

        grunt.task.run([

          'bump-only',

          'build:release',

          'bump-commit'

        ]);

      });

      return self;

    }

  };

  pkg
    .init(grunt)
    .config()
    .tasks();

};

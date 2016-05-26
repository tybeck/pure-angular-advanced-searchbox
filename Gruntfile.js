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

        'ngconstant': 'grunt-ng-constant'

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

          'paths' : {

            'dist' : 'dist',

            'app' : 'src',

            'scripts' : 'scripts',

            'testing': 'testing',

            'templates' : 'views',

            'images' : 'images',

            'styles' : 'styles',

            'config' : 'config'

          },

          'jshint': {

            'options': {

              'jshintrc': '.jshintrc',

              'reporter': require('jshint-stylish')

            },

            'all': [

              'Gruntfile.js',

              '<%= paths.app %>/<%= paths.scripts %>/**/*.js'

            ],

          },

          'postcss': {

            'options': {

              'map': true, // inline sourcemaps

              'processors': [

                require('pixrem')(), // add fallbacks for rem units

                require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes

                require('cssnano')() // minify the result

              ]

            },

            'dist': {

            	'src': '<%= paths.dist %>/<%= paths.styles %>/*.css'

            }

          },

          'copy' : {

            'scripts': {

              'files': [

                {

                  'expand': true,

                  'cwd': '<%= paths.app %>/<%= paths.scripts %>/',

                  'dest': '<%= paths.testing %>/<%= paths.scripts %>/',

                  'src': '**/*.js'

                }

              ]

            },

          },

          'ngconstant': {

            'development': {

              'options': {

                'dest': '<%= paths.dist %>/scripts/app.config.js',

                'wrap': '\'use strict\';\n\n{%= __ngModule %}',

                'name': 'footlocker.config'

              },

              'constants': 'app/config/.tmp/development.json'

            },

            'production': {

              'options': {

                'dest': '<%= paths.dist %>/scripts/app.config.js',

                'wrap': '\'use strict\';\n\n{%= __ngModule %}',

                'name': 'footlocker.config'

              },

              'constants': 'app/config/.tmp/production.json'

            },

            'local': {

              'options': {

                'dest': '<%= paths.dist %>/scripts/app.config.js',

                'wrap': '\'use strict\';\n\n{%= __ngModule %}',

                'name': 'footlocker.config'

              },

              'constants': 'app/config/.tmp/local.json'

            }

          },

          'ngtemplates': {

            'options': {

                'module': 'paasb'

            },

            'app': {

                'cwd': '<%= paths.testing %>',

                'src': '<%= paths.templates %>/**/*.html',

                'dest': '<%= paths.testing %>/scripts/ui.templates.js'

            }

         },

        'bowerInstall': {

          'target': {

            'src': [

              '<%= paths.dist %>/*.html'

            ]

          }

        },

        'compass': {

          'options': {

              'sassDir': '<%= paths.app %>/<%= paths.styles %>',

              'specify': '<%= paths.app %>/<%= paths.styles %>/main.scss',

              'cssDir': '<%= paths.dist %>/<%= paths.styles %>',

              'imagesDir': '<%= paths.dist %>/<%= paths.images %>',

              'javascriptsDir': '<%= paths.dist %>/<%= paths.scripts %>',

              'fontsDir': '<%= paths.dist %>/<%= paths.styles %>/fonts',

              //'importPath': '<%= paths.dist %>/bower_components',

              'httpFontsPath': '<%=paths.dist%>/<%= paths.styles %>/fonts',

              'relativeAssets': false,

              'assetCacheBuster': false,

              'raw': 'Sass::Script::Number.precision = 10\n'

          },

          'server': {

              'options': {

                  'debugInfo': false

              }

          }

        },

        'watch' : {

          'config' : {

            'files' : [

              '<%= paths.app %>/<%= paths.config %>/**/*.json'

            ],

            'options' : {

              'livereload' : true

            },

            'tasks' : ['buildconfig']

          },

          'jade' : {

            'files': [
              '<%= paths.app %>/<%= paths.templates %>/**/*.jade',
              '<%= paths.app %>/*.jade'
            ],

            'tasks': ['buildjade'],

            'options' : {

              'livereload' : true

            }

          },

          'js': {

            'files': ['<%= paths.app %>/<%= paths.scripts %>/**/*.js'],

            'tasks': ['buildjs'],

            'options' : {

              'livereload' : true

            }

          },

          'compass': {

            'files': ['<%= paths.app %>/<%= paths.styles %>/**/*.{scss,sass}'],

            'tasks': ['buildstyles'],

            'options' : {

              'livereload' : true

            }

          }

        },

        'clean' : {

          'dist' : {

            'files' : [

              {

                'dot' : true,

                'src' : ['<%= paths.dist %>/*']

              }

            ]

          },

        },

        'jade': {

          'compile': {

            'options': {

              'client': false,

              'pretty': true,

              'basedir': '<%= paths.app %>/<%= paths.templates %>/'

            },

            'files': [ {

              'cwd': '<%= paths.app %>/<%= paths.templates %>',

              'src': '**/*.jade',

              'dest': '<%= paths.testing %>/<%= paths.templates %>',

              'expand': true,

              'ext': '.html'

              },

              {

              'cwd': '<%= paths.app %>/',

              'src': '*.jade',

              'dest': '<%= paths.testing %>/',

              'expand': true,

              'ext': '.html'

              }

            ]

          }

        },

        'concat': {

          'all': {

            'files': {

              '<%= paths.dist %>/<%= paths.scripts %>/ui-core.js': [
                '<%= paths.app %>/<%= paths.scripts %>/ui.module.js',
                '<%= paths.app %>/<%= paths.scripts %>/**/*.js',
                '<%= paths.testing %>/<%= paths.scripts %>/ui.templates.js'
              ]

            }

          }

        },

        'bowerInstall': {

          'target': {

            'src': [

              '<%= paths.testing %>/*.html'

            ]

          }

        }

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

      grunt.registerTask('build', function() {

        grunt.task.run([

          'clean:dist',

          'compass:server',

          'jade',

          'bowerInstall',

          'ngtemplates',

          'copy:scripts',

          'concat'

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

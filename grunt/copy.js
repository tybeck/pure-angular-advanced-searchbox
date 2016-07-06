'use strict';

module.exports = {

  'dist': {

    'files': [

      {

        'expand': true,

        'cwd': '<%= paths.dist %>/<%= paths.scripts %>/',

        'dest': '<%= paths.testing %>/<%= paths.scripts %>/',

        'src': '**/*.*'

      }

    ]

  },

  'scripts': {

    'files': [

      {

        'expand': true,

        'cwd': '<%= paths.app %>/<%= paths.scripts %>/',

        'dest': '<%= paths.testing %>/<%= paths.scripts %>/',

        'src': '**/*.js'

      },

      {

        'expand': true,

        'cwd': 'bower_components/',

        'dest': '<%= paths.testing %>/bower_components/',

        'src': '**/*.*'

      }

    ]

  },

  'styles': {

    'files': [

      {

        'expand': true,

        'cwd': '<%= paths.dist %>/<%= paths.styles %>/',

        'dest': '<%= paths.testing %>/<%= paths.styles %>/',

        'src': '**/*.css'

      }

    ]

  }

};

'use strict';

module.exports = {

  'tmp': {

    'files': [

      {

        'dot': true,

        'src': [
          'src/config/.tmp/'
        ]

      }

    ]

  },

  'dist' : {

    'files' : [

      {

        'dot' : true,

        'src' : [
          '<%= paths.dist %>/*',
          '<%= paths.testing %>/bower_components/',
          '<%= paths.testing %>/styles/',
          '<%= paths.testing %>/views/',
          '<%= paths.testing %>/index.html'
        ]

      }

    ]

  },

};

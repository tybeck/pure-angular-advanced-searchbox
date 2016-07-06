'use strict';

module.exports = {

  'options': {

    'preserveComments': false,

    'mangle': true,

    'screwIE8': true

  },

  'all': {

    'files': {

      '<%= paths.dist %>/<%= paths.scripts %>/ui.core.min.js': [
        '<%= paths.dist %>/<%= paths.scripts %>/ui.core.js'
      ]

    }

  }

};

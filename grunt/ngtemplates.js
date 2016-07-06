'use strict';

module.exports = {

  'options': {

      'module': 'paasb'

  },

  'app': {

      'cwd': '<%= paths.testing %>',

      'src': '<%= paths.templates %>/**/*.html',

      'dest': '<%= paths.testing %>/scripts/ui.templates.js'

  }

};

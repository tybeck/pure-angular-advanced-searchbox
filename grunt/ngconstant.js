'use strict';

module.exports = {

  'all': {

    'options': {

      'dest': '<%= paths.testing %>/<%= paths.scripts %>/ui.config.js',

      'wrap': '\'use strict\';\n\n{%= __ngModule %}',

      'name': 'paasb.config'

    },

    'constants': 'src/config/.tmp/development.json'

  },

};

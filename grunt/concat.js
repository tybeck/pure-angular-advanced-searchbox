'use strict';

module.exports = {

  'all': {

    'files': {

      '<%= paths.dist %>/<%= paths.scripts %>/ui.core.js': [
        '<%= paths.app %>/<%= paths.scripts %>/ui.module.js',
        '<%= paths.testing %>/<%= paths.scripts %>/ui.config.js',
        '<%= paths.app %>/<%= paths.scripts %>/**/*.js',
        '<%= paths.testing %>/<%= paths.scripts %>/ui.templates.js'
      ]

    }

  }

};

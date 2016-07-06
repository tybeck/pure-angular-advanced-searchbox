'use strict';

module.exports = {

  'docs': {

    'src': ['<%= paths.testing %>/index.html'],

    'overwrite': true,

    'replacements': [{

      'from': '../bower_components/',

      'to': 'bower_components/'

    }]

  }

};

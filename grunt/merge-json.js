'use strict';

module.exports = {

  'all': {

    'src': [
      'src/config/**/*.json',
      '!src/config/tmp/**/*.json'
    ],

    'dest': 'src/config/.tmp/development.json'

  }

};

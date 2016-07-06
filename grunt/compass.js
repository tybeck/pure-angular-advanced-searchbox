'use strict';

module.exports = {

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

};

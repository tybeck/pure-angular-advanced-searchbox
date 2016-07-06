'use strict';

module.exports = {

  'jade' : {

    'files': [
      '<%= paths.app %>/<%= paths.templates %>/**/*.jade',
      '<%= paths.app %>/*.jade'
    ],

    'tasks': ['build'],

    'options' : {

      'livereload' : 37000

    }

  },

  'js': {

    'files': ['<%= paths.app %>/<%= paths.scripts %>/**/*.js'],

    'tasks': ['build'],

    'options' : {

      'livereload' : 37000

    }

  },

  'compass': {

    'files': ['<%= paths.app %>/<%= paths.styles %>/**/*.{scss,sass}'],

    'tasks': ['build'],

    'options' : {

      'livereload' : 37000

    }

  }

};

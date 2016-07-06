'use strict';

module.exports ={

  'options': {

    'map': true, // inline sourcemaps

    'processors': [

      require('pixrem')(), // add fallbacks for rem units

      require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes

      require('cssnano')() // minify the result

    ]

  },

  'dist': {

    'src': '<%= paths.dist %>/<%= paths.styles %>/*.css'

  }

};

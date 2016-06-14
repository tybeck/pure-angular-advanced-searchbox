'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbPlaceholders
 * @description
 * # paasbPlaceholders Services
 */

 angular.module('paasb')

 	.factory('paasbPlaceholders', [
     '$timeout',
     function ($timeout) {

       var scope = null,

         config = null,

         timer;

       return function (_scope, _config) {

         scope = _scope;

         config = _config;

         angular.extend(this, {

           'index': 0,

           'position': 0,

           'val': '',

           stopAll: function () {

             $timeout.cancel(timer);

           },

           setup: function () {

             if(config && config.placeholders

               && config.placeholders.length) {

                 this.start(this.index);

             } else {

               if(scope.placeholder && typeof scope.placeholder === 'string') {

                 scope.input.attr('placeholder', scope.placeholder);

               }

             }

           },

           start: function (index) {

             if(typeof index !== 'undefined') {

               this.index = index;

             } else {

               if(typeof this.index !== 'undefined') {

                 this.index = 0;

               } else {

                 this.index ++;

               }

             }

             this.position = 0;

             this.val = '';

             this.change();

           },

           change: function (reverse) {

             var self = this;

             if(reverse) {

               timer = $timeout(function () {

                 self.val = self.val.slice(0, self.val.length - 1);

                 scope.input.attr('placeholder', self.val);

                 if(self.val.length) {

                   self.change(true);

                 } else {

                   self.position = 0;

                   self.index ++;

                   if(self.index > (config.placeholders.length - 1)) {

                     self.index = 0;

                   }

                   self.change();

                 }

               }, config.placeholderSpeedOutInterval || 25);

             } else {

               timer = $timeout(function () {

                 var val = config.placeholders[self.index],

                   len = val.length;

                 self.val += val[self.position];

                 scope.input.attr('placeholder', self.val);

                 self.position ++;

                 if(self.position < len) {

                   self.change();

                 } else {

                   timer = $timeout(function () {

                     self.change(true);

                   }, config.placeholderInterval || 2000);

                 }

               }, config.placeholderSpeedInInterval || 75);

             }

           }

         });

       };

 	}]);

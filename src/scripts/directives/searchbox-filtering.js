'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFiltering
 * @description
 * # Implementation of paasbSearchBoxFiltering
 */

angular.module('paasb')

    .directive('paasbSearchBoxFiltering', [
      function () {

        return {

            'restrict': 'A',

            'require': '^paasbSearchBox',

            controller: function ($scope, $element) {

              console.log("Give me filtering");

            }

        };

    }]);

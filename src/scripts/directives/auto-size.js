'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbAutoSize
 * @description
 * # Implementation of paasbAutoSize
 */

angular.module('paasb')

    .directive('paasbAutoSize', [
      '$parse',
      '$window',
      '$timeout',
      'paasbUtils',
      function ($parse, $window, $timeout, paasbUtils) {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              var filter = null,

                Filtering = null,

                type = $attrs.paasbAutoSizeType;

              $attrs.$observe('paasbAutoSize', function () {

                filter = $parse($attrs.paasbAutoSize)($scope) || {};

                Filtering = filter.$$filtering || {};

                angular
                  .element($element)
                    .ready(function () {

                      if(type) {

                        return Filtering.addAutoSizeElementToFilter(filter, $element, type);

                      }

                });

              });

            }

        };

    }]);

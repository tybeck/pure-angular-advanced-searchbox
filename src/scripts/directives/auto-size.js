'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbAutoSize
 * @description
 * # Implementation of paasbAutoSize
 */

angular.module('paasb')

    .directive('paasbAutoSize', [
      function () {

        return {

            'restrict': 'A',

            'require': '^paasbSearchBox',

            'scope': {

              'paasbAutoSize': '='

            },

            controller: function ($scope, $element) {

              var filter = $scope.paasbAutoSize,

                getStyle = function(elem, style) {

                  return parseInt(window.getComputedStyle(elem, null).getPropertyValue(style));

                };

              angular
                .element($element)
                  .ready(function () {

                    var searchInput = filter.element.find('input')[0],

                      bounding = searchInput.getBoundingClientRect(),

                      boundingParent = filter.element[0].getBoundingClientRect(),

                      left = (bounding.left - boundingParent.left);

                    var extraSpace = getStyle(searchInput, 'border-left-width');

                    $element
                      .css('left', left + 'px')
                      .css('width', (bounding.width - extraSpace) + 'px');

              });

            }

        };

    }]);

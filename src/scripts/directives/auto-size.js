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
      function ($parse, $window) {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              $attrs.$observe('paasbAutoSize', function () {

                var filter = $parse($attrs.paasbAutoSize)($scope),

                  getStyle = function(elem, style) {

                    return parseInt($window.getComputedStyle(elem, null).getPropertyValue(style));

                  };

                var filterSelectorsHeight = 0;

                angular
                  .element($element)
                    .ready(function () {

                      var searchInput = filter.element.find('input')[0],

                        bounding = searchInput.getBoundingClientRect(),

                        boundingParent = filter.element[0].getBoundingClientRect(),

                        left = (bounding.left - boundingParent.left);

                      if(filter.hasFilterSelectors) {

                        var selectorElem = filter.hasFilterSelectors,

                          elem = $element[0];

                        if(!selectorElem[0].contains(elem)) {

                          filterSelectorsHeight = selectorElem.find('ul')[0]

                            .getBoundingClientRect().height + bounding.height;

                        }

                      }

                      var extraSpace = getStyle(searchInput, 'border-left-width');

                      $element
                        .css('left', left + 'px')
                        .css('width', (bounding.width - extraSpace) + 'px')
                        .css('top', filterSelectorsHeight ? (filterSelectorsHeight + 'px') : 'auto');

                });

              });

            }

        };

    }]);

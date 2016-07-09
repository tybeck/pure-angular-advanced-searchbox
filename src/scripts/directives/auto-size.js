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

                autoSizeElement = $parse($attrs.paasbAutoSizeElement)($scope),

                autoSizeBoundingBox = $parse($attrs.paasbAutoSizeBoundingBox)($scope);

              $scope.reAutoSize = function () {

                var filterSelectorsHeight = 0;

                if(autoSizeBoundingBox && autoSizeBoundingBox.length) {

                  autoSizeBoundingBox = autoSizeBoundingBox[0];

                }

                $timeout(function () {

                  var searchInput = filter.element.find('input')[0],

                    boundingElement = autoSizeBoundingBox || searchInput,

                    bounding = boundingElement.getBoundingClientRect(),

                    boundingParent = filter.element[0].getBoundingClientRect(),

                    left = bounding.left;

                  if(searchInput === boundingElement) {

                    var boundingElem = filter.element
                      .find('div')[2],

                        boundingElementLeft;

                    if(!boundingElem) {

                      boundingElem = filter.element
                        .find('ul')[0];

                    }

                    if(boundingElem) {

                      boundingElementLeft = boundingElem.getBoundingClientRect().left;

                      left -= boundingElementLeft;

                    }

                  }

                  if(autoSizeElement) {

                    var selectorElem = angular.element(autoSizeElement),

                      elem = $element[0];

                    if(!selectorElem[0].contains(elem)) {

                      filterSelectorsHeight = selectorElem.find('ul')[0]

                        .getBoundingClientRect().height + bounding.height;

                    }

                  }

                  var extraSpace = paasbUtils.getStyle(searchInput, 'border-left-width');

                  $element
                    .css('left', left + 'px')
                    .css('width', (bounding.width - extraSpace) + 'px')
                    .css('top', filterSelectorsHeight ? (filterSelectorsHeight + 'px') : 'auto');

                });

              };

              $attrs.$observe('paasbAutoSize', function () {

                filter = $parse($attrs.paasbAutoSize)($scope);

                angular
                  .element($element)
                    .ready(function () {

                      $scope.reAutoSize();

                });

              });

            }

        };

    }]);

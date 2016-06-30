'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterMoved
 * @description
 * # Implementation of paasbSearchBoxFilterMoved
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterMoved', [
      '$parse',
      '$compile',
      function ($parse, $compile) {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              var filter = null;

              $scope.hasRecentlyMoved = function () {

                if(filter && filter.recentlyMoved) {

                  var scope = $scope.$new(true),

                    compiledTemplate = null;

                  angular.extend(scope, {

                    'filter': filter

                  });

                  compiledTemplate = $compile('<paasb-search-box-filter-moved-animation filter="filter" />')(scope);

                  $element.prepend(compiledTemplate);

                }

                delete filter.recentlyMoved;

              };

              $attrs.$observe('paasbSearchBoxFilterMoved', function () {

                filter = $parse($attrs.paasbSearchBoxFilterMoved)($scope);

                angular
                  .element($element)
                    .ready(function () {

                      $scope.hasRecentlyMoved();

                });

              });

            }

        };

    }]);

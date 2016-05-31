'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterSelectors
 * @description
 * # Implementation of paasbSearchBoxFilterSelectors
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterSelectors', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filter-selectors.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filters': '=',

              'search': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Search = null;

              $scope.$watch('search', function (__new, __old) {

                if((__new !== __old) && angular.isObject(__new)) {

                  Search = __new;

                  angular.forEach($scope.filters, function (filter) {

                    filter.notFiltered = true;

                  });

                  angular.extend($scope, {

                    addFilter: function (ev) {

                      var target = angular.element(ev.target),

                        filterName = target.attr('data-filter-name');

                      angular.forEach($scope.filters, function (filter) {

                        if(filter.name === filterName) {

                          if(filter.restrictedSuggestedValues) {

                            Search.Filtering.add(filter);

                          } else {

                            filter.notFiltered = !filter.notFiltered;

                            if(!filter.notFiltered) {

                              Search.Filtering.add(filter);

                            }

                          }

                        }

                      });

                    }

                  });

                }

              });

            }

        };

    }]);

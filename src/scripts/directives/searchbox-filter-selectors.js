'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterSelectors
 * @description
 * # Implementation of paasbSearchBoxFilterSelectors
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterSelectors', [
      'FILTERS',
      function (FILTERS) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filter-selectors.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filtering': '=',

              'filter': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                copy = _.cloneDeep(FILTERS.SELECTORS),

                filter = $scope.filter;

              angular.extend($scope, {

                'availableSelectors': null,

                'filter': angular.extend(filter, {

                  'hasFilterSelectors': $element

                }),

                takeSelector: function (selector) {

                  angular.forEach($scope.availableSelectors, function (availableSelector) {

                    availableSelector.selected = false;

                  });

                  filter.selector = selector;

                  selector.selected = true;

                  if(filter.value) {

                    Filtering.update(filter);

                  }

                  $scope.reAutoSize();

                  var input = filter.element.find('input')[0];

                  input.focus();

                },

                setDefaultSelector: function () {

                  angular.forEach($scope.availableSelectors, function (availableSelector) {

                    if(availableSelector.selected) {

                      filter.selector = availableSelector;

                    }

                  });

                  if(!filter.selector && $scope.availableSelectors &&

                    $scope.availableSelectors.length) {

                      var selector = $scope.availableSelectors[0];

                      selector.selected = true;

                      filter.selector = selector;

                  }

                  return $scope;

                },

                setAvailableSelectors: function () {

                  var availableSelectors = [];

                  angular.forEach(copy, function (selector) {

                    var allowed = true;

                    angular.forEach(selector.notAllowed, function (notAllowed) {

                      if(filter[notAllowed]) {

                        allowed = false;

                      }

                    });

                    if(allowed) {

                      availableSelectors.push(selector);

                    }

                  });

                  $scope.availableSelectors = availableSelectors;

                  return $scope;

                }

              });

              $scope
                .setAvailableSelectors()
                .setDefaultSelector();

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFiltering
 * @description
 * # Implementation of paasbSearchBoxFiltering
 */

angular.module('paasb')

    .directive('paasbSearchBoxFiltering', [
      'paasbUtils',
      'paasbUi',
      '$document',
      '$timeout',
      function (paasbUtils, paasbUi, $document, $timeout) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filtering.html',

            'require': '^paasbSearchBox',

            'scope': {

              'filters': '=',

              'search': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Search = null;

              $scope.$watch('active', function (__new, __old) {

                if(__new && !$scope.windowClickedFn) {

                  $timeout(function () {

                    $scope.windowClickedFn = $document.on('click', $scope.windowClicked);

                  }, 25);

                } else {

                  if($scope.windowClickedFn) {

                    $document.off('click', $scope.windowClicked);

                    $scope.windowClickedFn = null;

                  }

                }

              });

              $scope.$watch('search', function (__new, __old) {

                if((__new !== __old) && angular.isObject(__new)) {

                  Search = __new;

                  $scope.filters = _.cloneDeep($scope.filters);

                  $scope.filters
      							.slice()
      							.reverse()
      							.forEach(function (filter, filterIndex, filterObject) {

                      filter.notFiltered = true;

                      if(filter.root) {

                        filter.filteredFrom = '<i class="fa fa-level-up"></i> (Derived from ' +

                          'Root <i class="fa fa-angle-double-right"></i> ' + filter.root + ')';

                      }

                      if(filter.child) {

                        filter.filteredFrom = '<i class="fa fa-level-down"></i> (Derived from ' + filter.child + ')';

                      }

                      if(filter.dontFilter) {

                        $scope.filters.splice(filterObject.length - 1 - filterIndex, 1);

                      }

                    });

                  angular.extend($scope, {

                    'active': false,

                    'Utils': paasbUtils,

                    windowClicked: function (ev) {

                      var target = ev.target,

                        elem = $element[0];

                      if(!elem.contains(target)) {

                        paasbUi.extend($scope, {

                          'active': false

                        });

                      }

                    },

                    toggleFilters: function () {

                      $scope.active = !$scope.active;

                    },

                    addFilterAndClose: function (filter) {

                      Search.Filtering.add(filter);

                      $scope.active = false;

                    },

                    getParentByAttribute: function (target, nodeName, attrName) {

                      var looping = true,

                        looped = 0,

                        el = null;

                      target = angular.element(target);

                      while(looping) {

                        if(target[0] === document) {

                          break;

                        }

                        var nName = target[0].nodeName.toLowerCase();

                        if(nName === nodeName.toLowerCase()) {

                          if(target.attr(attrName)) {

                            el = target;

                            looping = false;

                            break;

                          }

                        }

                        target = target.parent();

                      };

                      return el;

                    },

                    addFilter: function (ev) {

                      var self = this,

                        target = self.getParentByAttribute(ev.target, 'li', 'data-filter-name'),

                        filterName = target.attr('data-filter-name');

                      angular.forEach($scope.filters, function (filter) {

                        if(filter.name === filterName) {

                          if(filter.restrictedSuggestedValues) {

                            self.addFilterAndClose(filter);

                          } else {

                            filter.notFiltered = !filter.notFiltered;

                            if(!filter.notFiltered) {

                              self.addFilterAndClose(filter);

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

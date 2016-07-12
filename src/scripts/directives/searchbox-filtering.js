'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFiltering
 * @description
 * # Implementation of paasbSearchBoxFiltering
 */

angular.module('paasb')

    .directive('paasbSearchBoxFiltering', [
      '$document',
      '$timeout',
      '$window',
      'paasbUtils',
      'paasbUi',
      function ($document, $timeout, $window, paasbUtils, paasbUi) {

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

                position: function () {

                  if($scope.active) {

                    $timeout(function () {

                      var el = $element.parent(),

                        list = $element.find('ul'),

                        listBoundingBox = list[0].getBoundingClientRect(),

                        elBoundingBox = el[0].getBoundingClientRect();

                      list
                        .css('top', (elBoundingBox.height - 5) + 'px')
                        .css('width', (elBoundingBox.width + paasbUtils.getStyle(el[0], 'padding-right') +

                          paasbUtils.getStyle(el[0], 'padding-left') -

                          paasbUtils.getScrollbarWidth() / 2) + 'px');

                    }, 25);

                  }

                },

                toggleFilters: function () {

                  paasbUi.extend($scope, {

                    'active': !$scope.active

                  });

                  this.position();

                },

                addFilterAndClose: function (filter) {

                  Search.Filtering.add(filter);

                  paasbUi.extend($scope, {

                    'active': !$scope.active

                  });

                },

                registerEvents: function () {

                  angular
                    .element($window)
                    .on('resize', function () {

                      $scope.position();

                    });

                },

                addFilter: function (ev) {

                  var self = this,

                    target = paasbUtils.getParentByAttribute(ev.target, 'li', 'data-filter-name'),

                    filterName = target.attr('data-filter-name');

                  angular.forEach($scope.filters, function (filter) {

                    if(filter.name === filterName) {

                      if(filter.restrictedSuggestedValues) {

                        self.addFilterAndClose(filter);

                      } else {

                        if(!filter.multi) {

                          filter.notFiltered = !filter.notFiltered;

                          if(!filter.notFiltered) {

                            self.addFilterAndClose(filter);

                          }

                        } else {

                          self.addFilterAndClose(filter);

                        }

                      }

                    }

                  });

                }

              });

              $scope.$watch('search', function (__new, __old) {

                if((__new !== __old) && angular.isObject(__new)) {

                  Search = __new;

                  $scope.filters = angular.copy($scope.filters);

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

                  $scope
                    .registerEvents();

                }

              });

            }

        };

    }]);

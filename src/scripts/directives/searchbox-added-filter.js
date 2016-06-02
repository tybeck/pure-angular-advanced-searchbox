'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAddedFilter
 * @description
 * # Implementation of paasbSearchBoxAddedFilter
 */

angular.module('paasb')

    .directive('paasbSearchBoxAddedFilter', [
      '$timeout',
      '$document',
      'paasbUi',
      'paasbUtils',
      function ($timeout, $document, paasbUi, paasbUtils) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-added-filter.html',

            'require': '^paasbSearchBoxFiltering',

            'scope': {

              'filter': '=',

              'filtering': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter,

                input;

              filter.loading = false;

              if(paasbUtils.isURL(filter.suggestedValues) || (paasbUtils.isURL(filter.source) && filter.reloadOnCreate)) {

                paasbUi.safeApply($scope, function () {

                  var url = filter.source || filter.suggestedValues;

                  angular.extend(filter, {

                    'loading': true,

                    'suggestedValues': [],

                    'source': url

                  });

                });

                Filtering
                  .loadSource(filter)
                    .then(function (data) {

                      paasbUi.safeApply($scope, function () {

                        angular.extend(filter, {

                          'suggestedValues': data,

                          'loading': false,

                          'value': ''

                        });

                      });

                    });

              } else {

                filter.value = '';

              }

              angular.extend($scope, {

                'Utils': paasbUtils,

                'events': {

                  searchboxClick: function (ev) {

                    var isChild = $element[0].contains(ev.target);

                    var isSelf = $element[0] == ev.target;

                    var isInside = isChild || isSelf;

                    if(!isInside) {

                      $scope.closeFilter();

                    }

                  },

                  inputKeyEvents: function (ev) {

                    if(ev.keyCode === 13) {

                      $scope.closeFilter();

                    }

                  }

                },

                takeSuggestion: function (val) {

                  $scope.value = val;

                },

                closeFilter: function () {

                  var self = this;

                  paasbUi.safeApply($scope, function () {

                    filter.editing = false;

                    $document.unbind('click', self.events.searchboxClick);

                    if(!filter.value) {

                      Filtering.remove(filter);

                    } else {

                      if(filter.suggestedValue) {

                        filter.value = filter.suggestedValue.value;

                      } else {

                        if(filter.restrictedSuggestedValues) {

                          Filtering.remove(filter);

                        }

                      }

                    }

                  });

                },

                openFilter: function () {

                  var self = this;

                  if(!filter.editing) {

                    filter.editing = true;

                    $timeout(function () {

                      $document.bind('click', self.events.searchboxClick);

                    }, 25);

                    $scope.setFocus();

                  }

                },

                destroy: function () {

                  return Filtering.remove($scope.filter);

                },

                getElements: function () {

                  input = $element.find('input');

                  return $scope;

                },

                registerEvents: function (events) {

                  input.on('keyup', events.inputKeyEvents);

                  return $scope;

                },

                setFocus: function () {

                  $timeout(function () {

                    if(input) {

                      input[0].focus();

                    }

                  }, 50);

                  return $scope;

                },

                addWatch: function () {

                  $scope.$watch('value', function (__new) {

                    filter.value = __new || '';

                    if(filter.value) {

                      Filtering.update(filter);

                    }

                  });

                  return $scope;

                }

              });

              $scope
                .getElements()
                .registerEvents($scope.events)
                .addWatch()
                .openFilter();

            }

        };

    }]);

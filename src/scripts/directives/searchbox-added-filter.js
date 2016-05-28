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
      'Ui',
      function ($timeout, $document, Ui) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-added-filter.html',

            'require': '^paasbSearchBox',

            'scope': {

              'filter': '=',

              'filtering': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter,

                input;

              angular.extend($scope, {

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

                      Ui.safeApply($scope, function () {

                        filter.editing = false;

                      });

                    }

                  }

                },

                closeFilter: function () {

                  var self = this;

                  Ui.safeApply($scope, function () {

                    filter.editing = false;

                    $document.unbind('click', self.events.searchboxClick);

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

                }

              });
console.log('okay');
              $scope
                .getElements()
                .registerEvents($scope.events)
                .openFilter();

            }

        };

    }]);

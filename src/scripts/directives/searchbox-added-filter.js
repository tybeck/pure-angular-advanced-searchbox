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
      'Ui',
      function ($timeout, Ui) {

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

                  inputKeyEvents: function (ev) {

                    if(ev.keyCode === 13) {

                      Ui.safeApply($scope, function () {

                        filter.editing = false;

                      });

                    }

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

              $scope
                .getElements()
                .registerEvents($scope.events)
                .setFocus();

            }

        };

    }]);

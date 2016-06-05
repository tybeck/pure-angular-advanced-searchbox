'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAutoComplete
 * @description
 * # Implementation of paasbSearchBoxAutoComplete
 */

angular.module('paasb')

    .directive('paasbSearchBoxAutoComplete', [
      'paasbUi',
      'paasbUtils',
      'paasbAutoComplete',
      function (paasbUi, paasbUtils, paasbAutoComplete) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-auto-complete.html',

            'require': '^paasbSearchBox',

            'scope': {

              'query': '=',

              'config': '='

            },

            controller: function ($scope, $element) {

              var config = $scope.config;

              $scope.$watch('query', function (__new) {

                if($scope.tookSuggestion !== __new) {

                  $scope.tookSuggestion = null;

                  if(__new) {

                    paasbAutoComplete
                      .load(config.autoCompleteUrl)
                        .then(function (data) {

                          $scope.autoSuggestions = data;

                        });

                  }

                }

              });

              angular.extend($scope, {

                'Utils': paasbUtils,

                'tookSuggestion': null,

                takeAutoComplete: function (suggestion) {

                  $scope.tookSuggestion = suggestion;

                  $scope.$emit('take.autoSuggestion', suggestion);

                }

              });

            }

        };

    }]);

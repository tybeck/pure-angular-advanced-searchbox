'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAutoSuggestions
 * @description
 * # Implementation of paasbSearchBoxAutoSuggestions
 */

angular.module('paasb')

    .directive('paasbSearchBoxAutoSuggestions', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-auto-suggestions.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filtering': '=',

              'filter': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter;

            }

        };

    }]);

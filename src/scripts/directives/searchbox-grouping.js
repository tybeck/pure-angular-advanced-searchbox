'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxGrouping
 * @description
 * # Implementation of paasbSearchBoxGrouping
 */

angular.module('paasb')

    .directive('paasbSearchBoxGrouping', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-grouping.html',

            'require': '^paasbSearchBox',

            controller: function ($scope, $element, $attrs) {

              var Grouper = null;

              if($scope.Search && $scope.Search.Grouper) {

                Grouper = $scope.Search.Grouper;

                angular.extend($scope, {

                  toggleGrouping: function () {

                    return Grouper.toggle();

                  }

                });

              }

            }

        };

    }]);

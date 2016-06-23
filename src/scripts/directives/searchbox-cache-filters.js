'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxCacheFilter
 * @description
 * # Implementation of paasbSearchBoxCacheFilter
 */

angular.module('paasb')

    .directive('paasbSearchBoxCacheFilter', [
      'paasbMemory',
      'paasbUi',
      function (paasbMemory, paasbUi) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-cache-filters.html',

            'require': '^paasbSearchBox',

            controller: function ($scope) {

              paasbUi.extend($scope, {

                'cacheActive': paasbMemory.getAndSet('cache') || false,

                handleCache: function () {

                  if(!$scope.paasbSearchBoxCacheFilterPermanent) {

                    $scope.cacheActive = !$scope.cacheActive;

                    paasbMemory.getAndSet('cache', $scope.cacheActive);

                  }

                }

              });

            }

        };

    }]);

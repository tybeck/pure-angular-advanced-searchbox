'use strict';

/**
 * @ngdoc filter
 * @name paasb.filter:paasbClean
 * @description
 * # paasbClean
 */

angular.module('paasb')

  .filter('paasbClean', [function () {

      return function (_data) {

        angular.forEach(_data, function (point) {

          if(point && !point.$$timestamp) {

            point.$$timestamp = new Date().getTime();

          }

          point.$$modified = new Date().getTime();

        });

        return _data;

      };

  }]);

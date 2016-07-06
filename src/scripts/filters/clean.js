'use strict';

/**
 * @ngdoc filter
 * @name paasb.filter:paasbClean
 * @description
 * # paasbClean
 */

angular.module('paasb')

  .filter('paasbClean', [function () {

      return function (_data, middleware) {

        if(_data && !_data.$$timestamp) {

          _data.$$timestamp = new Date().getTime();

        }

        _data.$$modified = new Date().getTime();

        if(middleware) {

          if(typeof middleware === 'function') {

            _data.modifiedValue = middleware(_data.value);

          } else if (angular.isArray(middleware)) {

            var modifiedValue = _data.value;

            angular.forEach(middleware, function (m) {

              modifiedValue = m(modifiedValue);

            });

            _data.modifiedValue = modifiedValue;

          }

        }

        return _data;

      };

  }]);

'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbGrouping
 * @description
 * # paasbGrouping Services
 */

angular.module('paasb')

	.factory('paasbGrouping', [
		'paasbUi',
    function (paasbUi) {

      var scope = null,

				config = null;

  		return function (_scope, _config) {

        scope = _scope;

				config = _config;

        var Search = null;

        scope.$watch('Search', function (__new, __old) {

          if(angular.isObject(__new)) {

            Search = __new;

          }

        });

				angular.extend(scope, {

					'isGroupingEnabled': false

				});

        angular.extend(this, {

					toggle: function () {

						paasbUi.extend(scope, {

							'isGroupingEnabled': !scope.isGroupingEnabled

						});

					}

        });

      };

	}]);

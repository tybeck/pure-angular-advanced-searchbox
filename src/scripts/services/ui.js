'use strict';

/**
 * @ngdoc service
 * @name paasb.service:Ui
 * @description
 * # Ui Services
 */

angular.module('paasb')

	.factory('Ui', [
		'$timeout',
    function ($timeout) {

			var Ui = {

				extend: function (scope, opts) {

					this.safeApply(scope, function () {

						angular.extend(scope, opts);

					});

				},

				safeApply: function($scope, fn) {

					var phase = $scope.$root.$$phase;

					if(phase === '$apply' || phase === '$digest') {

						if(fn && (typeof(fn) === 'function')) {

							fn();

						}

					} else {

						$scope.$apply(fn);

					}

				},

				apply: function (fn, ms) {

					return $timeout(fn, ms || 0);

				}

  		};

  		return Ui;

	}]);

'use strict';

/**
 * @ngdoc service
 * @name paasb.service:Utils
 * @description
 * # Utils Services
 */

angular.module('paasb')

	.factory('Utils', [
    '$sce',
    function ($sce) {

			var Utils = {

        trust: function (html) {

          return $sce.trustAsHtml(html);

        }

  		};

  		return Utils;

	}]);

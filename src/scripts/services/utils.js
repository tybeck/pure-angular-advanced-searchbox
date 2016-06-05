'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbUtils
 * @description
 * # paasbUtils Services
 */

angular.module('paasb')

	.factory('paasbUtils', [
    '$sce',
		'$window',
    function ($sce, $window) {

			var paasbUtils = {

				getStyle: function (elem, style) {

					return parseInt($window.getComputedStyle(elem, null).getPropertyValue(style));

				},

        trust: function (html) {

          return $sce.trustAsHtml(html);

        },

        isURL: function (url) {

          var expression = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|' +

            '2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u' +

            '00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a' +

            '-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',

            regex = new RegExp(expression, 'i');

          return regex.test(url);

        },

				getDeepValue: function (root, path) {

					var segments = path.split('.'),

				      cursor = root,

				      target;

				  for (var i = 0; i < segments.length; ++i) {

						target = cursor[segments[i]];

						if (typeof target == "undefined") return void 0;

						cursor = target;

				  }

				  return cursor;

				}

  		};

  		return paasbUtils;

	}]);

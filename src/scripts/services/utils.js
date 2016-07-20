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

				uuid: function () {

					var d = Date.now();

					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

						var r = (d + Math.round(Math.random() * 16)) % 16 | 0;

						d = Math.floor(d / 16);

						return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

					});

				},

				isJson: function (str) {

					try {

						JSON.parse(str);

					} catch (e) {

						return false;

					}

					return true;

				},

				removeObjectProperties: function(obj, props) {

					for(var i = 0; i < props.length; i++) {

						if(obj.hasOwnProperty(props[i])) {

							delete obj[props[i]];

						}

					}

				},

				getScrollbarWidth: function () {

					var scrollDiv = document.createElement('div');

					scrollDiv.className = 'scrollbar-measure';

					document.body.appendChild(scrollDiv);

					var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

					document.body.removeChild(scrollDiv);

					return scrollbarWidth;

				},

				isParent: function(refNode, otherNode) {

					var parent = otherNode.parentNode;

					do {

						if (refNode == parent) {

							return true;

						} else {

							parent = parent.parentNode;

						}

					} while (parent);

					return false;

				},

	      getParentByAttribute: function (target, nodeName, attrName) {

	        var looping = true,

	          looped = 0,

	          el = null;

	        target = angular.element(target);

	        while(looping) {

	          if((target[0] === document)

							|| (!target[0] || !target[0].nodeName)) {

	            	break;

	          }

	          var nName = target[0].nodeName.toLowerCase();

	          if(nName === nodeName.toLowerCase()) {

	            if(target.attr(attrName)) {

	              el = target;

	              looping = false;

	              break;

	            }

	          }

	          target = target.parent();

	        };

	        return el;

	      },

				getStyle: function (elem, style) {

					if(elem && elem.length) {

						elem = elem[0];

					}

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

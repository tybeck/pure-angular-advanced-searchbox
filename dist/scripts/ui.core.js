'use strict';

angular.module('paasb', [

]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbAutoSize
 * @description
 * # Implementation of paasbAutoSize
 */

angular.module('paasb')

    .directive('paasbAutoSize', [
      '$parse',
      function ($parse) {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              $attrs.$observe('paasbAutoSize', function () {

                var filter = $parse($attrs.paasbAutoSize)($scope),

                  getStyle = function(elem, style) {

                    return parseInt(window.getComputedStyle(elem, null).getPropertyValue(style));

                  };

                var filterSelectorsHeight = 0;

                angular
                  .element($element)
                    .ready(function () {

                      var searchInput = filter.element.find('input')[0],

                        bounding = searchInput.getBoundingClientRect(),

                        boundingParent = filter.element[0].getBoundingClientRect(),

                        left = (bounding.left - boundingParent.left);

                      if(filter.hasFilterSelectors) {

                        var selectorElem = filter.hasFilterSelectors,

                          elem = $element[0];

                        if(!selectorElem[0].contains(elem)) {

                          filterSelectorsHeight = selectorElem.find('ul')[0]

                            .getBoundingClientRect().height + bounding.height;

                        }

                      }

                      var extraSpace = getStyle(searchInput, 'border-left-width');

                      $element
                        .css('left', left + 'px')
                        .css('width', (bounding.width - extraSpace) + 'px')
                        .css('top', filterSelectorsHeight ? (filterSelectorsHeight + 'px') : 'auto');

                });

              });

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAddedFilter
 * @description
 * # Implementation of paasbSearchBoxAddedFilter
 */

angular.module('paasb')

    .directive('paasbSearchBoxAddedFilter', [
      '$timeout',
      '$document',
      'Ui',
      'Utils',
      function ($timeout, $document, Ui, Utils) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-added-filter.html',

            'require': '^paasbSearchBoxFiltering',

            'scope': {

              'filter': '=',

              'filtering': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter,

                input;

              filter.loading = false;

              if(Utils.isURL(filter.suggestedValues) || (Utils.isURL(filter.source) && filter.reloadOnCreate)) {

                Ui.safeApply($scope, function () {

                  var url = filter.source || filter.suggestedValues;

                  angular.extend(filter, {

                    'loading': true,

                    'suggestedValues': [],

                    'source': url

                  });

                });

                Filtering
                  .loadSource(filter)
                    .then(function (data) {

                      Ui.safeApply($scope, function () {

                        angular.extend(filter, {

                          'suggestedValues': data,

                          'loading': false,

                          'value': ''

                        });

                      });

                    });

              } else {

                filter.value = '';

              }

              angular.extend($scope, {

                'Utils': Utils,

                'events': {

                  searchboxClick: function (ev) {

                    var isChild = $element[0].contains(ev.target);

                    var isSelf = $element[0] == ev.target;

                    var isInside = isChild || isSelf;

                    if(!isInside) {

                      $scope.closeFilter();

                    }

                  },

                  inputKeyEvents: function (ev) {

                    if(ev.keyCode === 13) {

                      $scope.closeFilter();

                    }

                  }

                },

                takeSuggestion: function (val) {

                  filter.value = val;

                },

                closeFilter: function () {

                  var self = this;

                  Ui.safeApply($scope, function () {

                    filter.editing = false;

                    $document.unbind('click', self.events.searchboxClick);

                    if(!filter.value) {

                      Filtering.remove(filter);

                    } else {

                      if(filter.suggestedValue) {

                        filter.value = filter.suggestedValue.value;

                      } else {

                        if(filter.restrictedSuggestedValues) {

                          Filtering.remove(filter);

                        }

                      }

                    }

                  });

                },

                openFilter: function () {

                  var self = this;

                  if(!filter.editing) {

                    filter.editing = true;

                    $timeout(function () {

                      $document.bind('click', self.events.searchboxClick);

                    }, 25);

                    $scope.setFocus();

                  }

                },

                destroy: function () {

                  return Filtering.remove($scope.filter);

                },

                getElements: function () {

                  input = $element.find('input');

                  return $scope;

                },

                registerEvents: function (events) {

                  input.on('keyup', events.inputKeyEvents);

                  return $scope;

                },

                setFocus: function () {

                  $timeout(function () {

                    if(input) {

                      input[0].focus();

                    }

                  }, 50);

                  return $scope;

                }

              });

              $scope
                .getElements()
                .registerEvents($scope.events)
                .openFilter();

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterSelectors
 * @description
 * # Implementation of paasbSearchBoxFilterSelectors
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterSelectors', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filter-selectors.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filter': '='

            },

            controller: function ($scope, $element, $attrs) {

              $scope.filter.hasFilterSelectors = $element;

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFiltering
 * @description
 * # Implementation of paasbSearchBoxFiltering
 */

angular.module('paasb')

    .directive('paasbSearchBoxFiltering', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filtering.html',

            'require': '^paasbSearchBox',

            'scope': {

              'filters': '=',

              'search': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Search = null;

              $scope.$watch('search', function (__new, __old) {

                if((__new !== __old) && angular.isObject(__new)) {

                  Search = __new;

                  angular.forEach($scope.filters, function (filter) {

                    filter.notFiltered = true;

                  });

                  angular.extend($scope, {

                    addFilter: function (ev) {

                      var target = angular.element(ev.target),

                        filterName = target.attr('data-filter-name');

                      angular.forEach($scope.filters, function (filter) {

                        if(filter.name === filterName) {

                          if(filter.restrictedSuggestedValues) {

                            Search.Filtering.add(filter);

                          } else {

                            filter.notFiltered = !filter.notFiltered;

                            if(!filter.notFiltered) {

                              Search.Filtering.add(filter);

                            }

                          }

                        }

                      });

                    }

                  });

                }

              });

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBox
 * @description
 * # Implementation of paasbSearchBox
 */

angular.module('paasb')

    .directive('paasbSearchBox', [
      'Ui',
      'Filtering',
      function (Ui, Filtering) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox.html',

            'scope': {

              'searchParams': '=?',

              'paasbSearchBoxFiltering': '=?',

              'placeholder': '@'

            },

            controller: function ($scope, $element, $attrs) {

              var params = null,

                Filterer = null,

                searchBox = {

                  'searchInputId': ('searchInput-' + _.uuid()),

                  make: function (name, extend, method) {

                    if(!angular[method]($scope[name])) {

                      if(method === 'isObject') {

                        $scope[name] = angular.extend({}, extend);

                      } else {

                        $scope[name] = extend;

                      }

                    }

                    return this;

                  },

                  'events': {

                    handleGarbage: function () {

                      if((params.query && params.query.length) || $scope.hasFilters) {

                        params.query = '';

                        angular.forEach(params, function (param) {

                          if(param !== 'query') {

                            delete params[param];

                          }

                        });

                        Filterer.removeAll();

                      }

                    }

                  },

                  configure: function () {

                    this
                      .make('searchParams', {

                        'query': ''

                      }, 'isObject')
                      .make('paasbSearchBoxFiltering', [], 'isArray');

                    params = $scope.searchParams;

                    Ui.extend($scope, {

                      'searchInputId': this.searchInputId

                    });

                    return this;

                  },

                  addEvents: function () {

                    angular.extend($scope, this.events);

                    return this;

                  },

                  register: function () {

                    Filterer = new Filtering($scope);

                    angular.extend($scope, {

                      'Search': {

                        'Filtering': Filterer

                      }

                    });

                    return this;

                  },

                  dom: function () {

                    var searchInput = angular.element(document.getElementById(this.searchInputId)),

                      searchWrapper = searchInput.parent();

                    Ui.extend($scope, {

                      'input': searchInput,

                      'wrapper': searchWrapper

                    });

                    return this;

                  }

                };

              angular
                .element($element)
                .ready(function () {

                  searchBox
                    .register()
                    .configure()
                    .addEvents()
                    .dom();

                });

            }

        };

    }]);

'use strict';

/**
 * @ngdoc filter
 * @name paasb.filter:suggest
 * @description
 * # suggest filter
 */

angular.module('paasb')

  .filter('suggest', [function () {

    return _.memoize(function (suggestions, value, filter, suggested) {

      if(!value) {

        var modifiedSuggestions = [];

        angular.forEach(suggestions, function (suggestion) {

          modifiedSuggestions.push({

            'modified': suggestion,

            'value': suggestion

          });

        });

        return modifiedSuggestions;

      }

      var percentageSuggestions = [],

        showSuggestions = [],

        val = new String(value);

      angular.forEach(suggestions, function (suggestion) {

        var lSuggestion = suggestion.toLowerCase(),

          lVal = val.toLowerCase();

        if(lSuggestion.indexOf(lVal) !== -1) {

          var matches = [],

            looping = true,

            needle = -1;

          while(looping) {

            needle = lSuggestion.indexOf(lVal, ((matches.length) ? (needle + 1) : needle));

            if(needle !== -1) {

              var len = lVal.length;

              matches.push({

                'start': needle,

                'end': len,

                'len': len - 1

              });

            } else {

              looping = false;

            }

          };

          var modifiedSuggestion = suggestion,

            addedCharacters = 0;

          angular.forEach(matches, function (match) {

            var firstString = modifiedSuggestion.substr(0, match.start + addedCharacters),

              middleString = '<b>' + modifiedSuggestion.substr(match.start + addedCharacters, match.end) + '</b>',

              endString = modifiedSuggestion.substr(match.start + addedCharacters + 1 + match.len, modifiedSuggestion.length);

            modifiedSuggestion = firstString + middleString + endString;

            addedCharacters += 7;

          });

        }

        if(modifiedSuggestion) {

          showSuggestions.push({

            'modified': modifiedSuggestion,

            'value': suggestion

          });

        }

      });

      filter.suggestedValue = (showSuggestions && showSuggestions.length ? showSuggestions[0] : null);

      return showSuggestions;

    }, function (items, field) {

      return items.length + field;

    });

  }]);

'use strict';

/**
 * @ngdoc service
 * @name paasb.service:Filtering
 * @description
 * # Filtering Services
 */

angular.module('paasb')

	.factory('Filtering', [
		'$q',
    '$compile',
		'$http',
		'Ui',
    function ($q, $compile, $http, Ui) {

      var scope = null;

  		return function (_scope) {

        scope = _scope;

        var Search = null;

        scope.$watch('Search', function (__new, __old) {

          if(angular.isObject(__new)) {

            Search = __new;

          }

        });

        angular.extend(this, {

          'addedFilters': [],

          add: function (filter) {

            var childScope = scope.$new(true),

							clonedFilter = _.clone(filter);

						angular.extend(childScope, {

              'filter': clonedFilter,

							'filtering': this

            });

						var compiledElement = $compile('<paasb-search-box-added-filter filter="filter" filtering="filtering" />')(childScope);

            scope.wrapper.prepend(compiledElement);

						angular.extend(clonedFilter, {

							'element': compiledElement,

							'$filter': filter,

							'scope': childScope,

							'uuid': _.uuid()

						});

						scope.hasFilters = true;

            this.addedFilters.push(clonedFilter);

          },

          remove: function (filter) {

						var self = this;

						this.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter, addedIndex, addedObject) {

								if(addedFilter.uuid === filter.uuid) {

									addedFilter.element.remove();

									addedFilter.scope.$destroy();

									filter.$filter.notFiltered = true;

									self.addedFilters.splice(addedObject.length - 1 - addedIndex, 1);

								}

							});

							if(this.addedFilters && !this.addedFilters.length) {

								scope.hasFilters = false;

							}

          },

          removeAll: function () {

						var self = this;

						this.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter) {

								return self.remove(addedFilter);

							});

          },

					loadSource: function (filter) {

						var deferred = $q.defer();

						$http
							.get(filter.source)
								.then(function (options) {

									if(filter.suggestedDataPoint) {

										return deferred.resolve(options && options.data[filter.suggestedDataPoint] ?

											options.data[filter.suggestedDataPoint] : null);

									}

									return deferred.resolve(options ? options.data : null);

						});

						return deferred.promise;

					}

        });

      };

	}]);

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

        },

        isURL: function (url) {

          var expression = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|' +

            '2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u' +

            '00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a' +

            '-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',

            regex = new RegExp(expression, 'i');

          return regex.test(url);

        }

  		};

  		return Utils;

	}]);

angular.module('paasb').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/searchbox-added-filter.html',
    "\n" +
    "<div ng-click=\"openFilter();\" class=\"paasb-searchbox-added-filter\"><span ng-bind=\"filter.displayName + ':'\"></span><span ng-bind=\"filter.value\" ng-hide=\"filter.editing\"></span>\n" +
    "  <input type=\"text\" ng-model=\"filter.value\" ng-hide=\"!filter.editing\"/><span ng-hide=\"!filter.loading\">Loading...</span>\n" +
    "  <paasb-search-box-filter-selectors filter=\"filter\"></paasb-search-box-filter-selectors>\n" +
    "  <div ng-if=\"filter.suggestedValues\">\n" +
    "    <ul ng-hide=\"!filter.editing\" paasb-auto-size=\"filter\" ng-if=\"!filter.loading\">\n" +
    "      <li ng-repeat=\"suggestion in filter.suggestedValues | suggest: filter.value:filter\" ng-click=\"takeSuggestion(suggestion.value)\"><span ng-bind-html=\"Utils.trust(suggestion.modified)\"></span></li>\n" +
    "    </ul>\n" +
    "  </div><i ng-click=\"destroy();\" class=\"fa fa-times\"></i>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/searchbox-filter-selectors.html',
    "\n" +
    "<div ng-class=\"{ 'loaded' : !filter.loading }\" class=\"paasb-searchbox-filter-selectors\">\n" +
    "  <ul paasb-auto-size=\"filter\">\n" +
    "    <li>Yo.</li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/searchbox-filtering.html',
    "\n" +
    "<div class=\"paasb-filtering paasb-clearfix\"><span>Filters:</span>\n" +
    "  <ul>\n" +
    "    <li ng-repeat=\"filter in filters\" data-filter-name=\"{{filter.name}}\" ng-bind=\"filter.displayName\" ng-click=\"addFilter($event);\" ng-if=\"filter.notFiltered\"></li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('views/directives/searchbox.html',
    "\n" +
    "<div class=\"paasb-searchbox\">\n" +
    "  <div class=\"paasb-searchbox-wrapper\"><i ng-class=\"{ 'fa-search': !searchParams.query.length, 'fa-trash': ((searchParams.query &amp;&amp; searchParams.query.length) || hasFilters) }\" ng-click=\"handleGarbage();\" class=\"fa\"></i>\n" +
    "    <input type=\"text\" ng-model=\"searchParams.query\" placeholder=\"{{placeholder}}\" id=\"{{searchInputId}}\"/>\n" +
    "  </div>\n" +
    "  <paasb-search-box-filtering search=\"Search\" filters=\"paasbSearchBoxFiltering\" ng-if=\"paasbSearchBoxFiltering &amp;&amp; paasbSearchBoxFiltering.length\"></paasb-search-box-filtering>\n" +
    "</div>"
  );

}]);

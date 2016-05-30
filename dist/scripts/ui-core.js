'use strict';

angular.module('paasb', [

]);

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

            'require': '^paasbSearchBox',

            'scope': {

              'filter': '=',

              'filtering': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter,

                input;

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

                          filter.notFiltered = !filter.notFiltered;

                          if(!filter.notFiltered) {

                            Search.Filtering.add(filter);

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

                  'searchInputId': ('searchInput-' + new Date().getTime()),

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

      return _.memoize(function (suggestions, value, filter) {

        console.log(suggestions, filter);

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
    '$compile',
    function ($compile) {

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

            var childScope = scope.$new(true);

						angular.extend(childScope, {

              'filter': filter,

							'filtering': this

            });

						var compiledElement = $compile('<paasb-search-box-added-filter filter="filter" filtering="filtering" />')(childScope);

            scope.wrapper.prepend(compiledElement);

						angular.extend(filter, {

							'element': compiledElement,

							'scope': childScope

						});

						scope.hasFilters = true;

            this.addedFilters.push(filter);

          },

          remove: function (filter) {

						var self = this;

						this.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter, addedIndex, addedObject) {

								if(addedFilter.name === filter.name) {

									var attributes = [

										'element',

										'scope',

										'value',

										'editing',

										'suggestedValue'

									];

									addedFilter.element.remove();

									addedFilter.scope.$destroy();

									angular.forEach(attributes, function (attribute) {

										delete addedFilter[attribute];

									});

									addedFilter.notFiltered = true;

									scope.hasFilters = false;

									self.addedFilters.splice(addedObject.length - 1 - addedIndex, 1);

								}

							});

          },


          removeAll: function () {

						var self = this;

						this.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter) {

								return self.remove(addedFilter);

							});

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
    function () {

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

        }

  		};

  		return Utils;

	}]);

angular.module('paasb').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/searchbox-added-filter.html',
    "\n" +
    "<div ng-click=\"openFilter();\" class=\"paasb-searchbox-added-filter\"><span ng-bind=\"filter.displayName + ':'\"></span><span ng-bind=\"filter.value\" ng-hide=\"filter.editing\"></span>\n" +
    "  <input type=\"text\" ng-model=\"filter.value\" ng-hide=\"!filter.editing\"/>\n" +
    "  <ul ng-hide=\"!filter.editing\">\n" +
    "    <li ng-repeat=\"suggestion in filter.suggestedValues | suggest: filter.value:filter\" ng-click=\"takeSuggestion(suggestion.value)\"><span ng-bind-html=\"Utils.trust(suggestion.modified)\"></span></li>\n" +
    "  </ul><i ng-click=\"destroy();\" class=\"fa fa-times\"></i>\n" +
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

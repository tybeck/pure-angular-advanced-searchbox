'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBox
 * @description
 * # Implementation of paasbSearchBox
 */

angular.module('paasb')

    .directive('paasbSearchBox', [
      '$timeout',
      '$window',
      'paasbUi',
      'paasbFiltering',
      'paasbPlaceholders',
      'paasbMemory',
      'paasbUtils',
      function ($timeout, $window, paasbUi, paasbFiltering, paasbPlaceholders, paasbMemory, paasbUtils) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox.html',

            'scope': {

              'searchParams': '=?',

              'paasbSearchBoxFiltering': '=?',

              'paasbSearchBoxConfig': '=?',

              'paasbSearchBoxAutoComplete': '=?',

              'paasbSearchBoxCacheFilter': '=?',

              'placeholder': '@'

            },

            controller: function ($scope, $element, $attrs) {

              var params = null,

                config = null,

                autoComplete = null,

                Filterer = null,

                Placeholding = null,

                timer = null,

                searchBox = {

                  'searchInputId': ('searchInput-' + _.uuid()),

                  hasAutoCompleteConfigurations: function () {

                    return config && config.autoCompleteUrl;

                  },

                  make: function (name, extend, method, related) {

                    var val = $scope[name];

                    if(angular[method]) {

                      if(!angular[method](val)) {

                        if(method === 'isObject') {

                          val = angular.extend({}, extend);

                        } else {

                          val = extend;

                        }

                      } else {

                        if(extend && _.isEmpty(val)) {

                          $scope[name] = extend;

                          $scope[related] = extend[related];

                        }

                      }

                    } else {

                      if(this[method]) {

                        val = this[method](val);

                      }

                    }

                    return this;

                  },

                  'events': {

                    handleGarbage: function () {

                      if((params.query && params.query.length) || $scope.hasFilters) {

                        angular.extend(params, {

                          'query': '',

                          'filters': {}

                        });

                        $scope.query = '';

                        angular.forEach(params, function (param) {

                          if(param !== 'query') {

                            delete params[param];

                          }

                        });

                        Filterer.removeAll();

                      }

                    }

                  },

                  shouldStore: function () {

                    return (paasbMemory.getAndSet('cache') ||

                      $scope.paasbSearchBoxConfig.store) ? true : false;

                  },

                  configure: function () {

                    var defaultParams = {

                      'query': '',

                      'filters': {}

                    };

                    this
                      .make('searchParams', this.shouldStore() ? paasbMemory.getAll() :

                        defaultParams, 'isObject', 'query')

                      .make('paasbSearchBoxFiltering', [], 'isArray')
                      .make('paasbSearchBoxConfig', {}, 'isObject')
                      .make('paasbSearchBoxAutoComplete', {}, 'isObject');

                    if(!this.shouldStore()) {

                      paasbMemory.removeAll();

                    }

                    params = $scope.searchParams;

                    config = $scope.paasbSearchBoxConfig;

                    autoComplete = $scope.paasbSearchBoxAutoComplete;

                    $scope.autoCompleteEnabled = this.hasAutoCompleteConfigurations();

                    paasbUi.extend($scope, {

                      'searchInputId': this.searchInputId

                    });

                    return this;

                  },

                  addEvents: function () {

                    angular.extend($scope, this.events);

                    Filterer.watch(function (filters, refresh) {

                      paasbMemory.getAndSet('filters', filters);

                      if(timer) {

                        $timeout.cancel(timer);

                      }

                      if(config.delay && !refresh) {

                        timer = $timeout(function () {

                          params.filters = filters;

                        }, config.delay);

                      } else {

                        params.filters = filters;

                      }

                    });

                    $scope.$on('take.autoSuggestion', function (ev, data) {

                      $scope.skipDelay = true;

                      $scope.query = data;

                    });

                    $scope.$watch('query', function (__new) {

                      if(typeof __new !== 'undefined') {

                        if(paasbMemory.getAndSet('query') !== __new) {

                          paasbMemory.getAndSet('query', __new);

                          if(config.delay && !$scope.skipDelay) {

                            if(timer) {

                              $timeout.cancel(timer);

                            }

                            timer = $timeout(function () {

                              params.query = __new;

                            }, config.delay);

                          } else {

                            if(timer) {

                              $timeout.cancel(timer);

                            }

                            $scope.skipDelay = false;

                            params.query = __new;

                          }

                        }

                      }

                    });

                    $scope.input.on('focus', function () {

                      $scope.$broadcast('input.focused');

                    });

                    $scope.box.on('keyup', function (ev) {



                    });

                    return this;

                  },

                  register: function () {

                    Filterer = new paasbFiltering($scope, config);

                    Placeholding = new paasbPlaceholders($scope, config);

                    angular.extend($scope, {

                      'Search': {

                        'Filtering': Filterer,

                        'Placeholding': Placeholding

                      }

                    });

                    Filterer.addByMemory(params);

                    Placeholding.setup();

                    return this;

                  },

                  dom: function () {

                    var searchInput = angular.element(document.getElementById(this.searchInputId)),

                      searchBox = paasbUtils.getParentByAttribute(searchInput[0], 'div', 'data-search-box'),

                      searchWrapper = searchInput.parent();

                    paasbUi.extend($scope, {

                      'input': searchInput,

                      'wrapper': searchWrapper,

                      'box': searchBox

                    });

                    return this;

                  }

                };

              angular
                .element($element)
                .ready(function () {

                  searchBox
                    .configure()
                    .dom()
                    .register()
                    .addEvents();

                });

            }

        };

    }]);

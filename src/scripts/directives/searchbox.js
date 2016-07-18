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
      'paasbApi',
      'paasbUi',
      'paasbFiltering',
      'paasbGrouping',
      'paasbPlaceholders',
      'paasbEventHandling',
      'paasbMemory',
      'paasbUtils',
      'FILTERS',
      function ($timeout, $window, paasbApi, paasbUi, paasbFiltering, paasbGrouping, paasbPlaceholders, paasbEventHandling, paasbMemory, paasbUtils, FILTERS) {

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

              'paasbSearchBoxEnableFilteringOperators': '=?',

              'paasbSearchBoxFilterSelectors': '=?',

              'paasbSearchBoxFilterOperators': '=?',

              'paasbSearchBoxEnableGrouping': '=?',

              'placeholder': '@'

            },

            controller: function ($scope, $element, $attrs) {

              var params = null,

                config = null,

                autoComplete = null,

                Filterer = null,

                Grouper = null,

                Placeholding = null,

                API = null,

                EventHandling = null,

                timer = null,

                searchBox = {

                  'searchInputId': ('searchInput-' + paasbUtils.uuid()),

                  hasAutoCompleteConfigurations: function () {

                    return config && config.autoCompleteUrl;

                  },

                  make: function (name, extend, method, related) {

                    var val = $scope[name];

                    if(angular[method]) {

                      if(!angular[method](val)) {

                        if(method === 'isObject') {

                          $scope[name] = angular.extend({}, extend);

                        } else {

                          $scope[name] = extend;

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

                    handleEraser: function () {

                      $scope.query = '';

                      EventHandling
                        .onEraser();

                    },

                    handleSearch: function () {

                      EventHandling
                        .onChange(params);

                    },

                    handleGarbage: function () {

                      if((params.query && params.query.length) || $scope.hasFilters) {

                        Filterer.removeAll(true, true, {

                          'deleteOperators': true

                        });

                        $scope.query = '';

                        EventHandling
                          .onGarbage();

                      }

                    }

                  },

                  shouldStore: function () {

                    return (paasbMemory.getAndSet('cache') ||

                      config.store) ? true : false;

                  },

                  configure: function () {

                    var defaultParams = {

                      'query': '',

                      'filters': {}

                    },

                      configuredParams = {};

                    if($scope.paasbSearchBoxEnableFilteringOperators) {

                      angular.extend(defaultParams, {

                        'operators': []

                      });

                    }

                    if(FILTERS && FILTERS.SELECTORS && $scope.paasbSearchBoxFilterSelectors) {

                      FILTERS.SELECTORS = $scope.paasbSearchBoxFilterSelectors;

                    }

                    if(FILTERS && FILTERS.OPERATORS && $scope.paasbSearchBoxFilterOperators) {

                      FILTERS.OPERATORS = $scope.paasbSearchBoxFilterOperators;

                    }

                    this
                      .make('paasbSearchBoxFiltering', [], 'isArray')
                      .make('paasbSearchBoxConfig', {}, 'isObject')
                      .make('paasbSearchBoxAutoComplete', {}, 'isObject');

                    config = $scope.paasbSearchBoxConfig;

                    if(this.shouldStore()) {

                      configuredParams = paasbMemory.getAll();

                      if(_.isEmpty(configuredParams)) {

                        configuredParams = defaultParams;

                      }

                    } else {

                      configuredParams = defaultParams;

                    }

                    this
                      .make('searchParams', configuredParams, 'isObject', 'query');

                    params = $scope.searchParams;

                    autoComplete = $scope.paasbSearchBoxAutoComplete;

                    $scope.autoCompleteEnabled = this.hasAutoCompleteConfigurations();

                    if($scope.query) {

                      paasbUi.extend($scope, {

                        'hasQuery': true,

                        'delayedQuery': $scope.query

                      });

                    }

                    if(!this.shouldStore()) {

                      paasbMemory.removeAll();

                    }

                    if(config && config.store) {

                      $scope.paasbSearchBoxCacheFilter = true;

                    }

                    paasbUi.extend($scope, {

                      'searchInputId': this.searchInputId,

                      'showMagnifierAlways': config.showMagnifierAlways || true

                    });

                    return this;

                  },

                  addEvents: function () {

                    var self = this,

                      hasDelay = false;

                    if(config && typeof config.delay === 'number') {

                      hasDelay = true;

                    }

                    angular.extend($scope, this.events);

                    if(hasDelay) {

                      Filterer.watch(function (filters, operators, refresh) {

                        if($scope.paasbSearchBoxEnableFilteringOperators) {

                          paasbMemory.getAndSet('operators', operators);

                        }

                        if(timer) {

                          $timeout.cancel(timer);

                        }

                        if(config.delay && !refresh) {

                          params.filters = filters;

                          if($scope.paasbSearchBoxEnableFilteringOperators) {

                            params.operators = operators;

                          }

                          timer = $timeout(function () {

                            EventHandling
                              .onChange(params);

                          }, config.delay);

                        } else {

                          params.filters = filters;

                          if($scope.paasbSearchBoxEnableFilteringOperators) {

                            params.operators = operators;

                          }

                          EventHandling
                            .onChange(params);

                        }

                      });

                      $scope.$watch('query', function (__new, __old) {

                        if(!__new && !__old && typeof __new === 'string'

                          && typeof __old === 'string') {

                            return;

                        }

                        if(typeof __new !== 'undefined') {

                          if(paasbMemory.getAndSet('query') !== __new) {

                            paasbMemory.getAndSet('query', __new);

                            paasbUi.extend($scope, {

                              'hasQuery': (__new && __new.length) ? true : false

                            });

                            if(config.delay && !$scope.skipDelay) {

                              if(timer) {

                                $timeout.cancel(timer);

                              }

                              params.query = __new;

                              timer = $timeout(function () {

                                EventHandling
                                  .onChange(params)
                                  .onQueryAdded(__new, $scope.delayedQuery)
                                  .onQueryRemoved(__new, $scope.delayedQuery)
                                  .onQueryChanged(__new, $scope.delayedQuery);

                                $scope.delayedQuery = __new;

                              }, config.delay);

                            } else {

                              if(timer) {

                                $timeout.cancel(timer);

                              }

                              $scope.skipDelay = false;

                              params.query = __new;

                              EventHandling
                                .onChange(params)
                                .onQueryAdded(__new, $scope.delayedQuery)
                                .onQueryRemoved(__new, $scope.delayedQuery)
                                .onQueryChanged(__new, $scope.delayedQuery);

                              $scope.delayedQuery = __new;

                            }

                          }

                        }

                      });

                    }

                    $scope.$on('take.autoSuggestion', function (ev, data) {

                      $scope.skipDelay = true;

                      $scope.query = data;

                    });

                    $scope.input.on('focus', function () {

                      $scope.$broadcast('input.focused');

                    });

                    $scope.input.on('keypress', function (ev) {

                      if(ev && ev.keyCode === 13) {

                        EventHandling
                          .onChange(params);

                      }

                    });

                    return this;

                  },

                  register: function () {

                    Grouper = new paasbGrouping($scope, config);

                    Filterer = new paasbFiltering($scope, Grouper, config);

                    Placeholding = new paasbPlaceholders($scope, config);

                    API = new paasbApi($scope, Filterer, Placeholding);

                    EventHandling = new paasbEventHandling($scope, API);

                    angular.extend($scope, {

                      'Search': {

                        'Grouper': Grouper,

                        'Filtering': Filterer,

                        'Placeholding': Placeholding,

                        'API': API,

                        'EventHandling': EventHandling

                      }

                    });

                    Filterer
                      .addEventHandler(EventHandling)
                      .addMemoryOperators()
                      .addByMemory(params);

                    Placeholding.setup();

                    $scope.$emit('onRegisterApi', API);

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

                  EventHandling
                    .onChange(params);

                });

            }

        };

    }]);

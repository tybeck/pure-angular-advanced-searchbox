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
      'paasbMemory',
      'paasbUtils',
      'FILTERS',
      function ($timeout, $window, paasbApi, paasbUi, paasbFiltering, paasbGrouping, paasbPlaceholders, paasbMemory, paasbUtils, FILTERS) {

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

                    handleEraser: function () {

                      $scope.query = '';

                    },

                    handleGarbage: function () {

                      if((params.query && params.query.length) || $scope.hasFilters) {

                        Filterer.removeAll(true, true, {

                          'deleteOperators': true

                        });

                        $scope.query = '';

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
                      .make('searchParams', this.shouldStore() ? paasbMemory.getAll() :

                        defaultParams, 'isObject', 'query')

                      .make('paasbSearchBoxFiltering', [], 'isArray')
                      .make('paasbSearchBoxConfig', {}, 'isObject')
                      .make('paasbSearchBoxAutoComplete', {}, 'isObject');

                    if($scope.query) {

                      $scope.hasQuery = true;

                    }

                    if(!this.shouldStore()) {

                      paasbMemory.removeAll();

                    }

                    if($scope.paasbSearchBoxConfig

                      && $scope.paasbSearchBoxConfig.store) {

                        $scope.paasbSearchBoxCacheFilter = true;

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

                  send: function (params) {

                    angular.extend(params, {

                      '$$lastChange': new Date().getTime()

                    });

                    $scope.$emit('onChange', params);

                    return this;

                  },

                  addEvents: function () {

                    var self = this;

                    angular.extend($scope, this.events);

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

                          self.send(params);

                        }, config.delay);

                      } else {

                        params.filters = filters;

                        if($scope.paasbSearchBoxEnableFilteringOperators) {

                          params.operators = operators;

                        }

                        self.send(params);

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

                          paasbUi.extend($scope, {

                            'hasQuery': (__new && __new.length) ? true : false

                          });

                          if(config.delay && !$scope.skipDelay) {

                            if(timer) {

                              $timeout.cancel(timer);

                            }

                            timer = $timeout(function () {

                              params.query = __new;

                              self.send(params);

                            }, config.delay);

                          } else {

                            if(timer) {

                              $timeout.cancel(timer);

                            }

                            $scope.skipDelay = false;

                            params.query = __new;

                            self.send(params);

                          }

                        }

                      }

                    });

                    $scope.input.on('focus', function () {

                      $scope.$broadcast('input.focused');

                    });

                    return this;

                  },

                  register: function () {

                    Filterer = new paasbFiltering($scope, config);

                    Grouper = new paasbGrouping($scope, config);

                    Placeholding = new paasbPlaceholders($scope, config);

                    angular.extend($scope, {

                      'Search': {

                        'Grouper': Grouper,

                        'Filtering': Filterer,

                        'Placeholding': Placeholding

                      }

                    });

                    Filterer
                      .addMemoryOperators()
                      .addByMemory(params);

                    Placeholding.setup();

                    $scope.$emit('onRegisterApi', this.getAPI());

                    return this;

                  },

                  getAPI: function () {

                    return(new paasbApi($scope, Filterer, Placeholding));

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
                    .addEvents()
                    .send(params);

                });

            }

        };

    }]);

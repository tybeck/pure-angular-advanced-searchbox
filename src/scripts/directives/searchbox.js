'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBox
 * @description
 * # Implementation of paasbSearchBox
 */

angular.module('paasb')

    .directive('paasbSearchBox', [
      'paasbUi',
      'paasbFiltering',
      function (paasbUi, paasbFiltering) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox.html',

            'scope': {

              'searchParams': '=?',

              'paasbSearchBoxFiltering': '=?',

              'paasbSearchBoxConfig': '=?',

              'placeholder': '@'

            },

            controller: function ($scope, $element, $attrs) {

              var params = null,

                config = null,

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

                        angular.extend(params, {

                          'query': '',

                          'filters': []

                        });

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

                        'query': '',

                        'filters': []

                      }, 'isObject')
                      .make('paasbSearchBoxFiltering', [], 'isArray')
                      .make('paasbSearchBoxConfig', {}, 'isObject');

                    params = $scope.searchParams;

                    config = $scope.paasbSearchBoxConfig;

                    paasbUi.extend($scope, {

                      'searchInputId': this.searchInputId

                    });

                    return this;

                  },

                  addEvents: function () {

                    angular.extend($scope, this.events);

                    Filterer.watch(function (filterParams) {

                      params.filters = filterParams;

                    });

                    return this;

                  },

                  register: function () {

                    Filterer = new paasbFiltering($scope, config);

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

                    paasbUi.extend($scope, {

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
                    .configure()
                    .register()
                    .addEvents()
                    .dom();

                });

            }

        };

    }]);

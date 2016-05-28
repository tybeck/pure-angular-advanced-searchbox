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

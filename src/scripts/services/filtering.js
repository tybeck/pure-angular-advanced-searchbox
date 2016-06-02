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

				angular.extend(scope, {

					'addedFilters': [],

					'addedScopes': {}

				});

        angular.extend(this, {

					watch: function (fn) {

						this.callback = fn;

					},

					update: function () {

						this.callback(this.buildParameters());

					},

					buildParameters: function () {

						var params = {

						};

						angular.forEach(scope.paasbSearchBoxFiltering, function (type) {

							angular.forEach(scope.addedFilters, function (filter) {

								if(filter.name === type.name) {

									if(!params[filter.name]) {

										params[filter.name] = [];

									}

									params[filter.name].push({

										'condition': filter.selector.key,

										'value': filter.value

									});

								}

							});

						});

						return params;

					},

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

							'uuid': _.uuid()

						});

						scope.addedScopes[clonedFilter.uuid] = childScope;

						Ui.safeApply(scope, function () {

							scope.hasFilters = true;

							scope.addedFilters.push(clonedFilter);

						});

          },

          remove: function (filter) {

						scope.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter, addedIndex, addedObject) {

								if(addedFilter.uuid === filter.uuid) {

									addedFilter.element.remove();

									var addedScope = scope.addedScopes[filter.uuid];

									if(addedScope) {

										addedScope.$destroy();

										delete scope.addedScopes[filter.uuid];

									}

									filter.$filter.notFiltered = true;

									scope.addedFilters.splice(addedObject.length - 1 - addedIndex, 1);

								}

							});

							if(scope.addedFilters && !scope.addedFilters.length) {

								scope.hasFilters = false;

							}

          },

          removeAll: function () {

						var self = this;

						scope.addedFilters
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

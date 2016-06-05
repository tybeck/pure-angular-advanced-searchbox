'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbFiltering
 * @description
 * # paasbFiltering Services
 */

angular.module('paasb')

	.factory('paasbFiltering', [
		'$q',
    '$compile',
		'$http',
		'paasbUi',
    function ($q, $compile, $http, paasbUi) {

      var scope = null,

				config = null;

  		return function (_scope, _config) {

        scope = _scope;

				config = _config;

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

					getConfig: function () {

						return config;

					},

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

					getFilterContainer: function () {

						if(!this.filterContainerId) {

							this.filterContainerId = _.uuid();

							var div = document.createElement('div');

							div.id = this.filterContainerId;

							angular
								.element(div)
								.attr('ng-hide', '!addedFilters.length')
								.addClass('paasb-added-filters-wrapper paasb-clearfix');

							scope.wrapper
								.parent()
								.append(
									$compile(div)(scope)
								);

						}

						return angular.element(document.getElementById(this.filterContainerId));

					},

          add: function (filter) {

            var childScope = scope.$new(true),

							clonedFilter = _.clone(filter);

						angular.extend(childScope, {

              'filter': clonedFilter,

							'filtering': this

            });

						var compiledElement = $compile('<paasb-search-box-added-filter ' +

							'filter="filter" filtering="filtering" />')(childScope);

            this
							.getFilterContainer()
							.append(compiledElement);

						angular.extend(clonedFilter, {

							'element': compiledElement,

							'$filter': filter,

							'uuid': _.uuid()

						});

						scope.addedScopes[clonedFilter.uuid] = childScope;

						paasbUi.safeApply(scope, function () {

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

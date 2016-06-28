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
		'paasbMemory',
		'paasbValidation',
		'FILTERS',
    function ($q, $compile, $http, paasbUi, paasbMemory, paasbValidation, FILTERS) {

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

					'addedOperators': [],

					'registeredOperators': [],

					'addedScopes': {}

				});

        angular.extend(this, {

					getOperatorByFilterIndex: function (filter) {

						var index = null,

							oIndex = 0,

							op = null;

						angular.forEach(scope.addedFilters, function (addedFilter, addedIndex) {

							if(filter.uuid === addedFilter.uuid) {

								index = addedIndex;

							}

						});

						oIndex = (index - 1);

						if(Math.sign(oIndex) !== -1) {

							op = scope.addedOperators[oIndex];

						}

						return op;

					},

					addOperatorToFilter: function (operator, filter, dontUpdate) {

						if(filter) {

							var index = null;

							angular.forEach(scope.addedFilters, function (addedFilter, addedIndex) {

								if(filter.uuid === addedFilter.uuid) {

									index = addedIndex;

								}

							});

							if(index !== null) {

								var filterIndex = (index - 1);

								if(!scope.addedOperators[filterIndex]) {

									scope.addedOperators.push(operator.name);

								} else {

									scope.addedOperators[filterIndex] = operator.name;

								}

							}

						} else {

							scope.addedOperators.push(operator.name);

						}

						if(!dontUpdate) {

							this.update(true);

						}

						paasbMemory.getAndSet('operators', scope.addedOperators);

					},

					getOperatorsInMemory: function () {

						return paasbMemory.getAndSet('operators') || [];

					},

					getOperators: function () {

						return scope.addedOperators;

					},

					hasOperatorAlready: function (filter) {

						var ops = this.getOperators(),

							filters = this.getFilters(),

							hasOperator = false;

						angular.forEach(ops, function (op, opIndex) {

							angular.forEach(filters, function (_filter, _filterIndex) {

								if(_filter.uuid === filter.uuid) {

									if((_filterIndex - 1) === opIndex) {

										hasOperator = true;

									}

								}

							});

						});

						return hasOperator;

					},

					addMemoryOperators: function () {

						var ops = this.getOperatorsInMemory();

						if(ops && ops.length) {

							scope.addedOperators = ops;

						}

						return this;

					},

					getConfig: function () {

						return config;

					},

					getFilters: function () {

						return scope.addedFilters;

					},

					getFilterCount: function () {

						return scope.addedFilters.length;

					},

					watch: function (fn) {

						this.callback = fn;

					},

					update: function (forceRefresh) {

						if(this.callback) {

							return this.callback(this.buildParameters(), scope.addedOperators || [], forceRefresh);

						}

					},

					buildParameters: function () {

						var params = {

						};

						angular.forEach(scope.paasbSearchBoxFiltering, function (type) {

							angular.forEach(scope.addedFilters, function (filter) {

								if(filter.name === type.name) {

									var buildParam = function () {

										if(!params[filter.name]) {

											params[filter.name] = [];

										}

										var data = {

											'condition': filter.selector.key,

											'value': filter.value

										};

										angular.extend(data, filter.extend || {});

										params[filter.name].push(data);

									};

									if(paasbValidation.has(filter)) {

										if(paasbValidation.validate(filter)) {

											buildParam();

										}

									} else {

										buildParam();

									}

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

					addByMemory: function (options) {

						var opts = options.filters,

							self = this;

						angular.forEach(opts, function (option, name) {

							angular.forEach(option, function (opt) {

								angular.forEach(scope.paasbSearchBoxFiltering, function (filter) {

									if(name === filter.name) {

										self.add(filter, opt);

									}

								});

							});

						});

						return this;

					},

					registerOperator: function (op) {

						scope.registeredOperators.push(op);

					},

          add: function (filter, options) {

            var childScope = scope.$new(true),

							clonedFilter = _.clone(filter),

							operators = scope.paasbSearchBoxEnableFilteringOperators;

						angular.extend(childScope, {

              'filter': clonedFilter,

							'filtering': this,

							'operators': operators,

							'toValue': (options && options.value) ?

								options.value : null

            });

						var compiledElement = $compile('<paasb-search-box-added-filter ' +

							'filter="filter" filtering="filtering" ' +

							'operators="operators" to-value="toValue" />')(childScope);

            this
							.getFilterContainer()
							.append(compiledElement);

						angular.extend(clonedFilter, {

							'element': compiledElement,

							'$filter': filter,

							'uuid': _.uuid()

						});

						if(options && options.condition) {

							angular.forEach(FILTERS.SELECTORS, function (selector) {

								if(selector.key === options.condition) {

									clonedFilter.selector = selector;

								}

							});

						}

						scope.addedScopes[clonedFilter.uuid] = childScope;

						paasbUi.safeApply(scope, function () {

							scope.hasFilters = true;

							scope.addedFilters.push(clonedFilter);

						});

          },

          remove: function (filter) {

						var fIndex = null,

							self = this,

							operators = self.getOperators();

						scope.addedFilters
							.forEach(function (sAddedFilter, sAddedIndex) {

								if(sAddedFilter.uuid === filter.uuid) {

									fIndex = sAddedIndex;

								}

							});

						scope.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter, addedIndex, addedObject) {

								if(addedFilter.uuid === filter.uuid) {

									if(operators && operators.length) {

										var oIndex = (fIndex - 1);

										if(Math.sign(oIndex) === -1) {

											var ffIndex = (fIndex + 1),

												nextFilter = scope.addedFilters[ffIndex],

												nextScope = null;

											if(nextFilter) {

												nextScope = scope.addedScopes[nextFilter.uuid];

												paasbUi.extend(nextScope, {

													'operators': false

												});

											}

										} else {

											oIndex = 0;

										}

										scope.registeredOperators.splice(oIndex, 1);

										scope.addedOperators.splice(oIndex, 1);

									}

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

							this.update(true);

          },

          removeAll: function () {

						var self = this;

						scope.addedFilters
							.slice()
							.reverse()
							.forEach(function (addedFilter) {

								return self.remove(addedFilter);

							});

						paasbMemory.removeAll();

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

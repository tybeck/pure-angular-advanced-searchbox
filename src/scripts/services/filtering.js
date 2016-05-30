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

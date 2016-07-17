'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbGrouping
 * @description
 * # paasbGrouping Services
 */

angular.module('paasb')

	.factory('paasbGrouping', [
		'paasbUi',
    function (paasbUi) {

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

					'isGroupingEnabled': false

				});

        angular.extend(this, {

					'addedParanthesis': [],

					addFake: function (elem) {

						if(this.addedParanthesis && this.addedParanthesis.length % 2 !== 1) {

							var element = angular.element(document.createElement('div'));

							element.text('(');

							elem.prepend(element);

							this.addedParanthesis.push({

								'groupingElement': element,

								'element': elem

							});

						}

					},

					removeLastFake: function () {

						if(this.addedParanthesis && this.addedParanthesis.length) {

							var lastGrouping = this.addedParanthesis[this.addedParanthesis.length - 1];

							lastGrouping.groupingElement.remove();

							this.addedParanthesis.splice(this.addedParanthesis.length - 1, 1);

						}

					},

					hasOpeningParanthesis: function () {

						if(this.addedParanthesis && this.addedParanthesis.length === 1) {

							return true;

						}

					},

					hasGrouping: function () {

						if(this.addedParanthesis && this.addedParanthesis.length === 2) {

							return true;

						}

					},

					toggle: function () {

						var Filtering = null,

							filters = [];

						this.addedParanthesis = [];

						if(Search && Search.Filtering) {

							Filtering = Search.Filtering;

							paasbUi.extend(scope, {

								'isGroupingEnabled': !scope.isGroupingEnabled

							});

							filters = Filtering.getFilterScopes();

							angular.forEach(filters, function (filter) {

								var method = (scope.isGroupingEnabled ? 'enable' : 'disable') + 'Grouping';

								if(filter && filter[method]) {

									filter[method].call();

								}

							});

						}

					}

        });

      };

	}]);

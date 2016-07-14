'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbEventHandling
 * @description
 * # paasbEventHandling Services
 */

angular.module('paasb')

	.factory('paasbEventHandling', [
    function () {

      var scope = null,

        api = null;

  		return (function (_scope, _api) {

        scope = _scope;

        api = _api;

        return ({

          fire: function (type, data) {

						var ev = {

							'$$lastChange': new Date().getTime()

						};

            angular.forEach(api.$$registeredEvents, function (event) {

              type = type.toLowerCase();

              if(event && event.type

                && event.type.toLowerCase() === type

                && typeof event.fn === 'function') {

                  event.fn(ev, data);

              }

            });

            return this;

          },

          onQueryAdded: function (n, o) {

            if(typeof o === 'undefined' || typeof o !== 'undefined' && !o.length) {

              if(n && n.length) {

                this.fire('onQueryAdded', n);

              }

            }

						return this;

          },

          onQueryRemoved: function (n, o) {

            if(typeof o !== 'undefined' && o.length) {

              if(!n || typeof n === 'string' && !n.length) {

								this.fire('onQueryRemoved', n);

							}

            }

						return this;

          },

					onQueryChanged: function (n, o) {

						if(n !== o) {

							this.fire('onQueryChanged', n);

						}

					},

					onEraser: function () {

						this.fire('onEraser');

						return this;

					},

					onGarbage: function () {

						this.fire('onGarbage');

						return this;

					},

          onChange: function (parameters) {

            this.fire('onChange', parameters);

            return this;

          },

					onFilterAdded: function (filter) {

						this.fire('onFilterAdded', filter);

						return this;

					},

					onFilterRemoved: function (filter) {

						this.fire('onFilterRemoved', filter);

						return this;

					},

					onFilterChanged: function (filter) {

						this.fire('onFilterChanged', filter);

						return this;

					},

					onOperatorChanged: function (operator, filter) {

						var opts = {

							'name': operator ? operator.name : '',

							'filter': filter

						}

						this.fire('onOperatorChanged', opts);

						return this;

					},

					onFilterSelectorChanged: function (selector, filter) {

						var opts = {

							'selector': selector,

							'filter': filter

						}

						this.fire('onFilterSelectorChanged', opts);

						return this;

					},

					onEnteredEditMode: function (filter) {

						this.fire('onEnteredEditMode', filter);

						return this;

					},

					onLeavedEditMode: function (filter) {

						this.fire('onLeavedEditMode', filter);

						return this;

					}

        });

      });

	}]);

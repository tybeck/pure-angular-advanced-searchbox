'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbApi
 * @description
 * # paasbApi Services
 */

angular.module('paasb')

	.factory('paasbApi', [
    '$q',
		'$http',
    'paasbUi',
    function ($q, $http, paasbUi) {

  		return (function (scope, filtering, placeholding) {

				var helpers = {

					hasEventErrors: function (evt, fn, emptyFnAllowed) {

						if(typeof evt !== 'string') {

							throw new TypeError('Paasb API - Event Name parameter must be type String!');

						}

						if(typeof fn !== 'function' && !emptyFnAllowed) {

							throw new TypeError('Paasb API - Event Function parameter must be type Function!');

						}

						return this;

					},

					hasInvalidEventType: function (evt, types) {

						var validType = false;

						angular.forEach(types, function (type) {

							type = type.toLowerCase();

							evt = evt.toLowerCase();

							if(type === evt) {

								validType = true;

							}

						});

						if(!validType) {

							throw new ReferenceError('Paasb API - Invalid Event Type Provided!');

						}

						return this;

					}

				};

        return({

					'$$registeredEvents': [],

					'$$allowedEvents': [
						'onChange',
						'onQueryAdded',
						'onQueryRemoved',
						'onQueryChanged',
						'onFilterAdded',
						'onFilterRemoved',
						'onFilterChanged',
						'onOperatorChanged',
						'onFilterSelectorChanged',
						'onEraser',
						'onGarbage',
						'onEnteredEditMode',
						'onLeavedEditMode'
					],

          'Filtering': filtering,

          'Placeholding': placeholding,

          'Loading': {

            set: function (val) {

              if(typeof val === 'boolean') {

                paasbUi.extend(scope, {

                  'isLoading': val

                });

              }

            }

          },

					on: function (evt, fn) {

						var self = this,

							isRegisteredAlready = false;

						helpers
							.hasEventErrors(evt, fn)
							.hasInvalidEventType(evt, self.$$allowedEvents);

						angular.forEach(self.$$registeredEvents, function (event) {

							if(event && event.fn === fn && event.type === evt) {

								isRegisteredAlready = true;

							}

						});

						if(!isRegisteredAlready) {

							self.$$registeredEvents.push({

								'type': evt,

								'fn': fn

							});

						}

						return this;

					},

					off: function (evt, fn) {

						var self = this,

							isFnEmpty = false;

						helpers
							.hasEventErrors(evt, fn, true)
							.hasInvalidEventType(evt, self.$$allowedEvents);

						if(typeof fn !== 'function') {

							isFnEmpty = true;

						}

						self.$$registeredEvents
							.slice()
							.reverse()
							.forEach(function (addedEvent, addedIndex, addedObject) {

								if((addedEvent && addedEvent.fn === fn && addedEvent.type === evt) ||

									(isFnEmpty && addedEvent && addedEvent.type === evt)) {

									self.$$registeredEvents.splice(addedObject.length - 1 - addedIndex, 1);

								}

							});

							return this;

					},

					offAll: function () {

						self.$$registeredEvents
							.slice()
							.reverse()
							.forEach(function (addedEvent, addedIndex, addedObject) {

								self.$$registeredEvents.splice(addedObject.length - 1 - addedIndex, 1);

							});

						return this;

					},

          destroy: function () {

            if(placeholding) {

              placeholding.stopAll();

            }

            scope.$destroy();

          }

        });

      });

	}]);

'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbMemory
 * @description
 * # paasbMemory Services
 */

angular.module('paasb')

	.factory('paasbMemory', [
		'$window',
    function ($window) {

      var storage = $window.localStorage,

        paasbMemory = {

          'hash': 'paasb',

          getAndSet: function (key, value) {

            if(!storage.getItem(this.hash)) {

              storage.setItem(this.hash, '{}');

            }

            var store = storage.getItem(this.hash);

            if(store) {

              store = JSON.parse(store);

              if(typeof value === 'undefined') {

                return store[key];

              } else {

                store[key] = value;

                storage.setItem(this.hash, JSON.stringify(store));

              }

            }

          },

          getAll: function () {

            var data = JSON.parse(storage.getItem(this.hash));

            if(data) {

              delete data.cache;

              return data;

            }

            return {};

          },

          removeAll: function () {

            var cache = this.getAndSet('cache'),

              obj = {};

            if(cache !== null) {

              obj.cache = cache;

            }

            storage.setItem(this.hash, JSON.stringify(obj));

          }

    		};

  		return paasbMemory;

	}]);

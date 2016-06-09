'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbValidation
 * @description
 * # paasbValidation Services
 */

angular.module('paasb')

	.factory('paasbValidation', [
		'$window',
    function ($window) {

      var paasbValidation = {

        length: function (value, len) {

          return (value.length === parseInt(len));

        },

        has: function (filter) {

          return filter.validation ? true : false;

        },

        validate: function (filter) {

          var self = this,

            validation = [],

            passed = [];

          if(filter && filter.validation) {

            validation = filter.validation.split(' ');

            angular.forEach(validation, function (_validation) {

              var validator = _validation.split('='),

                name = validator[0],

                value = validator[1];

              if(self[name](filter.value, value)) {

                passed.push({

                  'name': name,

                  'value': value

                });

              }

            });

            return (validation.length === passed.length);

          }

          return true;

        }

    	};

  		return paasbValidation;

	}]);

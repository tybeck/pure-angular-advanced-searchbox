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

				min: function (value, len) {

					return(value.length >= parseInt(len));

				},

				max: function (value, len) {

					return(value.length <= parseInt(len));

				},

				between: function (value, param) {

					var params = param.split(',');

					if(params && params.length === 2) {

						var min = this.min(value, params[0]),

							max = this.max(value, params[1]);

						return min && max;

					}

					return false;

				},

				numeric: function (value) {

					return !isNaN(value);

				},

				email: function (value) {

					var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					return regex.test(value);

				},

				phone: function (value) {

					var regex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

					return regex.test(value);

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

                value = validator[1] || null;

							if(!self[name]) {

								passed.push({

									'name': name

								});

							} else {

								if(self[name](filter.value, value)) {

	                passed.push({

	                  'name': name,

	                  'value': value

	                });

	              }

							}

            });

            return (validation.length === passed.length);

          }

          return true;

        }

    	};

  		return paasbValidation;

	}]);

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

        return({

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

          destroy: function () {

            if(placeholding) {

              placeholding.stopAll();

            }

            scope.$destroy();

          }

        });

      });

	}]);

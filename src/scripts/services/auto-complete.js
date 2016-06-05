'use strict';

/**
 * @ngdoc service
 * @name paasb.service:paasbAutoComplete
 * @description
 * # paasbAutoComplete Services
 */

angular.module('paasb')

	.factory('paasbAutoComplete', [
		'$q',
    '$http',
    function ($q, $http) {

			var paasbAutoComplete = {

        load: function (url) {

          var deferred = $q.defer();

          $http({
            'method': 'GET',
            'url': url
          })
            .then(function (response) {

              if(response && response.data) {

                deferred.resolve(response.data);

              }

            }, function () {

              deferred.resolve([]);

            });

          return deferred.promise;

        }

  		};

  		return paasbAutoComplete;

	}]);

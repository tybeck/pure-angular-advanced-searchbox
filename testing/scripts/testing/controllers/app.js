'use strict';

/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # AppCtrl
 * Main controller for our application
 */

angular.module('app')

  .controller('AppCtrl', [
    '$scope',
    '$timeout',
    function ($scope, $timeout) {

      $scope.sOptions = {

      };

      $scope.sFilterOperators = [
        {
          "name": "NOT"
        },
        {
          "name": "AND",
          "selected": true
        }, {
          "name": "OR"
        }
      ];

      $scope.sFilterSelectors = [
        {
          "name": "Test",
          "key": "test"
        },
        {
          "name": "Contains",
          "key": "contains",
          "selected": true,
          "notAllowed": [
            "restrictedSuggestedValues"
          ]
        },
        {
          "name": "Does not contain",
          "key": "doesNotContain",
          "notAllowed": [
            "restrictedSuggestedValues"
          ]
        },
        {
          "name": "Is Equal To",
          "key": "isEqualTo"
        },
        {
          "name": "Is Not Equal To",
          "key": "isNotEqualTo"
        },
        {
          "name": "Starts with",
          "key": "startsWith"
        },
        {
          "name": "Ends with",
          "key": "endsWith"
        },
        {
          "name": "Similiarity",
          "key": "similiarity"
        }
      ];

      $scope.sFilters = [
        {
          'name': 'example',
          'displayName': 'Example',
          'dontFilter': true
        },
        {
          'name': 'cpi',
          'displayName': 'CPI',
          'root': 'Product',
          'validation': 'length=3'
        }, {
          'name': 'vendor_desc',
          'displayName': 'Vendor Description',
          'root': 'Product',
          'validation': 'between=3,6 numeric'
        }, {
          'name': 'vendor_abbr',
          'displayName': 'Vendor Abbreviation',
          'root': 'Product',
          'multi': true
        }, {
          'name': 'vendor_sku',
          'displayName': 'Vendor SKU',
          'multi': true,
          'root': 'Product',
          'middleware': [function (val) {

            return val + ' test';

          }, function (val) {

            return val + ' test 2';

          }]
        }, {
          'name': 'color',
          'displayName': 'Vendor Color',
          'root': 'Product'
        }, {
          'name': 'gender',
          'displayName': 'Vendor Gender',
          'suggestedValues': 'GENDER',
          'suggestedDataPoint': 'data',
          'reloadOnCreate': true,
          'restrictedSuggestedValues': true,
          'multi': true,
          'root': 'Product'
        }, {
          'name': 'product_type',
          'displayName': 'Product Type',
          'root': 'Product'
        }, {
          'name': 'upc',
          'displayName': 'UPC',
          'child': 'Size',
          'extend': {
            'match': 'id',
            'to': 'product_id',
            'core': 'product',
            'columns': ['cpi']
          }
        }

      ];

      $timeout(function () {

        console.log($scope);

      }, 2500);

      $scope.$on('onRegisterApi', function (ev, api) {

        console.log('api', api);

        $scope.$watch('sOptions', function (__new) {

          console.log(__new);

        }, true);

      });

      $scope.sConfig = {

        'delay': 1000,

        // 'store': true,

        'placeholders': [
          'Enter your query here...',
          'Products will be searched via this query',
          'You can enter any search term you\'d like'
        ],

        'updateOnlyByEnterKey': true,

        'placeholderInterval': 3000,

        'placeholderSpeedOutInterval': 15,

        'placeholderSpeedInInterval': 100,

        'autoCompleteUrl': 'http://localhost:7010/search/suggestions?q={"query":"{{query}}"}&use=autocomplete&save=true',

        'GENDER': 'http://localhost:7010/gender'

      };

  }]);

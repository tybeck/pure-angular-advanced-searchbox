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
    function ($scope) {

      $scope.sOptions = {

      };

      $scope.sFilters = [

        {
          'name': 'cpi',
          'displayName': 'CPI'
        }, {
          'name': 'vendor_desc',
          'displayName': 'Vendor Description'
        }, {
          'name': 'vendor_abbr',
          'displayName': 'Vendor Abbreviation'
        }, {
          'name': 'vendor_sku',
          'displayName': 'Vendor SKU'
        }, {
          'name': 'color',
          'displayName': 'Vendor Color'
        }, {
          'name': 'Gender',
          'displayName': 'Vendor Gender',
          'suggestedValues': 'http://demo0993385.mockable.io/gender',
          'reloadOnCreate': true,
          'restrictedSuggestedValues': true
        }

      ];

  }]);

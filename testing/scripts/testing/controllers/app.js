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

      $scope.sFilters = [
        {
          'name': 'example',
          'displayName': 'Example',
          'dontFilter': true
        },
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
          'name': 'gender',
          'displayName': 'Vendor Gender',
          'suggestedValues': 'GENDER',
          'suggestedDataPoint': 'data',
          'reloadOnCreate': true,
          'restrictedSuggestedValues': true,
          'multi': true
        }

      ];

      $timeout(function () {

        console.log($scope.sFilters);

      }, 2500);

      $scope.sConfig = {

        'GENDER': 'http://10.219.26.22:7010/gender'

      };

  }]);

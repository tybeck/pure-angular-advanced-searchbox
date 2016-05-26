'use strict';

/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # AppCtrl
 * Main controller for our application
 */

angular.module('app')

  .controller('AppCtrl', ['$scope', 'App', function ($scope, App) {

    angular.extend(this, App.init($scope, this));

  }]);

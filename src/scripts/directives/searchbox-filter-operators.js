'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterOperators
 * @description
 * # Implementation of paasbSearchBoxFilterOperators
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterOperators', [
      '$document',
      'paasbUi',
      'FILTERS',
      function ($document, paasbUi, FILTERS) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filter-operators.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filtering': '=',

              'filter': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                EventHandling = Filtering.getEventHandler(),

                operators = angular.copy(FILTERS.OPERATORS),

                filter = $scope.filter;

              if(Filtering.getFilterCount() > 1) {

                $scope.hasOperator = true;

                $scope.autoSizeElement = $element;

                angular.extend($scope, {

                  'availableOperators': operators,

                  'showOperators': false,

                  'events': {

                    docClick: function (ev) {

                      var isChild = $element[0].contains(ev.target);

                      var isSelf = $element[0] == ev.target;

                      var isInside = isChild || isSelf;

                      if(!isInside) {

                        $document.unbind('click', $scope.events.docClick);

                        paasbUi.extend($scope, {

                          'showOperators': false

                        });

                      }

                    }

                  },

                  openOperators: function () {

                    $scope.showOperators = !$scope.showOperators;

                    $document[$scope.showOperators ? 'bind': 'unbind']('click', $scope.events.docClick);

                    Filtering.autoSizeByFilter(filter);

                  },

                  takeOperator: function (operator) {

                    angular.forEach(operators, function (availableOperator) {

                      availableOperator.selected = false;

                    });

                    $scope.operator = operator;

                    Filtering.addOperatorToFilter(operator, filter);

                    EventHandling
                      .onOperatorChanged(operator, filter);

                    operator.selected = true;

                  },

                  takeOperatorByName: function (operatorName) {

                    angular.forEach(operators, function (availableOperator) {

                      if(availableOperator.name !== operatorName) {

                        availableOperator.selected = false;

                      } else {

                        availableOperator.selected = true;

                        $scope.operator = availableOperator;

                      }

                    });

                  },

                  setDefaultOperator: function () {

                    var operatorByFilter = Filtering.getOperatorByFilterIndex(filter);

                    if(operatorByFilter === null) {

                      if(!filter.operator) {

                        angular.forEach(operators, function (availableOperator) {

                          if(availableOperator.selected) {

                            $scope.operator = availableOperator;

                          }

                        });

                        if(!filter.selector && operators &&

                          operators.length) {

                            var operator = operators[0];

                            operator.selected = true;

                            $scope.operator = operator;

                        }

                      } else {

                        angular.forEach(operators, function (availableOperator) {

                          availableOperator.selected = (availableOperator.key === filter.selector.key);

                        });

                      }

                    } else {

                      this.takeOperatorByName(operatorByFilter);

                    }

                    return $scope;

                  },

                  registerOperator: function () {

                    Filtering.registerOperator($scope);

                    return $scope;

                  },

                  addOperatorToFilter: function () {

                    if(!Filtering.hasOperatorAlready(filter)) {

                      Filtering.addOperatorToFilter($scope.operator, filter, true);

                    }

                    return $scope;

                  }

                });

                $scope
                  .setDefaultOperator()
                  .registerOperator()
                  .addOperatorToFilter();

              }

            }

        };

    }]);

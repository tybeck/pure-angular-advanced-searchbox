'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAddedFilter
 * @description
 * # Implementation of paasbSearchBoxAddedFilter
 */

angular.module('paasb')

    .directive('paasbSearchBoxAddedFilter', [
      '$timeout',
      '$document',
      'paasbUi',
      'paasbUtils',
      function ($timeout, $document, paasbUi, paasbUtils) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-added-filter.html',

            'require': '^paasbSearchBoxFiltering',

            'scope': {

              'filter': '=',

              'filtering': '=',

              'toValue': '=',

              'operators': '='

            },

            controller: function ($scope, $element, $attrs) {

              var Filtering = $scope.filtering,

                filter = $scope.filter,

                operators = $scope.operators,

                config = null,

                input,

                dragSourceElem = null,

                dragSourceCount = 0;

              filter.loading = false;

              $element.attr('id', _.uuid());

              if(typeof filter.suggestedValues === 'string') {

                config = Filtering.getConfig();

                var deepValue = paasbUtils.getDeepValue(config, filter.suggestedValues);

                if(deepValue) {

                  filter.suggestedValues = deepValue;

                }

              }

              if($scope.toValue) {

                $scope.value = $scope.toValue;

                $scope.dontOpen = true;

              }

              if(paasbUtils.isURL(filter.suggestedValues) ||

                (paasbUtils.isURL(filter.source) && filter.reloadOnCreate)) {

                  paasbUi.safeApply($scope, function () {

                    var url = filter.source || filter.suggestedValues;

                    angular.extend(filter, {

                      'loading': true,

                      'suggestedValues': [],

                      'source': url

                    });

                  });

                  Filtering
                    .loadSource(filter)
                      .then(function (data) {

                        paasbUi.safeApply($scope, function () {

                          angular.extend(filter, {

                            'suggestedValues': data,

                            'loading': false,

                            'value': ''

                          });

                        });

                      });

              } else {

                filter.value = '';

              }

              paasbUi.extend($scope, {

                'Utils': paasbUtils,

                'events': {

                  searchboxClick: function (ev) {

                    var isChild = $element[0].contains(ev.target);

                    var isSelf = $element[0] == ev.target;

                    var isInside = isChild || isSelf;

                    if(!isInside) {

                      $scope.closeFilter();

                    }

                  },

                  inputKeyEvents: function (ev) {

                    if(ev.keyCode === 13) {

                      $scope.closeFilter();

                    }

                  },

                  dragEvents: function (ev) {

                    switch(ev.type) {

                      case 'dragstart':

                        dragSourceElem = angular.element(this);

                        ev.dataTransfer.effectAllowed = 'move';

                        ev.dataTransfer.setData('text', dragSourceElem.attr('id'));

                        dragSourceElem.addClass('dragged-item');

                      break;

                      case 'dragenter':

                        ev.preventDefault();

                        Filtering
                          .removeClassAllFilters('over');

                        angular.element(this).addClass('over');

                        dragSourceCount ++;

                      break;

                      case 'dragleave':

                        dragSourceCount --;

                        if(dragSourceCount === 0) {

                          angular.element(this).removeClass('over');

                        }

                      break;

                      case 'dragover':

                        if(ev.preventDefault) {

                          ev.preventDefault();

                        }

                        ev.dataTransfer.dropEffect = 'move';

                        return false;

                      break;

                      case 'drop':

                        if(ev.stopPropagation) {

                          ev.stopPropagation();

                        }

                        var id = ev.dataTransfer.getData('text');

                        if(id) {

                          var elem = document.getElementById(id);

                          if(elem !== this) {

                            Filtering.moveFilter(elem, this);

                          }

                        }

                        return false;

                      break;

                      case 'dragend':

                        Filtering
                          .removeClassAllFilters('over')
                          .removeClassAllFilters('dragged-item');

                      break;

                    }

                  }

                },

                takeSuggestion: function (val) {

                  $scope.value = val;

                },

                closeFilter: function () {

                  var self = this;

                  paasbUi.safeApply($scope, function () {

                    filter.editing = false;

                    $scope.$broadcast('filter.isEditing', filter.editing);

                    $document.unbind('click', self.events.searchboxClick);

                    if(!filter.value) {

                      Filtering.remove(filter);

                    } else {

                      if(filter.suggestedValue) {

                        filter.value = filter.suggestedValue.value;

                      } else {

                        if(filter.restrictedSuggestedValues) {

                          Filtering.remove(filter);

                        }

                      }

                    }

                  });

                },

                openFilter: function () {

                  if(!$scope.dontOpen) {

                    var self = this;

                    if(!filter.editing) {

                      filter.editing = true;

                      $scope.$broadcast('filter.isEditing', filter.editing);

                      $timeout(function () {

                        $document.bind('click', self.events.searchboxClick);

                      }, 25);

                      $scope.setFocus();

                    }

                  }

                  $scope.dontOpen = false;

                },

                destroy: function () {

                  return Filtering.remove($scope.filter);

                },

                getElements: function () {

                  input = $element.find('input');

                  return $scope;

                },

                registerEvents: function (events) {

                  input.on('keyup', events.inputKeyEvents);

                  $element.on('dragstart dragenter dragover dragleave drop dragend', events.dragEvents);

                  return $scope;

                },

                setFocus: function () {

                  $timeout(function () {

                    if(input) {

                      input[0].focus();

                    }

                  }, 50);

                  return $scope;

                },

                addWatch: function () {

                  $scope.$watch('value', function (__new) {

                    filter.value = __new || '';

                    if(filter.value) {

                      Filtering.update();

                    }

                  });

                  return $scope;

                }

              });

              $scope
                .getElements()
                .registerEvents($scope.events)
                .addWatch()
                .openFilter();

            }

        };

    }]);

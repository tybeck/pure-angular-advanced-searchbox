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

                Grouping = Filtering.getGrouping(),

                EventHandling = Filtering.getEventHandler(),

                filter = $scope.filter,

                operators = $scope.operators,

                config = null,

                input,

                dragSourceElem = null,

                dragSourceCount = 0;

              angular.extend(filter, {

                'loading': false,

                '$$filtering': Filtering

              });

              $element.attr('id', paasbUtils.uuid());

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

              var scope = Filtering.getFilterScope(filter);

              angular.extend(scope, {

                enableGrouping: function () {

                  $document.on('mouseover mouseout', $scope.events.groupingEvents);

                },

                disableGrouping: function () {

                  $document.off('mouseover mouseout', $scope.events.groupingEvents);

                }

              });

              paasbUi.extend($scope, {

                'inputId': paasbUtils.uuid(),

                'Utils': paasbUtils,

                getDirection: function (placement) {

                  var dir = null;

                  if(typeof placement === 'undefined' || placement === null) {

                    return dir;

                  }

                  if(typeof placement === 'string') {

                    placement = parseInt(placement);

                  }

                  switch(placement) {

                    case 1:

                      dir = 'before';

                    break;

                    case 3:

                      dir = 'after';

                    break;

                  }

                  return dir;

                },

                'events': {

                  groupingEvents: function (ev) {

                    var isChild = $element[0].contains(ev.target),

                      isSelf = $element[0] == ev.target,

                      isInside = isChild || isSelf;

                    switch(ev.type) {

                      case 'mouseover':

                        if(isInside) {

                          Grouping.addFake($element);

                        }

                      break;

                      case 'mouseout':

                        if(!isInside) {

                          Grouping.removeLastFake();

                        }

                      break;

                    }

                  },

                  searchboxClick: function (ev) {

                    var isChild = $element[0].contains(ev.target),

                      isSelf = $element[0] == ev.target,

                      isInside = isChild || isSelf;

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

                        ev.dataTransfer.effectAllowed = 'copyMove';

                        if(!dragSourceElem.attr('id')) {

                          dragSourceElem.attr('id', paasbUtils.uuid());

                        }

                        ev.dataTransfer.setData('text', dragSourceElem.attr('id'));

                        dragSourceElem.addClass('dragged-item');

                      break;

                      case 'dragenter':

                        ev.preventDefault();

                        dragSourceCount ++;

                      break;

                      case 'dragleave':

                        dragSourceCount --;

                        if(dragSourceCount === 0) {

                          angular.element(this).removeClass('over');

                        }

                      break;

                      case 'dragover':

                        var bounding = this.getBoundingClientRect(),

                          w = (bounding.width / 3);

                        var placement = Math.abs(Math.ceil((ev.pageX - bounding.left) / w)) || 1;

                        Filtering
                          .removeClassAllFilters('over-placement-1')
                          .removeClassAllFilters('over-placement-2')
                          .removeClassAllFilters('over-placement-3');

                        angular
                          .element(this)
                          .addClass('over-placement-' + placement)
                          .attr('data-placement', placement);

                        if(ev.preventDefault) {

                          ev.preventDefault();

                        }

                        ev.dataTransfer.dropEffect = 'copyMove';

                        return false;

                      break;

                      case 'drop':

                        if(ev.stopPropagation) {

                          ev.stopPropagation();

                        }

                        var data = ev.dataTransfer.getData('text'),

                          isJSON = false;

                        if(paasbUtils.isJson(data)) {

                          data = JSON.parse(data);

                          isJSON = true;

                        }

                        if(data) {

                          var id = data;

                          if(isJSON) {

                            id = data.id;

                          }

                          var elem = document.getElementById(id);

                          if(isJSON && data.draggable) {

                            if(data.trash) {

                                Filtering.removeByElement(this);

                            }

                          } else {

                            if(elem !== this) {

                              var placement = parseInt(angular
                                .element(this)
                                .attr('data-placement') || null),

                                direction = $scope.getDirection(placement);

                              Filtering[placement === 2 ? 'swapFilter' : 'moveFilter'](elem, this, direction);

                            }

                          }

                        }

                        return false;

                      break;

                      case 'dragend':

                        Filtering
                          .removeClassAllFilters('over-placement-1')
                          .removeClassAllFilters('over-placement-2')
                          .removeClassAllFilters('over-placement-3')
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

                      Filtering.remove(filter, true);

                    } else {

                      if(filter.suggestedValue) {

                        console.log(filter.suggestedValue, $scope.value, filter.$$lastValue);

                        $scope.value = filter.suggestedValue.value;

                      } else {

                        if(filter.restrictedSuggestedValues) {

                          Filtering.remove(filter, true);

                        }

                      }

                    }

                    EventHandling
                      .onLeavedEditMode(filter);

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

                      EventHandling
                        .onEnteredEditMode(filter);

                    }

                  }

                  $scope.dontOpen = false;

                },

                destroy: function () {

                  return Filtering.remove($scope.filter, null, false);

                },

                getElements: function () {

                  input = $element.find('input');

                  filter.$$input = input;

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

                  $scope.$watch('value', function (__new, __old) {

                    Filtering.autoSizeByFilter(filter);

                    filter.value = __new || '';

                    if(filter.value) {

                      if(__new !== __old) {

                        if(filter && filter.suggestedValues) {

                          if(filter.suggestedValue && filter.suggestedValue.value === filter.$$lastValue) {

                            return;

                          }

                          var matchesSuggestedValue = false;

                          angular.forEach(filter.suggestedValues, function (suggestedValue) {

                            if(suggestedValue === __new) {

                              matchesSuggestedValue = true;

                            }

                          });

                          if(matchesSuggestedValue) {

                            filter.$$lastValue = filter.value;

                            Filtering.update();

                            EventHandling
                              .onFilterChanged(filter);

                          }

                        } else {

                          Filtering.update();

                          EventHandling
                            .onFilterChanged(filter);

                        }

                      }

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

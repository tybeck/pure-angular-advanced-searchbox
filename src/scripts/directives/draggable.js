'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbDraggable
 * @description
 * # Implementation of paasbDraggable
 */

angular.module('paasb')

    .directive('paasbDraggable', [
      'paasbUtils',
      function (paasbUtils) {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              $element.on('dragstart dragend', function (ev) {

                switch(ev.type) {

                  case 'dragstart':

                    var elem = angular.element(this),

                      id = paasbUtils.uuid(),

                      data = {

                        'id': id,

                        'draggable': true,

                        'trash': true

                      };

                    if(!elem.attr('id')) {

                      elem.attr('id', id);

                    }

                    ev.dataTransfer.setData('text', JSON.stringify(data));

                  break;

                  case 'dragend':

                  if($scope.Search && $scope.Search.Filtering) {

                    var Filtering = $scope.Search.Filtering;

                    Filtering
                      .removeClassAllFilters('over-placement-1')
                      .removeClassAllFilters('over-placement-2')
                      .removeClassAllFilters('over-placement-3')
                      .removeClassAllFilters('dragged-item');

                  }

                  break;

                }

              });

            }

        };

    }]);

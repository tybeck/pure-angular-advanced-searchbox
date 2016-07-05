'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbDraggable
 * @description
 * # Implementation of paasbDraggable
 */

angular.module('paasb')

    .directive('paasbDraggable', [
      function () {

        return {

            'restrict': 'A',

            controller: function ($scope, $element, $attrs) {

              $element.on('dragstart', function (ev) {

                switch(ev.type) {

                  case 'dragstart':

                    var elem = angular.element(this),

                      id = _.uuid(),

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

                }

              });

            }

        };

    }]);

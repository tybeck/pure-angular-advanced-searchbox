'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFilterMovedAnimation
 * @description
 * # Implementation of paasbSearchBoxFilterMovedAnimation
 */

angular.module('paasb')

    .directive('paasbSearchBoxFilterMovedAnimation', [
      'paasbUtils',
      'paasbUi',
      function (paasbUtils, paasbUi) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-filter-moved-animation.html',

            'require': '^paasbSearchBoxAddedFilter',

            'scope': {

              'filter': '='

            },

            controller: function ($scope, $element) {

              var filter = $scope.filter,

                contents = $element.parent(),

                elem = null,

                boundingBox = null,

                height = 0,

                width = 0,

                radius = 0;

              if(filter) {

                elem = filter.element;

                boundingBox = contents[0].getBoundingClientRect();

                radius = paasbUtils.getStyle(contents[0], 'border-radius') || 0;

                height = (boundingBox.bottom - boundingBox.top);

                width = (boundingBox.width);

                var hWidth = (width / 2) + 6;

                var hHeight = (height / 2) + 6;

                $element
                  .css('border-left-width', hWidth + 'px')
                  .css('border-right-width', hWidth + 'px')
                  .css('border-top-width', hHeight + 'px')
                  .css('border-bottom-width', hHeight + 'px')
                  .css('border-radius', radius + 'px');

                paasbUi.apply(function () {

                  $element
                    .addClass('transition')
                    .css('border-left-width', '0px')
                    .css('border-right-width', '0px')
                    .css('border-top-width', '0px')
                    .css('border-bottom-width', '0px')
                    .css('border-radius', radius + 'px')
                    .css('width', width + 'px')
                    .css('height', height + 'px');

                }, 50);

              }

            }

        };

    }]);

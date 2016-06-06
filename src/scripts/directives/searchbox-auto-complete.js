'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxAutoComplete
 * @description
 * # Implementation of paasbSearchBoxAutoComplete
 */

angular.module('paasb')

    .directive('paasbSearchBoxAutoComplete', [
      '$window',
      '$document',
      '$timeout',
      'paasbUi',
      'paasbUtils',
      'paasbAutoComplete',
      function ($window, $document, $timeout, paasbUi, paasbUtils, paasbAutoComplete) {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox-auto-complete.html',

            'require': '^paasbSearchBox',

            'scope': {

              'query': '=',

              'config': '=',

              'input': '='

            },

            controller: function ($scope, $element) {

              var config = $scope.config;

              $scope.$watch('query', function (__new) {

                if($scope.tookSuggestion !== __new) {

                  $scope.tookSuggestion = null;

                  if(__new) {

                    paasbAutoComplete
                      .load(config.autoCompleteUrl)
                        .then(function (data) {

                          $scope.autoSuggestions = data;

                          $scope.showSuggestions = true;

                          $scope.position();

                        });

                  }

                }

              });

              angular.extend($scope, {

                'Utils': paasbUtils,

                'tookSuggestion': null,

                'showSuggestions': false,

                autoCompleteClick: function (ev) {

                  var tgt = ev.target,

                    elem = $element[0];

                  if(!elem.contains(tgt)) {

                    paasbUi.extend($scope, {

                      'showSuggestions': false

                    });

                  }

                  $document.unbind('click', $scope.autoCompleteClick);

                },

                position: function () {

                  $timeout(function () {

                    var input = $scope.input[0],

                      inputPadding = paasbUtils.getStyle(input, 'padding-left'),

                      inputWidth = paasbUtils.getStyle(input, 'width') -

                        paasbUtils.getStyle(input, 'padding-right') -

                        inputPadding;

                    $element
                      .css('left', inputPadding + 'px')
                      .css('width', inputWidth + 'px');

                  });

                },

                takeAutoComplete: function (suggestion) {

                  paasbUi.extend($scope, {

                    'showSuggestions': false,

                    'tookSuggestion': suggestion

                  });

                  $scope.$emit('take.autoSuggestion', suggestion);

                  $document.unbind('click', $scope.autoCompleteClick);

                },

                registerEvents: function () {

                  angular
                    .element($window)
                    .on('resize', function () {

                      $scope.position();

                    });

                  $scope.$on('input.focused', function () {

                    if($scope.autoSuggestions && $scope.autoSuggestions.length) {

                      paasbUi.extend($scope, {

                        'showSuggestions': true

                      });

                    }

                  });

                  $scope.$watch('showSuggestions', function (__new) {

                    if(__new) {

                      $document.bind('mousedown', $scope.autoCompleteClick);

                    }

                  });

                  return $scope;

                }

              });

              $scope
                .registerEvents();

            }

        };

    }]);

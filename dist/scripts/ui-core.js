'use strict';

angular.module('paasb', [

]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBoxFiltering
 * @description
 * # Implementation of paasbSearchBoxFiltering
 */

angular.module('paasb')

    .directive('paasbSearchBoxFiltering', [
      function () {

        return {

            'restrict': 'A',

            'require': '^paasbSearchBox',

            controller: function ($scope, $element) {

              console.log("Give me filtering");

            }

        };

    }]);

'use strict';

/**
 * @ngdoc directive
 * @name paasb.directive:paasbSearchBox
 * @description
 * # Implementation of paasbSearchBox
 */

angular.module('paasb')

    .directive('paasbSearchBox', [
      function () {

        return {

            'restrict': 'E',

            'replace': true,

            'templateUrl': 'views/directives/searchbox.html',

            'scope': {

            },

            controller: function ($scope, $element) {

              console.log($scope, $element);

            }

        };

    }]);

angular.module('paasb').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/searchbox-filtering.html',
    ""
  );


  $templateCache.put('views/directives/searchbox.html',
    "\n" +
    "<div class=\"paasb-searchbox\">\n" +
    "  <div class=\"paasb-filtering\">Give me filtering!</div>\n" +
    "</div>"
  );

}]);

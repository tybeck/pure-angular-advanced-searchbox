'use strict';

angular.module('paasb', [

]);

angular.module('paasb').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/searchbox.html',
    "\n" +
    "<div>I'm a searchbox</div>"
  );

}]);

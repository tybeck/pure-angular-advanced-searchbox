<img src="img/angular.png" alt="Angular" align="right" />
## Pure Angular Advanced Searchbox
[![Bower version](https://badge.fury.io/bo/pure-angular-advanced-searchbox.svg)](https://badge.fury.io/bo/pure-angular-advanced-searchbox)
&nbsp;&nbsp;&nbsp;
[![GitHub version](https://badge.fury.io/gh/tybeck%2Fpure-angular-advanced-searchbox.svg)](https://badge.fury.io/gh/tybeck%2Fpure-angular-advanced-searchbox)
&nbsp;&nbsp;&nbsp;
![NPM Dependencies](https://david-dm.org/tybeck/pure-angular-advanced-searchbox.svg)
&nbsp;&nbsp;&nbsp;
![NPM Dev Dependencies](https://david-dm.org/tybeck/pure-angular-advanced-searchbox/dev-status.svg)

### Usage
1. Install with `bower`:
    - `bower install angular-advanced-searchbox`

The bower package contains files in the `dist/` directory with the following includes:

- ui.core.js
- ui.core.min.js
- main.css

Files with the `min` suffix are minified versions to be used in production.

Load the javascript/css and declare your angular dependency:

```html
<!-- dependency includes -->
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/lodash/lodash.js"></script>
<script src="bower_components/lodash-mix/index.js"></script>

<link rel="stylesheet" href="bower_components/components-font-awesome/css/font-awesome.css" />

<!-- pure angular advanced searchbox -->
<script src="bower_components/pure-angular-advanced-searchbox/dist/scripts/ui.core.js"></script>

<link rel="stylesheet" href="bower_components/pure-angular-advanced-searchbox/dist/styles/main.css" />

```

```js
angular.module('myModule', ['pure-angular-advanced-searchbox']);
```

Define the available search parameters / filters in your project:

```js
$scope.sOptions = [];

$scope.sFilters = [
    {
      'name': 'dontFilterMe',
      'displayName': 'I don\'t want to be filtered!',
      'dontFilter': true
    },
    {
      'name': 'cpi',
      'displayName': 'CPI',
      'root': 'Product'
    }, {
      'name': 'gender',
      'displayName': 'Vendor Gender',
      'suggestedValues': 'GENDER',
      'suggestedDataPoint': 'data',
      'reloadOnCreate': true,
      'restrictedSuggestedValues': true,
      'multi': true,
      'root': 'Product'
    }, {
      'name': 'upc',
      'displayName': 'UPC',
      'child': 'Size'
    }
];

$scope.sConfig = {
    'delay': 1000
};
```

### Available Directive Attributes

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>search-params</td>
      <td>Object to store search parameters</td>
      <td>object</td>
    </tr>
    <tr>
      <td>paasb-search-box-filtering</td>
      <td>Object array of filters to provide to searchbox</td>
      <td>array[object]</td>
    </tr>
    <tr>
      <td>paasb-search-box-config</td>
      <td>Object for configuration parameters</td>
      <td>object</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>Placeholder text for searchbox</td>
      <td>string</td>
    </tr>
  </tbody>
</table>


### Available Search Filter Properties

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>Unique key of the search filter.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>displayName</td>
      <td>User friendly display name of the search parameter.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>multi</td>
      <td>Should multiple search filters of the same key allowed? Default is <b>false</b></td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>suggestedValues</td>
      <td>An array of suggested search values, e.g. ['A', 'B', 'C', 'D'], can take a config from search configuration, url, or an array</td>
      <td>string[], string</td>
    </tr>
    <tr>
      <td>suggestedDataPoint</td>
      <td>If an API endpoint (URL) is used via <b>suggestedValues</b>; sometimes the data is stored within an object from the response.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>restrictedSuggestedValues</td>
      <td>Should it restrict possible search values to the ones from the suggestedValues array? Default is <b>false</b>.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>reloadOnCreate</td>
      <td>Should we reload the suggested values when you re-open the filter?  This only works when a URL is provided. Default is <b>false</b>.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>root</td>
      <td>Is this a root level filter? This usually helps derive filters to different tables if necessary.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>child</td>
      <td>Is this a child level filter? This usually helps derive filters to different tables if necessary.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>


### Available Search Configuration Properties

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>delay</td>
      <td>Would you like to provide a delay before the search parameters get updated? Default is <b>0</b></td>
      <td>number</td>
    </tr>
    <tr>
      <td>&lt;configName&gt;</td>
      <td>Custom configuration property that can be injected into filter parameters; useful when using constants via <b>suggestedValues</b></td>
      <td>string</td>
    </tr>
  </tbody>
</table>

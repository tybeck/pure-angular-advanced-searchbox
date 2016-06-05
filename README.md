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

### Available Search Parameters Properties

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
      <td>key</td>
      <td>Unique key of the search parameter that is used for the ng-model value.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>name</td>
      <td>User friendly display name of the search parameter.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>Specifies a short hint in the parameter search box</td>
      <td>string</td>
    </tr>
    <tr>
      <td>allowMultiple</td>
      <td>Should multiple search parameters of the same key allowed? Output type changes to array of values. Default is false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>suggestedValues</td>
      <td>An array of suggested search values, e.g. ['Berlin', 'London', 'Paris']</td>
      <td>string[]</td>
    </tr>
    <tr>
      <td>restrictToSuggestedValues</td>
      <td>Should it restrict possible search values to the ones from the suggestedValues array? Default is false.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

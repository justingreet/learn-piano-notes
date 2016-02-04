'use strict';

// Declare app level module which depends on views, and components
angular.module('pianoPitchDetector', [
  'ngRoute',
  'pianoPitchDetector.note-detection'
])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/note-detection'});
    }]);
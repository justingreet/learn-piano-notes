'use strict';

// Declare app level module which depends on views, and components

var pianoPitchDetector = angular.module('pianoPitchDetector', ['ngRoute', 'pianoPitchDetector.note-detection']);

pianoPitchDetector.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/note-detection' });
}]);

//# sourceMappingURL=app-compiled.js.map
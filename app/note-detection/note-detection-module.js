'use strict';

var noteDetectionModule = angular.module('pianoPitchDetector.note-detection', [
  'ngRoute',
  'pianoPitchDetector.waveform-helpers',
  'pianoPitchDetector.note-detector'
]);

noteDetectionModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/note-detection', {
    templateUrl: 'note-detection/note-detection.html',
    controller: 'NoteDetectionController',
    controllerAs: 'ctrl'
  });
}]);
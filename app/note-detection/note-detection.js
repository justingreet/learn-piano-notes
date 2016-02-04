'use strict';

angular.module('pianoPitchDetector.note-detection', [
  'ngRoute',
  'pianoPitchDetector.note-detector'
])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/note-detection', {
        templateUrl: 'note-detection/note-detection.html',
        controller: 'NoteDetectionController',
        controllerAs: 'ctrl'
      });
    }])

    .controller('NoteDetectionController', ['noteDetectorService',
      function(noteDetectorService) {
        noteDetectorService.doStuff();
      }
    ]);
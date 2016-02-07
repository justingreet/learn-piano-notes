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
        this.keyNum = -1;
        var self = this;

        self.detectKeyNum = function() {
          noteDetectorService.detectKeyNum();
        };

        noteDetectorService.registerCallback(function(keyNum) {
          document.getElementById('stuff').innerHTML = keyNum;
        })
      }
    ]);
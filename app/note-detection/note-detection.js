'use strict';

angular.module('pianoPitchDetector.note-detection', [
  'ngRoute',
  'pianoPitchDetector.note-detector',
  'pianoPitchDetector.waveform-helpers'
])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/note-detection', {
        templateUrl: 'note-detection/note-detection.html',
        controller: 'NoteDetectionController',
        controllerAs: 'ctrl'
      });
    }])

    .controller('NoteDetectionController', ['noteDetectorService',
      'drawWaveformService', 'perfectNoteService',
      function(noteDetectorService, drawWaveformService, perfectNoteService) {
        this.keyNum = -1;
        var self = this;

        self.detectKeyNum = function() {
          var keyNum = parseInt(document.getElementById("numStuff").value);
          noteDetectorService.detectKeyNum(
              perfectNoteService.getPerfectWaveform(keyNum));
        };

        noteDetectorService.registerCallback(function(keyNum) {
          document.getElementById('stuff').innerHTML = keyNum;
        });
      }
    ]);
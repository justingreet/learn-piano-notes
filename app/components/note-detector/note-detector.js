'use strict';

angular.module('pianoPitchDetector.note-detector', [])

    .service('noteDetectorService', ['$rootScope', function($rootScope) {
      this.doStuff = function() {
        console.log('we doin stuff');
      };
      console.log('in note detector service!');

      var j = {
        stuff: 'hey',
        ob: 'meeep'
      }
    }]);
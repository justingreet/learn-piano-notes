'use strict';

var helperModule = angular.module('pianoPitchDetector.waveform-helpers');

helperModule.service('perfectNoteService', ['utilService', function (utilService) {
  //Hey there
  this.getPerfectWaveform = function (keyNum) {
    var freq = utilService.getFrequencyFromKeyNum(keyNum);
    var samplesPerPeriod = utilService.getSamplesPerPeriod(freq, 44100);
    var bufLen = 8192;
    var buffer = [];

    for (var i = 0; i < bufLen; i++) {
      // Need to split 360 degrees into samplesPerPeriod pieces
      var indexInPeriod = i % samplesPerPeriod;
      var degree = 360 / samplesPerPeriod * indexInPeriod;
      var radian = degree * (Math.PI / 180);
      buffer.push(Math.sin(radian));
    }

    return buffer;
  };
}]);

//# sourceMappingURL=perfect-note-service-compiled.js.map
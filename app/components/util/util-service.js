var utilModule = angular.module('pianoPitchDetector.util');

utilModule.service('utilService', function() {
  this.getFrequencyFromKeyNum = function(keyNum) {
    var power = (keyNum - 49)/12;
    var freq = Math.pow(2, power)*440;
    return freq;
  };


  this.getSamplesPerPeriod = function(freq, sampleRate) {
    return Math.round(sampleRate/freq);
  };
});
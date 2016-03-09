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


  this.isKeyNumFlatOrSharp = function(keyNum) {
    // Let C2 act as our zero.
    let rootKeyNum = 16;

    // These key numbers (relative to a zero-indexed zero) are sharps and flats.
    let sharpsAndFlats = [1,3,6,8,10];

    const KEYS_PER_OCTAVE = 12;
    let offsetFromZero = (keyNum - rootKeyNum) % KEYS_PER_OCTAVE;

    return sharpsAndFlats.indexOf(offsetFromZero) > -1;
  }
});

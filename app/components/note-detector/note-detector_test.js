'use strict';

describe('Pitch detector', function() {
  var noteDetector;

  beforeEach(module('pianoPitchDetector.note-detector'));

  beforeEach(inject(function(noteDetectorService) {
    noteDetector = noteDetectorService;
  }));


  it('should be able to register a callback.', function() {
    var callback = function() {
      var j = 4;
      return j + 6;
    };

    expect(noteDetector.callback).toBeUndefined();
    noteDetector.registerCallback(callback);
    expect(noteDetector.callback).toEqual(callback);
  });

  it('should extract frequency from key number.', function() {
    expect(noteDetector.getFrequencyFromKeyNum(1)).toBeCloseTo(27.5);
    
    expect(noteDetector.getFrequencyFromKeyNum(40)).toBeCloseTo(261.626);
    
    expect(noteDetector.getFrequencyFromKeyNum(70)).toBeCloseTo(1479.98);
  });

  it('should correctly calculate likelihood of frequency.', function() {
    // Given a known (and easy to work with) set of data
    noteDetector.getFrequencyFromKeyNum = function() {return 3};
    noteDetector.SAMPLE_RATE = 6;
    // Let's assume we guessed the right frequency
    var values = [.42,.97,.41,.95,.39,.96];

    // When we calculate likelihood
    var likelihood = noteDetector.calculateLikelihoodOfFrequency(4, values);

    expect(likelihood).toBeCloseTo(.985);
  });

  describe('FANCY TESTS', function() {
    // TODO: Write an actual test suite against real files.
  });
});
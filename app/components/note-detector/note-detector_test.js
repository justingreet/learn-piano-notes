'use strict';

describe('Pitch detector', function() {
  var noteDetector;
  var perfectNote;

  // TODO: Fix these tests to get them to run.
  beforeEach(module('pianoPitchDetector.note-detector'));

  beforeEach(inject(function(noteDetectorService, perfectNoteService) {
    noteDetector = noteDetectorService;
    perfectNote = perfectNoteService;
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

  describe('the note detector should correctly identify the note', function() {
    describe('of an ideal waveform', function() {

      var detectedNote;

      beforeEach(function() {
        noteDetector.registerCallback(function(bestNote) {
          detectedNote = bestNote;
        });
      });

      for (var i = 1; i <= 88; i++) {
        it('of note ' + i, function() {
          // Given a perfect waveform
          var waveform = perfectNote.getPerfectWaveform(i);

          noteDetector.detectKeyNum(waveform);

          expect(detectedNote).toEqual(i);
        });
      }
    });
  });
});
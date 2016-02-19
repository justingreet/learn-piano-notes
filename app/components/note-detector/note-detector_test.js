'use strict';

describe('Pitch detector', function() {
  var noteDetector;
  var perfectNote;

  beforeEach(module('pianoPitchDetector.note-detector'));
  beforeEach(module('pianoPitchDetector.waveform-helpers'));

  beforeEach(inject(function(noteDetectorService, perfectNoteService) {
    noteDetector = noteDetectorService;
    perfectNote = perfectNoteService;
  }));

  describe('the note detector should correctly identify the note', function() {
    describe('of an ideal waveform', function() {
      beforeEach(function() {
        noteDetector.setSampleRate(44100);
        noteDetector.detectedKeyQueue = [];
      });

      for (var i = 0; i <= 87; i++) {
        it('of note ' + i + '.', function() {
          // Given a perfect waveform
          var waveform = perfectNote.getPerfectWaveform(i);

          // When we detect the note that is present
          var detectedNote = noteDetector.detectKeyNum(waveform);

          // Then we expect it to be correct
          expect(detectedNote).toEqual(i);
        });
      }
    });
  });

  describe('the note detector should smooth out results', function() {
    beforeEach(function() {
      noteDetector.setSampleRate(44100);
      noteDetector.NUM_MATCHES_REQUIRED = 3;
    });

    it('when the same result is repeated enough times.', function() {
      // Given a history with a result that repeats enough times
      noteDetector.detectedKeyQueue = [1,1,1,2];

      // When we add a new result that doesn\'t create a new run
      var keyToReturn = noteDetector.determineKeyToReturn(3);

      // Then we expect the historical run to be returned
      expect(keyToReturn).toEqual(1);
      expect(noteDetector.detectedKeyQueue).toEqual([1,1,1,2,3]);
    });

    it('when there aren\'t enough results.', function() {
      // Given a history with no run
      noteDetector.detectedKeyQueue = [1,1,2];

      // When we add a result that doesn\'t create a new run
      var keyToReturn = noteDetector.determineKeyToReturn(3);

      // Then we expect the new result to be returned
      expect(keyToReturn).toEqual(3);
      expect(noteDetector.detectedKeyQueue).toEqual([1,1,2,3]);
    });

    it('when a new run is about to be formed.', function() {
      // Given a history with a run
      noteDetector.detectedKeyQueue = [1,1,1,2,3,3];

      // When we add a result that creates a new run
      var keyToReturn = noteDetector.determineKeyToReturn(3);

      // Then we expect the new run to be returned
      expect(keyToReturn).toEqual(3);
      expect(noteDetector.detectedKeyQueue).toEqual([3,3,3]);
    });
  });
});

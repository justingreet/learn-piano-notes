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
});
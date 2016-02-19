'use strict';

var noteDetectionModule = angular.module('pianoPitchDetector.note-detection');
noteDetectionModule.controller('NoteDetectionController', [
  'noteDetectorService', function(noteDetectorService) {
    var self = this;

    this.init = function() {
      /**
       * @type {number} The number of data points we capture from the mic.
       * This is the smallest power of 2 that allows us to capture at least
       * 2 instances of the lowest piano note (which has frequency 27.5) at a
       * sample rate of 44,100. The buffer should capture 9% of a second.
       */
      self.BUF_LEN = 4096;

      /** @type {Float32Array} The array that stores the mic data points. */
      self.buffer = new Float32Array(this.BUF_LEN);
      self.audioContext = new AudioContext();

      /** @type {number} The sample rate of the audio context. */
      self.SAMPLE_RATE = self.audioContext.sampleRate;
      noteDetectorService.setSampleRate(self.SAMPLE_RATE);


      /**
       * Create an Audio Node for the input from the user's mic, an Audio Node
       * to analyze that data, and hook them together.
       * @param stream The media stream from the user's mic
       */
      var initDetection = function(stream) {
        // Create an AudioNode from the stream.
        var mediaStreamSource =
            self.audioContext.createMediaStreamSource(stream);

        // Create an analyser node.
        self.analyser = self.audioContext.createAnalyser();
        self.analyser.fftSize = 2048;
        // Take the output of the stream and pass it to the analyser as input.
        mediaStreamSource.connect(self.analyser);

        window.setInterval(self.detectNote, 94);
      };

      var error = function() {
        console.log('ERROR! ERROR!');
      };

      navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
      navigator.getUserMedia(({audio: true}), initDetection, error);
    };

    this.detectNote = function() {
      self.analyser.getFloatTimeDomainData(self.buffer);
      var detectedNote = noteDetectorService.detectKeyNum(self.buffer);

      document.getElementById('stuff').innerHTML = detectedNote;
    };

    this.init();
  }
]);

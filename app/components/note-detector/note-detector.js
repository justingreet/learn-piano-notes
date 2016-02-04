'use strict';

angular.module('pianoPitchDetector.note-detector', [])

    // TODO: Add babel so that you can use modules
    .service('noteDetectorService', ['$rootScope', function($rootScope) {

      /**
       * @type {number} The number of data points we capture from the mic.
       * This is the smallest power of 2 that allows us to capture at least
       * 3 instances (it's actually 5) of the lowest piano note (which has
       * frequency 27.5) at a sample rate of 44,100. The buffer should
       * capture 18% of a second.
       */
      var BUF_LEN = 8192;

      /** @type {Float32Array} The array that stores the mic data points. */
      this.buffer = new Float32Array(BUF_LEN);
      this.audioContext = new AudioContext();

      /** @type {number} The sample rate of the audio context. */
      var SAMPLE_RATE = this.audioContext.sampleRate;
      debugger;

      this.analyser;

      var self = this;

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

        detectPitch();
      };

      var error = function() {
        console.log('Error!');
      };

      /**
       * Fetch the stream of data from the user's microphone, and send it to a
       * success callback.
       */
      navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
      navigator.getUserMedia(({audio: true}), initDetection, error);

      /**
       * Two approaches come to mind:
       *  1) Auto-correlation.
       *  2) Run through all of the possible frequencies for piano notes,
       *     and pick the closest one. Start with this one.
       *
       *  Alternatively, for increased accuracy you can implement both and use
       *  one as a check for the other.
       *
       *  More details on the second method, which seems to be a slightly
       *  juiced-up version of zero-crossing:
       *    If note has frequency F, and we have a buffer of size B and a sample
       *    rate SR, then B/SR is the percentage of a second we capture. 1/F
       *    is the percentage of a second that should pass between
       *    repetitions of the note. That means we want to test by jumping
       *    over (1/F)/(B/SR) = SR/(F*B) percent of B.
       */
      var detectPitch = function() {
        self.analyser.getFloatTimeDomainData(self.buffer);
      }
    }]);
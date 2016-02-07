'use strict';

angular.module('pianoPitchDetector.note-detector', [])

    // TODO: Write a test suite that compares these results to actual
    // recorded piano
    // TODO: Add babel (or use typescript) so that you can use modules
    .service('noteDetectorService', [function() {

      /**
       * @type {number} The number of data points we capture from the mic.
       * This is the smallest power of 2 that allows us to capture at least
       * 3 instances (it's actually 5) of the lowest piano note (which has
       * frequency 27.5) at a sample rate of 44,100. The buffer should
       * capture 18% of a second.
       */
      this.BUF_LEN = 8192;

      /** @type {Float32Array} The array that stores the mic data points. */
      this.buffer = new Float32Array(this.BUF_LEN);
      this.audioContext = new AudioContext();

      /** @type {number} The sample rate of the audio context. */
      this.SAMPLE_RATE = this.audioContext.sampleRate;

      this.NUM_KEYS = 88;

      this.analyser;
      this.callback;

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

        self.detectKeyNum();
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
      this.detectKeyNum = function() {
        if (!self.callback) {
          return;
        }

        self.updateBufferWithTimeSeries();

        var bestLikelihood = 0;
        var bestKey = -1;
        for (var keyNum = 1; keyNum <= self.NUM_KEYS; keyNum++) {
          var curLikelihood =
              self.calculateLikelihoodOfFrequency(keyNum, self.buffer);
          if (curLikelihood > bestLikelihood) {
            bestLikelihood = curLikelihood;
            bestKey = keyNum;
          }
        }
        self.callback(bestKey);

        if (!window.requestAnimationFrame)
          window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        window.requestAnimationFrame(self.detectKeyNum);
      };


      this.updateBufferWithTimeSeries = function() {
        self.analyser.getFloatTimeDomainData(self.buffer);
      };


      this.getFrequencyFromKeyNum = function(keyNum) {
        var power = (keyNum - 49)/12;
        var freq = Math.pow(2, power)*440;
        return freq;
      };


      /**
       * We need to figure out how many iterations of a note in the buffer
       * to test on. In a later, more accurate version, we want to segment
       * the buffer when we have disagreement to say something like: the
       * first half is key 34, the second half is key 67. Because we want to
       * be quick, we choose key 67.
       *
       * For now I'll just assume the whole buffer contains a single note
       * and do as many comparisons as I can.
       */
      self.calculateLikelihoodOfFrequency = function(keyNum, values) {
        var freq = self.getFrequencyFromKeyNum(keyNum);

        // Unit of (# samples)/ (iteration of note)
        var samplesPerPeriod = Math.floor(self.SAMPLE_RATE/freq);
        //var numJumps = Math.floor(BUF_LEN/jumpSize);

        // Now, we assume we have a particular note that has a fixed
        // period. Compare segments of the wave with length of that period
        // to each other, and if they're similar then we made a good guess.
        var maxVals = 0;
        var differences = 0;
        for (var j = 0; j < samplesPerPeriod; j++) {
          var basePoint = values[j];
          var comparisonPoint = values[samplesPerPeriod + j];

          differences = Math.abs(basePoint - comparisonPoint);
          maxVals += Math.max(basePoint, comparisonPoint);
        }

        return 1 - (differences/maxVals);
      };

      this.registerCallback = function(callback) {
        this.callback = callback;
      }
    }]);
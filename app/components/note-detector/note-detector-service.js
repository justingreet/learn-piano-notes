'use strict';

var noteDetectorModule = angular.module('pianoPitchDetector.note-detector');

noteDetectorModule.service('noteDetectorService', ['utilService',
  function(utilService) {

    this.NUM_KEYS = 88;
    this.SAMPLE_RATE;

    /**
     * Keep a queue of the most recent guesses for key numbers. Note that
     * the entries in this queue might differ from the actual values
     * returned from detectKeyNum.
     */
    this.detectedKeyQueue = [];

    this.NUM_MATCHES_REQUIRED = 3;


    var self = this;


    /**
     * Determines what key number should be displayed to the user. It helps
     * smooth out results to prevent the jumpiness that seems to exist in
     * all the other pitch detectors.
     * @param {number} detectedKey
     * @returns {number}
     */
    this.determineKeyToReturn = function(detectedKey) {
      // We only need to be able to go far enough back to find the last run
      // of matching keys of length NUM_MATCHES_REQUIRED.
      self.detectedKeyQueue.push(detectedKey);

      var prevKeyNum = -1;
      var runLength = 0;
      for (var i = self.detectedKeyQueue.length - 1; i >= 0; i--) {
        var curKeyNum = self.detectedKeyQueue[i];

        if (curKeyNum === prevKeyNum) {
          runLength += 1;
          if (runLength >= self.NUM_MATCHES_REQUIRED) {
            // We want the queue to be as short as possible (we can do some
            // more optimization later if it becomes an issue).
            self.detectedKeyQueue = self.detectedKeyQueue.slice(i);

            return curKeyNum;
          }
        } else {
          runLength = 1;
        }

        prevKeyNum = curKeyNum;
      }

      // We don't have any run of sufficient length, so just return whatever
      // was passed in.
      return detectedKey;
    };

    this.setSampleRate = function(sampleRate) {
      self.SAMPLE_RATE = sampleRate;
    };


    this.detectKeyNum = function(buffer) {
      if (!self.SAMPLE_RATE) {
        throw "No sample rate has been set.";
      }

      var bestLikelihood = 0;
      var bestKey = -1;
      for (var keyNum = 1; keyNum <= self.NUM_KEYS; keyNum++) {
        var curLikelihood =
            self.calculateLikelihoodOfFrequency(keyNum, buffer);
        // We do = because we want the highest frequency that matches.
        if (curLikelihood >= bestLikelihood) {
          bestLikelihood = curLikelihood;
          bestKey = keyNum;
        }
      }

      return self.determineKeyToReturn(bestKey);
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
      var freq = utilService.getFrequencyFromKeyNum(keyNum);

      // Unit of (# samples)/ (iteration of note)
      var samplesPerPeriod =
          utilService.getSamplesPerPeriod(freq, self.SAMPLE_RATE);

      var differences = 0;

      /*    if (keyNum >= 85) {
       var sign = document.createElement('h2');
       sign.innerHTML = keyNum.toString();
       document.body.appendChild(sign);
       drawWaveformService.addWaveform(values.slice(0));
       drawWaveformService.addWaveform(values.slice(samplesPerPeriod));
       }*/

      for (var j = samplesPerPeriod; j < values.length; j++) {
        var basePoint = values[j - samplesPerPeriod];
        var comparisonPoint = values[j];

        differences += Math.abs(basePoint - comparisonPoint);
      }

      var differencePerUnit = differences/values.length;
      return 1 - differencePerUnit;
    };
  }]);
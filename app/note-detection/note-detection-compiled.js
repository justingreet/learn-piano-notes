'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noteDetectionModule = angular.module('pianoPitchDetector.note-detection');

var NoteDetectionController = function () {
  function NoteDetectionController(noteDetectorService) {
    var _this = this;

    _classCallCheck(this, NoteDetectionController);

    this.noteDetectorService = noteDetectorService;

    /**
     * @type {number} The number of data points we capture from the mic.
     * This is the smallest power of 2 that allows us to capture at least
     * 2 instances of the lowest piano note (which has frequency 27.5) at a
     * sample rate of 44,100. The buffer should capture 9% of a second.
     */
    this.BUF_LEN = 4096;

    /** @type {Float32Array} The array that stores the mic data points. */
    this.buffer = new Float32Array(this.BUF_LEN);
    this.audioContext = new AudioContext();

    /** @type {number} The sample rate of the audio context. */
    this.SAMPLE_RATE = this.audioContext.sampleRate;
    this.noteDetectorService.setSampleRate(this.SAMPLE_RATE);

    var error = function error() {
      console.log('ERROR! ERROR!');
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({ audio: true }, function (stream) {
      return _this.initDetection(stream);
    }, error);
  }

  /**
   * Create an Audio Node for the input from the user's mic, an Audio Node
   * to analyze that data, and hook them together.
   * @param stream The media stream from the user's mic
   */


  _createClass(NoteDetectionController, [{
    key: 'initDetection',
    value: function initDetection(stream) {
      var _this2 = this;

      // Create an AudioNode from the stream.
      var mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

      // Create an analyser node.
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      // Take the output of the stream and pass it to the analyser as input.
      mediaStreamSource.connect(this.analyser);

      window.setInterval(function () {
        return _this2.detectNote();
      }, 94);
    }
  }, {
    key: 'detectNote',
    value: function detectNote() {
      /*this.analyser.getFloatTimeDomainData(this.buffer);
      var detectedNote = this.noteDetectorService.detectKeyNum(this.buffer);
       document.getElementById('stuff').innerHTML = detectedNote;*/
    }
  }]);

  return NoteDetectionController;
}();

noteDetectionModule.controller('NoteDetectionController', NoteDetectionController);

//# sourceMappingURL=note-detection-compiled.js.map
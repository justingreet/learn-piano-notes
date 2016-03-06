'use strict';

var noteDetectionModule = angular.module('pianoPitchDetector.note-detection');

class NoteDetectionController {
  constructor(noteDetectorService) {
    this.noteDetectorService = noteDetectorService;

    this.isPlaying = false;
    this.detectionInterval;

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

    var error = function() {
      console.log('ERROR! ERROR!');
    };

    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    navigator.getUserMedia(({audio: true}),
        stream => this.initDetection(stream), error);
  }

  pause() {
    this.isPlaying = false;
    //clearInterval(this.detectionInterval);
  }

  start() {
    this.isPlaying = true;
    this.detectionInterval = window.setInterval(() => this.detectNote(), 94);
  }


  /**
   * Create an Audio Node for the input from the user's mic, an Audio Node
   * to analyze that data, and hook them together.
   * @param stream The media stream from the user's mic
   */
  initDetection(stream) {
    // Create an AudioNode from the stream.
    var mediaStreamSource =
        this.audioContext.createMediaStreamSource(stream);

    // Create an analyser node.
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    // Take the output of the stream and pass it to the analyser as input.
    mediaStreamSource.connect(this.analyser);
  }


  detectNote() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    if (this.isPlaying) {
      this.noteDetectorService.detectKeyNum(this.buffer);
    }
  }
}

noteDetectionModule.controller('NoteDetectionController',
    NoteDetectionController);

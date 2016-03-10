'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

noteTrainerModule.directive('noteTrainer', function () {
  var REFRESH_TIME = 40;

  var SPACE_BETWEEN_LINES = 50;

  var STAFF_HEIGHT = 200;
  var STAFF_WIDTH = 300;
  var NUM_STAFFS_PER_LINE = 3;
  var NUM_LINES = 3;

  var util;

  var timePerStaff = 2500;

  var Staff = function () {
    function Staff(top, left, noteNum, ctx) {
      _classCallCheck(this, Staff);

      this.top = top;
      this.left = left;
      this.noteNum = noteNum;
      this.ctx = ctx;

      this.isActive = false;

      this.hasCorrectNoteBeenPlayed = false;
    }

    _createClass(Staff, [{
      key: 'noteDetected',
      value: function noteDetected(detectedNote) {
        if (detectedNote === this.noteNum) {
          this.hasCorrectNoteBeenPlayed = true;
        }
      }
    }, {
      key: 'enter',
      value: function enter() {
        this.isActive = true;
      }
    }, {
      key: 'exit',
      value: function exit() {
        this.isActive = false;
      }
    }, {
      key: 'updateTop',
      value: function updateTop(newTop) {
        this.top = newTop;
      }
    }, {
      key: 'draw',
      value: function draw() {
        var ctx = this.ctx;

        // Store the old values.
        var oldStyle = ctx.strokeStyle;
        var oldWidth = ctx.lineWidth;

        // Set the new values.
        var LINE_THICKNESS = this.isActive ? 4 : 1;
        ctx.lineWidth = LINE_THICKNESS;
        ctx.strokeStyle = this.hasCorrectNoteBeenPlayed ? 'green' : 'black';

        // Begin the new path for the staff.
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);

        var self = this;

        // There are 4 empty spots in the treble clef, 2 empty slots in
        // between the clefs, and 4 empty slots in the bass clef.
        var numNoteSlots = 10;

        // Need to leave space for the 5 lines of treble clef, 1 line for
        // middle c, and 5 lines of bass clef.
        var heightOfNote = (STAFF_HEIGHT - 11 * LINE_THICKNESS) / numNoteSlots;

        var drawFiveLines = function drawFiveLines(top) {
          for (var i = 0; i < 5; i++) {
            var curTop = top + i * (LINE_THICKNESS + heightOfNote);
            ctx.moveTo(self.left, curTop);
            ctx.lineTo(self.left + STAFF_WIDTH, curTop);
          }

          return 4 * heightOfNote + 5 * LINE_THICKNESS;
        };

        // Draw treble clef.
        var trebleClefHeight = drawFiveLines(this.top);
        // The vertical space needed for the 3 notes that sit between clefs.
        var heightBetweenClefs = 2 * heightOfNote + LINE_THICKNESS;

        // Draw bass clef. Leave space above it for treble clef and notes in
        // between clefs.
        drawFiveLines(this.top + trebleClefHeight + heightBetweenClefs);

        // Draw the vertical line separating staffs.
        ctx.moveTo(this.left + STAFF_WIDTH, this.top);
        ctx.lineTo(this.left + STAFF_WIDTH, this.top + STAFF_HEIGHT);

        var calcNumStepsAboveFloor = function calcNumStepsAboveFloor(noteNum) {
          // Even though it's incorrect, a step in this context is the number
          // of space above the bottom of the bass clef a note is located. So,
          // note 23 has a step of 0, note 25 has a step of 1, note 27 has a
          // step of 2, note 40 has a step of 10.
          var numStepsPerOctave = 6;
          var newZero = noteNum - 23;
          var numOctavesFromZero = Math.floor(newZero / 12);

          var numKeysFromStartOfOctave = newZero % 12;

          var numStepsAboveStartOfOctave = 0;
          switch (numKeysFromStartOfOctave) {
            case 0:
              numStepsAboveStartOfOctave = 0;
              break;
            case 2:
              numStepsAboveStartOfOctave = 1;
              break;
            case 4:
              numStepsAboveStartOfOctave = 2;
              break;
            case 5:
              numStepsAboveStartOfOctave = 3;
              break;
            case 7:
              numStepsAboveStartOfOctave = 4;
              break;
            case 9:
              numStepsAboveStartOfOctave = 5;
              break;
            case 10:
              numStepsAboveStartOfOctave = 6;
              break;
          }
          var numStepsAboveZero = numOctavesFromZero + numOctavesFromZero * numStepsPerOctave + numStepsAboveStartOfOctave;

          return numStepsAboveZero;
        };
        // Draw a circle on the staff to represent the note to be played.
        var noteXCenter = this.left + 20;
        var noteRadius = heightOfNote / 2;
        // 57 is highest note in treble cleff.
        var numStepsAboveFloor = calcNumStepsAboveFloor(this.noteNum);
        var numLinesToSubtract = Math.floor(numStepsAboveFloor / 2) + 1;
        var noteYCenter = this.top + STAFF_HEIGHT - (numStepsAboveFloor * (heightOfNote / 2) + numLinesToSubtract * LINE_THICKNESS);

        ctx.moveTo(noteXCenter + noteRadius, noteYCenter);
        ctx.arc(noteXCenter, noteYCenter, noteRadius, 0, 2 * Math.PI);

        /*      // Draw some text.
              ctx.fillText(this.noteNum,
                  this.left + (STAFF_WIDTH*.5),
                  this.top+(STAFF_HEIGHT*.5));*/

        // Actually draw the lines.
        ctx.stroke();

        // Finish off the staff's path.
        ctx.moveTo(this.left, this.top);
        ctx.closePath();

        // Restore the old values.
        ctx.strokeStle = oldStyle;
        ctx.lineWidth = oldWidth;
      }
    }]);

    return Staff;
  }();

  var Line = function () {
    function Line(top, ctx) {
      var opt_left = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      _classCallCheck(this, Line);

      var maxNote = 57;
      var minNote = 23;

      this.top = top;
      this.ctx = ctx;
      this.left = opt_left;

      this.width = STAFF_WIDTH * NUM_STAFFS_PER_LINE;

      this.isActive = false;
      this.activeStaffIndex = -1;

      this.staffs = [];
      for (var i = 0; i < NUM_STAFFS_PER_LINE; i++) {
        var noteNum = Math.round(Math.random() * (maxNote - minNote) + minNote);
        while (util.isKeyNumFlatOrSharp(noteNum)) {
          noteNum = Math.round(Math.random() * (maxNote - minNote) + minNote);
        }
        this.staffs.push(new Staff(top, i * STAFF_WIDTH, noteNum, this.ctx));
      }
    }

    _createClass(Line, [{
      key: 'enter',
      value: function enter() {
        this.isActive = true;
        this.activeStaffIndex = 0;
        this.staffs[0].enter();
      }
    }, {
      key: 'exit',
      value: function exit() {
        this.isActive = false;
        this.staffs[this.staffs.length - 1].exit();
      }
    }, {
      key: 'noteDetected',
      value: function noteDetected(detectedNote) {
        if (this.activeStaffIndex >= 0) {
          this.staffs[this.activeStaffIndex].noteDetected(detectedNote);
        }
      }
    }, {
      key: 'updateTop',
      value: function updateTop(newTop) {
        this.staffs.forEach(function (staff) {
          staff.updateTop(newTop);
        });

        this.top = newTop;
      }
    }, {
      key: 'draw',
      value: function draw(progressLineX) {
        if (this.isActive) {
          var newActiveStaffIndex = Math.floor(progressLineX / STAFF_WIDTH);
          if (newActiveStaffIndex !== this.activeStaffIndex) {
            this.staffs[this.activeStaffIndex].exit();
            this.staffs[newActiveStaffIndex].enter();
            this.activeStaffIndex = newActiveStaffIndex;
          }
        }
        this.staffs.forEach(function (staff) {
          return staff.draw();
        });
      }
    }]);

    return Line;
  }();

  var NoteTrainerController = function () {
    function NoteTrainerController($scope, noteDetectorService, utilService) {
      var _this = this;

      _classCallCheck(this, NoteTrainerController);

      util = utilService;

      // Listen for when the user toggles play/pause.
      $scope.$watch(function () {
        return $scope.isPlaying;
      }, function (newVal) {
        if (newVal) {
          _this.start();
        } else {
          _this.pause();
        }
      });

      this.canvasWidth = 10 + NUM_STAFFS_PER_LINE * STAFF_WIDTH;
      this.canvasHeight = 10 + NUM_LINES * STAFF_HEIGHT + (NUM_LINES - 1) * SPACE_BETWEEN_LINES;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.isPlaying = false;

      this.lines = [];
      for (var i = 0; i < NUM_LINES; i++) {
        this.lines.push(new Line(i * STAFF_HEIGHT + i * SPACE_BETWEEN_LINES, this.ctx));
      }
      this.lines[0].enter();

      this.progressLineX = 0;
      this.progressLineTime = 0;

      noteDetectorService.registerListener(this.noteDetected.bind(this));

      window.setTimeout(function () {
        return _this.draw();
      }, 10);
    }

    _createClass(NoteTrainerController, [{
      key: 'noteDetected',
      value: function noteDetected(detectedNote) {
        this.lines[0].noteDetected(detectedNote);
      }
    }, {
      key: 'start',
      value: function start() {
        var _this2 = this;

        this.isPlaying = true;
        this.refreshInterval = window.setInterval(function () {
          return _this2.update();
        }, REFRESH_TIME);
      }
    }, {
      key: 'pause',
      value: function pause() {
        this.isPlaying = false;
        clearInterval(this.refreshInterval);
      }
    }, {
      key: 'update',
      value: function update() {
        this.draw();

        // Update the progress line.
        var curLine = this.lines[0];

        this.progressLineTime += REFRESH_TIME;
        var percentageOfLineCovered = this.progressLineTime / (NUM_STAFFS_PER_LINE * timePerStaff);
        if (percentageOfLineCovered >= 1) {
          // Generate a new line.
          var lineNum = NUM_LINES - 1;
          var newLineY = lineNum * STAFF_HEIGHT + lineNum * SPACE_BETWEEN_LINES;
          var newLine = new Line(newLineY, this.ctx);

          // Remove top line.
          this.lines[0].exit();
          this.lines.splice(0, 1);

          // Move all existing lines up.
          this.lines.forEach(function (line) {
            line.updateTop(line.top - (STAFF_HEIGHT + SPACE_BETWEEN_LINES));
          });
          this.lines[0].enter();

          // Add new line to bottom.
          this.lines.push(newLine);

          this.progressLineTime = 0;
          percentageOfLineCovered = 0;
          this.draw();
        }

        this.progressLineX = percentageOfLineCovered * curLine.width;
      }
    }, {
      key: 'draw',
      value: function draw() {
        var _this3 = this;

        var ctx = this.ctx;

        // Clear the canvas.
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw the sheet music.
        this.lines.forEach(function (line) {
          return line.draw(_this3.progressLineX);
        });

        // Draw the progress line.
        var oldStrokeStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.strokeStyle = '#FF0000';
        ctx.moveTo(this.progressLineX, 0);
        ctx.lineTo(this.progressLineX, STAFF_HEIGHT);
        ctx.stroke();
        ctx.strokeStyle = oldStrokeStyle;
      }
    }]);

    return NoteTrainerController;
  }();

  return {
    restrict: 'E',
    scope: {
      isPlaying: '='
    },
    controller: NoteTrainerController,
    controllerAs: 'ctrl',
    templateUrl: 'components/note-trainer/note-trainer.html'
  };
});

//# sourceMappingURL=note-trainer-directive-compiled.js.map
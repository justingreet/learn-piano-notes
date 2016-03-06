"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

noteTrainerModule.directive('noteTrainer', function () {
  var REFRESH_TIME = 40;

  var SPACE_BETWEEN_LINES = 50;

  var STAFF_HEIGHT = 200;
  var STAFF_WIDTH = 300;
  var NUM_STAFFS_PER_LINE = 3;
  var NUM_LINES = 3;

  var timePerStaff = 2000;

  var Staff = function () {
    function Staff(top, left, noteNum, ctx) {
      _classCallCheck(this, Staff);

      this.top = top;
      this.left = left;
      this.noteNum = noteNum;
      this.ctx = ctx;

      this.isActive = false;
    }

    _createClass(Staff, [{
      key: "noteDetected",
      value: function noteDetected(detectedNote) {}
    }, {
      key: "enter",
      value: function enter() {
        this.isActive = true;
      }
    }, {
      key: "exit",
      value: function exit() {
        this.isActive = false;
      }
    }, {
      key: "updateTop",
      value: function updateTop(newTop) {
        this.top = newTop;
      }
    }, {
      key: "draw",
      value: function draw() {
        var ctx = this.ctx;

        // Draw the box.
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);

        ctx.lineWidth = this.isActive ? 5 : 2;

        ctx.lineTo(this.left + STAFF_WIDTH, this.top);
        ctx.lineTo(this.left + STAFF_WIDTH, this.top + STAFF_HEIGHT);
        ctx.lineTo(this.left, this.top + STAFF_HEIGHT);
        ctx.lineTo(this.left, this.top);
        ctx.stroke();

        // Draw some text.
        ctx.fillText(this.noteNum, this.left + STAFF_WIDTH * .5, this.top + STAFF_HEIGHT * .5);
      }
    }]);

    return Staff;
  }();

  var Line = function () {
    function Line(top, ctx) {
      var opt_left = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      _classCallCheck(this, Line);

      var maxNote = 50;
      var minNote = 20;

      this.top = top;
      this.ctx = ctx;
      this.left = opt_left;

      this.width = STAFF_WIDTH * NUM_STAFFS_PER_LINE;

      this.isActive = false;
      this.activeStaffIndex = -1;

      this.staffs = [];
      for (var i = 0; i < NUM_STAFFS_PER_LINE; i++) {
        var noteNum = Math.round(Math.random() * (maxNote - minNote) + minNote);
        this.staffs.push(new Staff(top, i * STAFF_WIDTH, noteNum, this.ctx));
      }
    }

    _createClass(Line, [{
      key: "enter",
      value: function enter() {
        this.isActive = true;
        this.activeStaffIndex = 0;
        this.staffs[0].enter();
      }
    }, {
      key: "exit",
      value: function exit() {
        this.isActive = false;
        this.staffs[this.staffs.length - 1].exit();
      }
    }, {
      key: "noteDetected",
      value: function noteDetected() {}
    }, {
      key: "updateTop",
      value: function updateTop(newTop) {
        this.staffs.forEach(function (staff) {
          staff.updateTop(newTop);
        });

        this.top = newTop;
      }
    }, {
      key: "draw",
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
    function NoteTrainerController() {
      _classCallCheck(this, NoteTrainerController);

      this.canvasWidth = NUM_STAFFS_PER_LINE * STAFF_WIDTH;
      this.canvasHeight = NUM_LINES * STAFF_HEIGHT + (NUM_LINES - 1) * SPACE_BETWEEN_LINES;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.lines = [];
      for (var i = 0; i < NUM_LINES; i++) {
        this.lines.push(new Line(i * STAFF_HEIGHT + i * SPACE_BETWEEN_LINES, this.ctx));
      }
      this.lines[0].enter();

      this.progressLineX = 0;
      this.progressLineTime = 0;

      this.start();
    }

    _createClass(NoteTrainerController, [{
      key: "start",
      value: function start() {
        var _this = this;

        this.refreshInterval = window.setInterval(function () {
          return _this.update();
        }, REFRESH_TIME);
      }
    }, {
      key: "pause",
      value: function pause() {
        clearInterval(this.refreshInterval);
      }
    }, {
      key: "update",
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
      key: "draw",
      value: function draw() {
        var _this2 = this;

        var ctx = this.ctx;

        // Clear the canvas.
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw the sheet music.
        this.lines.forEach(function (line) {
          return line.draw(_this2.progressLineX);
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
    scope: {},
    controller: NoteTrainerController,
    controllerAs: 'ctrl',
    templateUrl: 'components/note-trainer/note-trainer.html'
  };
});

//# sourceMappingURL=note-trainer-directive-compiled.js.map
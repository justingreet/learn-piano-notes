"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

noteTrainerModule.directive('noteTrainer', function () {
  var SPACE_BETWEEN_LINES = 50;

  var STAFF_HEIGHT = 200;
  var STAFF_WIDTH = 300;
  var NUM_STAFFS_PER_LINE = 3;
  var NUM_LINES = 2;

  var Staff = function () {
    function Staff(top, left, noteNum, ctx) {
      _classCallCheck(this, Staff);

      this.top = top;
      this.left = left;
      this.noteNum = noteNum;
      this.ctx = ctx;
    }

    _createClass(Staff, [{
      key: "noteDetected",
      value: function noteDetected(detectedNote) {}
    }, {
      key: "enter",
      value: function enter() {}
    }, {
      key: "exit",
      value: function exit() {}
    }, {
      key: "draw",
      value: function draw() {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.left + STAFF_WIDTH, this.top);
        ctx.lineTo(this.left + STAFF_WIDTH, this.top + STAFF_HEIGHT);
        ctx.lineTo(this.left, this.top + STAFF_HEIGHT);
        ctx.lineTo(this.left, this.top);
        ctx.stroke();
      }
    }]);

    return Staff;
  }();

  var Line = function () {
    function Line(top, ctx) {
      _classCallCheck(this, Line);

      var maxNote = 50;
      var minNote = 20;

      this.ctx = ctx;

      this.staffs = [];
      for (var i = 0; i < NUM_STAFFS_PER_LINE; i++) {
        var noteNum = Math.random() * (maxNote - minNote) + minNote;
        this.staffs.push(new Staff(top, i * STAFF_WIDTH, noteNum, this.ctx));
      }
    }

    _createClass(Line, [{
      key: "enter",
      value: function enter() {}
    }, {
      key: "exit",
      value: function exit() {}
    }, {
      key: "noteDetected",
      value: function noteDetected() {}
    }, {
      key: "draw",
      value: function draw() {
        this.staffs.forEach(function (staff) {
          return staff.draw();
        });
      }
    }]);

    return Line;
  }();

  var NoteTrainerController = function () {
    function NoteTrainerController() {
      var _this = this;

      _classCallCheck(this, NoteTrainerController);

      this.canvasWidth = NUM_STAFFS_PER_LINE * STAFF_WIDTH;
      this.canvasHeight = NUM_LINES * STAFF_HEIGHT + (NUM_LINES - 1) * SPACE_BETWEEN_LINES;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.lines = [];
      for (var i = 0; i < NUM_LINES; i++) {
        this.lines.push(new Line(i * STAFF_HEIGHT + i * SPACE_BETWEEN_LINES, this.ctx));
      }

      //this.draw();
      window.setTimeout(function () {
        return _this.draw();
      }, 10);
    }

    _createClass(NoteTrainerController, [{
      key: "start",
      value: function start() {}
    }, {
      key: "pause",
      value: function pause() {}
    }, {
      key: "draw",
      value: function draw() {
        this.lines.forEach(function (line) {
          return line.draw();
        });
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
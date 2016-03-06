noteTrainerModule.directive('noteTrainer', function () {
  const REFRESH_TIME = 40;

  const SPACE_BETWEEN_LINES = 50;

  const STAFF_HEIGHT = 200;
  const STAFF_WIDTH = 300;
  const NUM_STAFFS_PER_LINE = 3;
  const NUM_LINES = 3;

  var timePerStaff = 2000;

  class Staff {
    constructor(top, left, noteNum, ctx) {
      this.top = top;
      this.left = left;
      this.noteNum = noteNum;
      this.ctx = ctx;

      this.isActive = false;
    }

    noteDetected(detectedNote) {

    }

    enter() {
      this.isActive = true;
    }

    exit() {
      this.isActive = false;
    }

    updateTop(newTop) {
      this.top = newTop;
    }

    draw() {
      let ctx = this.ctx;

      // Draw the box.
      ctx.beginPath();
      ctx.moveTo(this.left, this.top);

      ctx.lineWidth = (this.isActive) ?
          5:
          2;

      ctx.lineTo(this.left + STAFF_WIDTH, this.top);
      ctx.lineTo(this.left + STAFF_WIDTH, this.top + STAFF_HEIGHT);
      ctx.lineTo(this.left, this.top + STAFF_HEIGHT);
      ctx.lineTo(this.left, this.top);
      ctx.stroke();

      // Draw some text.
      ctx.fillText(this.noteNum,
          this.left + (STAFF_WIDTH*.5),
          this.top+(STAFF_HEIGHT*.5));
    }
  }

  class Line {
    constructor(top, ctx, opt_left = 0) {
      const maxNote = 50;
      const minNote = 20;

      this.top = top;
      this.ctx = ctx;
      this.left = opt_left;

      this.width = STAFF_WIDTH*NUM_STAFFS_PER_LINE;

      this.isActive = false;
      this.activeStaffIndex = -1;

      this.staffs = [];
      for (let i = 0; i < NUM_STAFFS_PER_LINE; i++) {
        var noteNum = Math.round(Math.random()*(maxNote - minNote) + minNote);
        this.staffs.push(new Staff(top, i*STAFF_WIDTH,
            noteNum, this.ctx));
      }
    }

    enter() {
      this.isActive = true;
      this.activeStaffIndex = 0;
      this.staffs[0].enter();
    }

    exit() {
      this.isActive = false;
      this.staffs[this.staffs.length - 1].exit();
    }

    noteDetected() {

    }

    updateTop(newTop) {
      this.staffs.forEach(staff => {
        staff.updateTop(newTop);
      });

      this.top = newTop;
    }

    draw(progressLineX) {
      if (this.isActive) {
        let newActiveStaffIndex = Math.floor(progressLineX / STAFF_WIDTH);
        if (newActiveStaffIndex !== this.activeStaffIndex) {
          this.staffs[this.activeStaffIndex].exit();
          this.staffs[newActiveStaffIndex].enter();
          this.activeStaffIndex = newActiveStaffIndex;
        }
      }
      this.staffs.forEach(staff => staff.draw());
    }
  }

  class NoteTrainerController {
    constructor($scope, noteDetectorService) {

      $scope.$watch(() => {
        return $scope.isPlaying;
      }, newVal => {
        if (newVal) {
          this.start();
        } else {
          this.pause();
        }
      });
      this.canvasWidth = NUM_STAFFS_PER_LINE*STAFF_WIDTH;
      this.canvasHeight = NUM_LINES*STAFF_HEIGHT +
          (NUM_LINES - 1)*SPACE_BETWEEN_LINES;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.isPlaying = false;

      this.lines = [];
      for (let i = 0; i < NUM_LINES; i++) {
        this.lines.push(
            new Line(i*STAFF_HEIGHT + i*SPACE_BETWEEN_LINES, this.ctx));
      }
      this.lines[0].enter();

      this.progressLineX = 0;
      this.progressLineTime = 0;

      noteDetectorService.registerListener(this.noteDetected);

      window.setTimeout(() => this.draw(), 10);
    }

    noteDetected(detectedNote) {
      // TODO: Actually do something when a note is detected.
    }

    start() {
      this.isPlaying = true;
      this.refreshInterval =
          window.setInterval(() => this.update(), REFRESH_TIME);
    }

    pause() {
      this.isPlaying = false;
      clearInterval(this.refreshInterval);
    }

    update() {
      this.draw();

      // Update the progress line.
      let curLine = this.lines[0];

      this.progressLineTime += REFRESH_TIME;
      let percentageOfLineCovered =
          this.progressLineTime / (NUM_STAFFS_PER_LINE*timePerStaff);
      if (percentageOfLineCovered >= 1) {
        // Generate a new line.
        let lineNum = NUM_LINES - 1;
        let newLineY = lineNum * STAFF_HEIGHT + lineNum * SPACE_BETWEEN_LINES;
        let newLine = new Line(newLineY, this.ctx);

        // Remove top line.
        this.lines[0].exit();
        this.lines.splice(0, 1);

        // Move all existing lines up.
        this.lines.forEach(line => {
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

    draw() {
      let ctx = this.ctx;

      // Clear the canvas.
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Draw the sheet music.
      this.lines.forEach(line => line.draw(this.progressLineX));

      // Draw the progress line.
      let oldStrokeStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.strokeStyle = '#FF0000';
      ctx.moveTo(this.progressLineX, 0);
      ctx.lineTo(this.progressLineX, STAFF_HEIGHT);
      ctx.stroke();
      ctx.strokeStyle = oldStrokeStyle;
    }
  }

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
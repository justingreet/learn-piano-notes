noteTrainerModule.directive('noteTrainer', function () {
  const SPACE_BETWEEN_LINES = 50;

  const STAFF_HEIGHT = 200;
  const STAFF_WIDTH = 300;
  const NUM_STAFFS_PER_LINE = 3;
  const NUM_LINES = 2;

  class Staff {
    constructor(top, left, noteNum, ctx) {
      this.top = top;
      this.left = left;
      this.noteNum = noteNum;
      this.ctx = ctx;
    }

    noteDetected(detectedNote) {

    }

    enter() {

    }

    exit() {

    }

    draw() {
      let ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(this.left, this.top);
      ctx.lineTo(this.left + STAFF_WIDTH, this.top);
      ctx.lineTo(this.left + STAFF_WIDTH, this.top + STAFF_HEIGHT);
      ctx.lineTo(this.left, this.top + STAFF_HEIGHT);
      ctx.lineTo(this.left, this.top);
      ctx.stroke();
    }
  }

  class Line {
    constructor(top, ctx) {
      const maxNote = 50;
      const minNote = 20;

      this.ctx = ctx;

      this.staffs = [];
      for (let i = 0; i < NUM_STAFFS_PER_LINE; i++) {
        var noteNum = Math.random()*(maxNote - minNote) + minNote;
        this.staffs.push(new Staff(top, i*STAFF_WIDTH,
            noteNum, this.ctx));
      }
    }

    enter() {

    }

    exit() {

    }

    noteDetected() {

    }

    draw() {
      this.staffs.forEach(staff => staff.draw());
    }
  }

  class NoteTrainerController {
    constructor() {
      this.canvasWidth = NUM_STAFFS_PER_LINE*STAFF_WIDTH;
      this.canvasHeight = NUM_LINES*STAFF_HEIGHT +
          (NUM_LINES - 1)*SPACE_BETWEEN_LINES;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.lines = [];
      for (let i = 0; i < NUM_LINES; i++) {
        this.lines.push(
            new Line(i*STAFF_HEIGHT + i*SPACE_BETWEEN_LINES, this.ctx));
      }

      //this.draw();
      window.setTimeout(() => this.draw(), 10);
    }

    start() {

    }

    pause() {

    }

    draw() {
      this.lines.forEach(line => line.draw());
    }
  }

  return {
    restrict: 'E',
    scope: {
    },
    controller: NoteTrainerController,
    controllerAs: 'ctrl',
    templateUrl: 'components/note-trainer/note-trainer.html'
  };
});
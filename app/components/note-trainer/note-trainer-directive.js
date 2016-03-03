noteTrainerModule.directive('noteTrainer', function () {
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
      ctx.lineTo(this.left + Staff.WIDTH, this.top);
      ctx.lineTo(this.left + Staff.WIDTH, this.top + Staff.HEIGHT);
      ctx.lineTo(this.left, this.top + Staff.HEIGHT);
      ctx.lineTo(this.left, this.top);
      ctx.stroke();
    }
  }
  Staff.HEIGHT = 200;
  Staff.WIDTH = 300;

  class Line {
    constructor(top, ctx) {
      const maxNote = 50;
      const minNote = 20;

      this.ctx = ctx;

      this.staffs = [];
      const NUM_STAFFS = 3;
      for (let i = 0; i < NUM_STAFFS; i++) {
        var noteNum = Math.random()*(maxNote - minNote) + minNote;
        this.staffs.push(new Staff(top, i*Staff.WIDTH,
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
      this.canvasWidth = 3*Staff.WIDTH;
      this.canvasHeight = 3*Staff.HEIGHT;

      var c = document.getElementById("sheetMusic");
      this.ctx = c.getContext("2d");

      this.lines = [];
      const NUM_LINES = 2;
      for (let i = 0; i < NUM_LINES; i++) {
        this.lines.push(new Line(i*Staff.HEIGHT, this.ctx));
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
noteTrainerModule.directive('noteTrainer', function () {

  class NoteTrainerController {
    constructor() {
      this.stuff = 'hey';
    }

    sayHi() {
      alert(`${this.stuff}`);
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
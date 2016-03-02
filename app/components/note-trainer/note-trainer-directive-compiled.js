'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

noteTrainerModule.directive('noteTrainer', function () {
  var NoteTrainerController = function () {
    function NoteTrainerController() {
      _classCallCheck(this, NoteTrainerController);

      this.stuff = 'hey';
    }

    _createClass(NoteTrainerController, [{
      key: 'sayHi',
      value: function sayHi() {
        alert('' + this.stuff);
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
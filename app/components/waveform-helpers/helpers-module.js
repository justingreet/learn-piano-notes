console.log('helpers module');
angular.module('pianoPitchDetector.waveform-helpers', [
  'pianoPitchDetector.util'
])

    .service('drawWaveformService', [function() {
      var waveforms = [];

      this.addWaveform = function(buffer) {
        waveforms.push(buffer);
        var size = Math.min(buffer.length, 1000);

        var elem = document.createElement('canvas');
        elem.setAttribute('width', size.toString());
        elem.setAttribute('height', '256');

        document.body.appendChild(elem);

        var waveCanvas = elem.getContext('2d');

        waveCanvas.strokeStyle = "black";
        waveCanvas.lineWidth = 1;

        waveCanvas.clearRect(0,0,buffer.length,256);
        waveCanvas.strokeStyle = "red";
        waveCanvas.beginPath();
        waveCanvas.moveTo(0,0);
        waveCanvas.lineTo(0,256);
        waveCanvas.moveTo(.25*size,0);
        waveCanvas.lineTo(.25*size,256);
        waveCanvas.moveTo(.5*size,0);
        waveCanvas.lineTo(.5*size,256);
        waveCanvas.moveTo(.75*size,0);
        waveCanvas.lineTo(.75*size,256);
        waveCanvas.moveTo(size,0);
        waveCanvas.lineTo(size,256);
        waveCanvas.stroke();
        waveCanvas.beginPath();
        waveCanvas.moveTo(0, buffer[0]);
        for (var i=1;i<buffer.length;i++) {
          waveCanvas.lineTo(i,128+(buffer[i]*128));
        }
        waveCanvas.stroke();
      };

      this.getWaveforms = function() {
        return waveforms;
      }
    }]);
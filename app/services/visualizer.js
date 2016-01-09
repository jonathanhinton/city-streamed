app.service('visualizer', ['UserMedia', function(UserMedia){
//set up canvas for visualizer
  //IMPORTANT jquery and angular.element will not grab canvas. You must access it via the document
  var canvas = document.querySelector(".oscilloscope");
    console.log("canvas", canvas);
  var canvasCtx = canvas.getContext("2d");
    console.log("canvasCtx", canvasCtx);
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  var drawVisual;
//MODULE
  return {
    oscillate : function(){
    canvas.style.visibility = 'visible';
    UserMedia.get().then(function(stream){
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log("audioCtx", audioCtx);
      var analyser = audioCtx.createAnalyser();
        console.log("analyser", analyser);
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 1;
      var source = audioCtx.createMediaStreamSource(stream);
        console.log("source", source);
      source.connect(analyser);
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount;
        console.log("bufferLength", bufferLength);
      var dataArray = new Uint8Array(bufferLength);
        console.log("dataArray", dataArray);
      analyser.getByteTimeDomainData(dataArray);
    function draw(){
      var drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
        canvasCtx.beginPath();
      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
      for (var i = 0; i < bufferLength; i++){
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;
        if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
        x += sliceWidth;
        }
      canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      } //end draw function
      return draw();
    }); //end then(callback)
    }, //end oscillate function
    stopOscillate : function(){
      canvas.style.visibility = 'hidden';
    }
  };  //end return statement
}]);

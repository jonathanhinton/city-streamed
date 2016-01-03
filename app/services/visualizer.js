app.service('visualizer', [function(){
//Set up canvas
  var canvas = angular.element(document.querySelector("#visualizer"));
    console.log("canvas", canvas);
  var canvasCtx = canvas[0].getContext('2D');
    console.log("canvasCtx", canvasCtx);
  var intendedWidth = angular.element(document.querySelector('.wrapper')).clientWidth;
  canvas[0].setAttribute('width', intendedWidth);

//Set up audio context
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("audioCtx", audioCtx);
  var analyser = audioCtx.createAnalyser();
    console.log("analyser", analyser);
  var source = audioCtx.createMediaStreamSource(stream);
    console.log("source", source);
  source.connect(analyser);
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
    console.log("bufferLength", bufferLength);
  var dataArray = new Uint8Array(bufferLength);
    console.log("dataArray", dataArray);
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  function draw(){
    var drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
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
    canvasCtx.lineTo(canvas[0].width, canvas[0].height/2);
      canvasCtx.stroke();
    };

    //return get function as object
    return {
      draw:draw
    };
}]);

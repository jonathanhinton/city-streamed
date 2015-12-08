$(document).ready(function(){
  console.log("Hello");
  var mediaConstraints = {
    audio: true
  };

  navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

  function onMediaSuccess(stream) {
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'audio/ogg';
    mediaRecorder.audioChannels = 2;
    mediaRecorder.ondataavailable = function (blob) {
      var blobURL = URL.createObjectURL(blob);
      $("#output").append('<a href="' + blobURL + '">' + blobURL + '</a>');
    };
    mediaRecorder.start(5000);

    $("#stopRecording").on('click', function(){
      mediaRecorder.stop();
      console.log("Recording Stopped");
    });

    $("#pauseRecording").on('click', function(){
      mediaRecorder.pause();
    });

    $("#resumeRecording").on('click', function(){
      mediaRecorder.resume();
    });

    $("#saveRecording").on('click', function(){
      mediaRecorder.save();
    });

  }


  function onMediaError(e) {
    console.log("Media Error", e);
  }

});
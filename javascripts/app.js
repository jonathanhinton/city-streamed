$(document).ready(function(){
  console.log("Hello");

$("#record").on('click', function(){

    var mediaConstraints = {
      audio: true
    };

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    function onMediaSuccess(stream) {
      var mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/ogg';
      mediaRecorder.audioChannels = 1;
      mediaRecorder.ondataavailable = function (blob) {
        console.log("blob", blob);
        var blobURL = URL.createObjectURL(blob);
        $("#output").append('<audio preload="auto" src="' + blobURL + '" controls=""></audio>');
      };
      mediaRecorder.start(5000);

      $("#stopRecording").on('click', function(){
        mediaRecorder.stop();
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

});

$(document).ready(function(){
  console.log("Hello");

  //set media constraints for audio only
    var mediaConstraints = {
      audio: true
    };

  //gain access to user microphone (note: only works with https)
    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

  //if successfull this function will fire
    function onMediaSuccess(stream) {

    //create mediaStreamRecorder object
      var mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/ogg';
      mediaRecorder.audioChannels = 1;
      mediaRecorder.ondataavailable = function (blob) {
        console.log("blob", blob);
        var arrayBuffer;
        var testBase64;
        var fileReader = new FileReader();
        fileReader.onload = function () {
          var dataUrl =  fileReader.result;
          testBase64 = dataUrl.split(",")[1];
          console.log("testBase64", testBase64);
        };
        fileReader.readAsDataURL(blob);

        var blobURL = URL.createObjectURL(blob);
        var blobArray = fileReader.readAsArrayBuffer(blob);
        console.log("blobArray", blobArray);
        console.log("blobURL", blobURL);
        $("#output").append('<audio preload="auto" src="' + blobURL + '" controls=""></audio>');
      };

      $("#record").on('click', function(){
        mediaRecorder.start(5000);

        $("#stopRecording").on('click', function(){
          mediaRecorder.stop();
          console.log("mediaRecorder.blobs", mediaRecorder.blobs);
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
      });

    }


    function onMediaError(e) {
      console.log("Media Error", e);
    }
  });


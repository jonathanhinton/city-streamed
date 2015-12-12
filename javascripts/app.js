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

    //when data is available, ability to record will be granted
      mediaRecorder.ondataavailable = function (blob) {
        console.log("blob", blob);

        //declare variables to test conversion to base64
        var testBase64;

        //construct new fileReader object
        var fileReader = new FileReader();
        fileReader.onload = function () {

          //declare dataURL variable from fileReader
          var dataUrl =  fileReader.result;
          testBase64 = dataUrl.split(",")[1];
          console.log("testBase64", testBase64);
          //POST base64 to firebase
          $.ajax({
            url: "https://city-streamed.firebaseio.com/audio.json",
            method: "POST",
            data: JSON.stringify(testBase64)
            }).done(function(testBase64) {
              console.log("Your new recording is ", testBase64);
            });
          return testBase64;
        };

        fileReader.readAsDataURL(blob);

      //creates cached preview to listen to recording in browser
        var blobURL = URL.createObjectURL(blob);
        console.log("blobURL", blobURL);
        $("#output").append('<audio preload="auto" src="' + blobURL + '" controls=""></audio>');
      };

      $("#record").on('click', function(){
        mediaRecorder.start(15000);

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
      });

    }


    function onMediaError(e) {
      console.log("Media Error", e);
    }

    function retrieveAudio(){
      $.ajax({
        url : "https://city-streamed.firebaseio.com/audio/-K5LwaOllHJVmVQzXOzC.json"
      }).done(function(data){
        console.log("You've got data", data);
        var binary = atob(data);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }
        var blob = new Blob([view]);
        console.log("blob", blob);
        var blobURL = URL.createObjectURL(blob);
        $("#output").append('<audio preload="auto" src="' + blobURL + '" controls=""></audio>');
      });
    }

    $("#retrieveAudio").on('click', function(){
      console.log("click");
      retrieveAudio();
    });

  });


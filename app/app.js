var app = angular.module('cityStreamed', ['Authorize', 'firebase', 'ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial']);

  app.config([
    '$routeProvider',
      function($routeProvider){
        $routeProvider
        .when('/', {
          templateUrl: '/partials/login.html',
          controller: 'authUserCtrl'
        })
        .when('/profile', {
          templateUrl: '/partials/profile.html',
          controller: 'profileCtrl as ProfileCtrl'
        });
      }
    ]
  );

  app.controller('profileCtrl',
    ['Auth',
    '$firebaseArray',
    '$location',
    function(Auth, $currentInfo, $location){
      var authData = Auth.$getAuth();
      var ref = new Firebase('https://city-streamed.firebaseio.com/users/' + authData.uid);
      var audioRef = new Firebase('https://city-streamed.firebaseio.com/audio');
      this.audios = $currentInfo(audioRef);
      this.info = $currentInfo(ref);
      console.log("this info", this.info);
      console.log("this.audio", this.audios);

      this.recordAudio = function(){
      //set media constraints for audio only
        var mediaConstraints = {
          audio: true
        };

      //gain access to user microphone (note: only works with https)
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

      //if no errors in getUserMedia() this function will fire
        function onMediaSuccess(stream) {

        //create mediaStreamRecorder object
          var mediaRecorder = new MediaStreamRecorder(stream);
          mediaRecorder.mimeType = 'audio/ogg';
          mediaRecorder.audioChannels = 1;

        //when data is available, on stop() we see the blob!
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
              // $.ajax({
              //   url: "https://city-streamed.firebaseio.com/audio.json",
              //   method: "POST",
              //   data: JSON.stringify(testBase64)
              //   }).done(function(testBase64) {
              //     console.log("Your new recording is ", testBase64);
              //   });
              return testBase64;
            };

            fileReader.readAsDataURL(blob);

          //creates cached preview to listen to recording in browser
            var blobURL = URL.createObjectURL(blob);
            console.log("blobURL", blobURL);
          //   $("#output").append('<audio preload="auto" src="' + blobURL + '" controls=""></audio>');
          // };
      };
    }
    };
  }
    ]);
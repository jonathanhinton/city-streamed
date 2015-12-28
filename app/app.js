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
    '$sce',
    'UserMedia',
    function(Auth, $currentInfo, $location, $sce, UserMedia){
      var authData = Auth.$getAuth();
      var ref = new Firebase('https://city-streamed.firebaseio.com/users/' + authData.uid);
      var audioRef = new Firebase('https://city-streamed.firebaseio.com/audio');
      this.audios = $currentInfo(audioRef);
      this.info = $currentInfo(ref);
      console.log("this info", this.info);
      console.log("this.audio", this.audios);

      //get user media from UserMedia service
      UserMedia.get().then(function(stream){
        //declare new MediaStreamRecorder object
        this.mediaRecorder = new MediaStreamRecorder(stream);
        //set mimeType to Audio
        this.mediaRecorder.mimeType = 'audio/ogg';
        //set number of channels to 1
        this.mediaRecorder.audioChannels = 1;

        this.mediaRecorder.ondataavailable = function(blob){
          console.log("blob", blob);
          var base64String;
          var fileReader = new FileReader();
          fileReader.onload = function(){
            var dataUrl = fileReader.result;
            base64String = dataUrl.split(",")[1];
            console.log("base64String", base64String);
            return base64String;
          };

          fileReader.readAsDataURL(blob);
          var blobURL = URL.createObjectURL(blob);
          console.log("blobURL", blobURL);
        };
        console.log("mediaRecorder", this.mediaRecorder);
        console.log("start audio recording", stream);
        window.stream = stream;
        this.audioStream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
        console.log("this.audioStream", this.audioStream);
      }); //end .then()

      this.startRecording = function(){
        mediaRecorder.start(15000);
      };

      this.stopRecording = function(){
        mediaRecorder.stop();
      };

    }
  ]);
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

      this.recordAudio = function(){
        //get user media from UserMedia service
        UserMedia.get().then(function(stream){
          //declare new MediaStreamRecorder object
          var mediaRecorder = new MediaStreamRecorder(stream);
          //set mimeType to Audio
          mediaRecorder.mimeType = 'audio/ogg';
          //set number of channels to 1
          mediaRecorder.audioChannels = 1;
          console.log("mediaRecorder", mediaRecorder);
          console.log("start audio recording", stream);
          window.stream = stream;
          this.audioStream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
          console.log("this.audioStream", this.audioStream);
        }) //end .then()
      }; //end this.recordAudio()


    }
  ]);
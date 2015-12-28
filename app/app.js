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
          console.log("start audio recording", stream);
          window.stream = stream;
          if (window.URL) {
            console.log("using window.URL");
            //Begin Stream
            this.audioStream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
          } else {
            this.audioStream = $sce.trustAsResourceUrl(stream);
          } // end else statement
        }) //end .then()
      }; //end this.recordAudio()


    }
  ]);
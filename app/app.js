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
    '$routeParams',
    'UserMedia',
    function(Auth, $currentInfo, $location, $sce, $routeParams, UserMedia){
      var authData = Auth.$getAuth();
      var ref = new Firebase('https://city-streamed.firebaseio.com/users/' + authData.uid);
      var audioRef = new Firebase('https://city-streamed.firebaseio.com/audio');
      var base64String = null;
      this.base64String = base64String;
      this.transmissions = $currentInfo(audioRef);

      this.selectedTransmission = {};
      this.transmissionId = $routeParams.transmissionId;
      this.transmissions.$loaded()
      .then(function(){
        this.selectedTransmission = this.transmissions.$getRecord(this.transmissionId);
        console.log("this.selectedTransmission", this.selectedTransmission);
      }.bind(this))
      .catch(function(error){
        console.log("error", error);
      });

      this.info = $currentInfo(ref);
      console.log("this info", this.info);
      console.log("this.transmissions", this.transmissions);
      this.newTransmission = {};

      //get user media from UserMedia service
      UserMedia.get().then(function(stream){
        //declare new MediaStreamRecorder object
        this.mediaRecorder = new MediaStreamRecorder(stream);
        //set mimeType to Audio
        this.mediaRecorder.mimeType = 'audio/ogg';
        //set number of channels to 1
        this.mediaRecorder.audioChannels = 1;

        //augment ondataavailable function for mediaStreamRecorder
        this.mediaRecorder.ondataavailable = function(blob){
          console.log("blob", blob);
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
      }); //end .then()

      this.startRecording = function(){
        mediaRecorder.start(15000);
      };

      this.stopRecording = function(){
        mediaRecorder.stop();
      };

      this.postString = function(){
        this.transmissions.$add({
          title : this.newTransmission.title,
          dataString : base64String,
          userName : this.info[0].userName,
          datePosted : Date.now()
        });
        console.log("new Transmission", this.transmissions);
      };

      this.playTransmission = function(transmission){
        console.log("transmissionID", transmission.$id);
        var id = transmission.$id;
        var data = transmission.dataString;
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
        console.log("blobURL", blobURL);
        var audioEl = angular.element(document.querySelector('#' + id));
        audioEl.append('<audio autoplay preload="auto" src="' + blobURL + '"></audio>');
      };

    }
  ]);
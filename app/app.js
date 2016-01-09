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
    '$mdDialog',
    '$mdMedia',
    'countdown',
    'visualizer',
    function(Auth, $currentInfo, $location, $sce, $routeParams, UserMedia, $mdDialog, $mdMedia, countdown, visualizer){
      SC.initialize({
        client_id: '5c9d9495ad00839c28558426b440b05a'
      });
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
//WEB AUDIO API SETUP
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

//MEDIA RECORDER CONTROL FUNCTIONS

  //start recording max 15 seconds
      this.startRecording = function(){
        mediaRecorder.start(15000);
        countdown.startTimer();
        visualizer.oscillate();
      };

  //stop recording
      this.stopRecording = function(){
        mediaRecorder.stop();
        countdown.resetTimer();
        visualizer.stopOscillate();
        this.nextTab();
      };

  //post string to firebase after conversion to base64
      this.postString = function(){
        this.transmissions.$add({
          title : this.newTransmission.title,
          dataString : base64String,
          userName : this.info[0].userName,
          datePosted : Date.now(),
          image : this.info[0].image
        });
        console.log("new Transmission", this.transmissions);
        this.nextTab();
      };

  //playback control converting from base64 back to blobURL
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
//DIALOG CONTROL FUNCTIONS
  //dialog tab advance
      this.maxTab = 2;
      this.selectedIndex = 0;
      this.nextTab = function(){
        var index = (this.selectedIndex == this.max) ? 0 : this.selectedIndex + 1;
        this.selectedIndex = index;
      };
    }
  ]);
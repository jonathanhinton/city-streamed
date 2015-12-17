$(document).ready(function(){
  console.log("Hello");

  SC.initialize({
    client_id: '5c9d9495ad00839c28558426b440b05a'
  });

  OAuth.initialize('n2jZCZtPE01zQ0LbcOThbm12o9Y');

  var ref = new Firebase("https://city-streamed.firebaseio.com");
  $("#launchModal").on('click', function(){
    $("#loginModal").modal('show');
  });

  $("#githubAuth").on('click', function(){
    ref.authWithOAuthPopup("github", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        var ref = new Firebase("city-streamed.firebaseio.com/users/" + authData.uid + "/userinfo");
        ref.set({
          email : userEmail,
          userName : authData.github.displayName,
          uid : authData.auth.uid,
          image : authData.github.profileImageURL
        });
        console.log("Authenticated successfully with payload:", authData);
      }
    });
    $("#loginModal").modal("hide");
  });

  $("#createUser").on('click', function(){
    var newUserEmail = $("#userEmail").val();
    var userName = $("#userName").val();
    var userPassword = $("#userPassword").val();
    ref.createUser({
      email : newUserEmail,
      password : userPassword
    }, function(error, userData){
      if (error) {
        console.log("error creating account", error);
      } else {
        console.log("successfully created user account", userData.uid);
        var ref = new Firebase("https://city-streamed.firebaseio.com/users/"+ userData.uid + "/userinfo");
        ref.set({
          userName : userName,
          userEmail : newUserEmail,
          audio : []
        });
      }
    }
    );
    $("#loginModal").modal("hide");
  });

  $("#logout").on('click', function(){
    ref.unauth();
    console.log("you're logged out");
  });


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

    //temporary countdown provided by http://jsfiddle.net/mrwilk/qVuHW/
      function countdown( elementName, minutes, seconds )
        {
            var element, endTime, hours, mins, msLeft, time;

            function twoDigits( n )
            {
                return (n <= 9 ? "0" + n : n);
            }

            function updateTimer()
            {
                msLeft = endTime - (+new Date());
                if ( msLeft < 1000 ) {
                    element.innerHTML = "countdown's over!";
                } else {
                    time = new Date( msLeft );
                    hours = time.getUTCHours();
                    mins = time.getUTCMinutes();
                    element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
                    setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
                }
            }

            element = document.getElementById( elementName );
            endTime = (+new Date()) + 1000 * (60*minutes + seconds) + 500;
            updateTimer();
        }

    //MOUSEDOWN begins transmission
      $("#transmit").mousedown(function(){
        mediaRecorder.start(15000);

          countdown( "countdown", 0, 15 );
      //MOUSEUP ends transmission
        $("#transmit").mouseup(function(){
          mediaRecorder.stop();
          countdown("countdown", 0, 0);
        });
      });

    }


    function onMediaError(e) {
      console.log("Media Error", e);
    }

  //retrieve audio function using basic ajax call to firebase
    function receiveAudio(){
      setInterval(function(){
        $.ajax({
          url : "https://city-streamed.firebaseio.com/audio/-K5LwaOllHJVmVQzXOzC.json"
      //callback for converting data from base64 back to blob
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
        //append blobURL to DOM for playback
          $("#output").html('<audio autoplay preload="auto" src="' + blobURL + '" controls></audio>');
        });
      }, 5000);
    }

  //functionality for retrieve audio button
    $("#receiveAudio").on('click', function(){
      console.log("click");
      receiveAudio();
    });

  });
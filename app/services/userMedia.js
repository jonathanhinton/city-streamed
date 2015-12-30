app.service('UserMedia', ['$q', function($q){
  //define getUserMedia and allow for different browser access
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //set media constraints to audio only
    var mediaConstraints = {
      audio: true,
      video: false
    };

    //declare get function
    var get = function(){
      //declare deferred promise
      var deferred = $q.defer();
      navigator.getUserMedia(mediaConstraints, function(stream){
        deferred.resolve(stream);
      }, function errorCallback(error){
        console.log("navigator.getUserMedia error: ", error);
        deferred.reject(error);
      } //end error
        );
      return deferred.promise;
    };
    //return get function as object
    return {
      get:get
    };
}]);

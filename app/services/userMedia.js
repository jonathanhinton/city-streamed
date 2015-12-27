app.service('UserMedia', ['$q', function($q){

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var mediaConstraints = {
      audio: true,
      video: false
    };

    var deferred = $q.defer();

    var get = function(){
      navigator.getUserMedia(mediaConstraints, function(stream){
        deferred.resolve(stream);
      }, function errorCallback(error){
        console.log("navigator.getUserMedia error: ", error);
        deferred.reject(error);
      }
        );
      return deferred.promise;
    }
    return {
      get:get
    }
}]);

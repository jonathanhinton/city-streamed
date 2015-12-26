var auth = angular.module('Authorize', ['firebase']);

  var name;
  auth.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth){
      var ref = new Firebase('https://city-streamed.firebaseio.com');
      return $firebaseAuth(ref);
    }
  ]);

  app.controller('authUserCtrl',
    ['$scope',
    'Auth',
    '$firebaseArray',
    '$location',
    function($scope, Auth, $firebaseArray, $location){
      $scope.createUser = function(){
        Auth.$createUser({
          email : $scope.email,
          password : $scope.password
        }).then(function(userData){
          var ref = new Firebase('https://city-streamed.firebaseio.com/users/' + userData.uid + '/userinfo');
          ref.set({
            email: $scope.email,
            userName: $scope.name,
            uid: userData.uid
          });
          console.log("user created with user id:", userData.uid);
          $scope.loginUser();
        }).catch(function(error){
          console.log("User not created with error", error);
        });
      };
      $scope.loginUser = function(){
        Auth.$authWithPassword({
          email : $scope.email,
          password : $scope.password
        }).then(function(userData){
          console.log("user logged in with id:", userData.uid);
          $location.path("/profile");
        }).catch(function(error){
          console.log("user not logged in with error", error);
        });
      };
      $scope.githubLogin = function(){
        Auth.$authWithOAuthPopup('github').then(function(userData){
          console.log("user logged in with id:", userData.uid);
          var ref = new Firebase('https://city-streamed.firebaseio.com/users/' + userData.uid + '/userinfo');
          ref.set({
            email : userData.github.email,
            userName : userData.github.displayName,
            uid : userData.auth.uid,
            image : userData.github.profileImageURL
          });
          $location.path('/profile');
        }).catch(function(error){
          console.log("user not logged in with error", error);
        });
      };
      $scope.logout = function(){
        Auth.$unauth();
        console.log("user logged out");
        $location.path('/');
      };
    }]);
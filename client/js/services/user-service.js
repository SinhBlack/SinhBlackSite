angular.module('app').factory("userService", ['$http', '$location', '$timeout', function($http, $location, $timeout){

    var storage = sessionStorage;
    var isAuth = false;

    var post = function(postPath, data, pathRedirect){
        return $http.post(postPath, data).success(function(res){

            storage.token = res.token;

            $timeout(function(){
                $location.path(pathRedirect);
            }, 1000);

        });
    };

    return{
          "setAuth" : function(_isAuth){
              isAuth = _isAuth;
          },
          "setStorage" : function(_storage){
              storage = _storage;
          },
          "isAuthenticate" : function(){
              if (sessionStorage.token || localStorage.token)
                  isAuth = true;
              else
                  isAuth = false;
              return isAuth;
          },
          "logOut" : function(path){
              delete sessionStorage.token;
              delete localStorage.token;
              $http.get('/logout').success(function(res){
                  $location.path(path);
              });
          },

          "signIn" : post,
          "signUp" : post
    }
}]);
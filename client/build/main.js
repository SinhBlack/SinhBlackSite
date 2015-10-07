var app = angular.module('app', [
    'ui.router'
]);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');
    console.log("ssssssss");
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/home.html",
            controller: "HomeCtrl"
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "partials/signup.html",
            controller: "SignupCtrl"
        })
        .state('signin', {
            url: "/signin",
            templateUrl: "partials/signin.html",
            controller: "SigninCtrl"
        })
        .state('profile', {
            url: "/profile",
            templateUrl: "views/profile.html",
            controller: "ProfileCtrl"
        })
        .state('forgot', {
            url: "/forgot",
            templateUrl: "views/forgot.html",
            controller: "ForgotCtrl"
        })
        .state('reset', {
            url: "/reset/:token",
            templateUrl: "views/reset.html",
            controller: "ResetCtrl"
        });

        $httpProvider.interceptors.push(['$q', '$location',
            function($q, $location){
                return {
                    'request': function(config){
                        config.headers = config.headers || {};
                        if (sessionStorage.token || localStorage.token){
                            config.headers.Authorization = sessionStorage.token || localStorage.token;
                        }
                        return config;
                    },
                    'responseError': function(res){
                        if(res.status === 401 || res.status === 403){
                            $location.path('/signin');
                        }
                        return $q.reject(res);
                    }
                }

            }]);
}]);

angular.module('app').
    controller('ProfileCtrl', ['$scope', '$http', 'userService', function($scope, $http, userService){

        $http.get('/api/profile').success(function(res){
            userService.isAuthenticate = function(){return true;};
            $scope.userData = res;
        });

    }]).
    controller('SignupCtrl', function($scope, $location, userService){
        $scope.signup = function(){
            var formData = $scope.userData;
            userService.signUp('/auth/signup', formData, '/profile')
                .error(function(res){$scope.err = res.message;});
        };
    }).
    controller('SigninCtrl', function($scope, $location, userService){

        $scope.rememberMe = function(){
            if($scope.r){
                userService.setStorage(localStorage);
            }else{
                userService.setStorage(sessionStorage);
            }
        };

        $scope.signin = function(){
            var formData = $scope.userData;
            userService.signIn('/auth/signin', formData, '/profile')
                .error(function(res){$scope.err = res.message;});
        };
    }).
    controller('NavCtrl', function(userService, $scope){

    }).
    controller('HomeCtrl', function(userService, $http, $location){
        if(userService.isAuthenticate())
            $location.path('/profile');
        $http.get('/auth/isAuth').success(function(res){
            if(res.isAuth === true)
                $location.path('/profile');
        });
    }).
    controller('ForgotCtrl', ['$http', '$scope', '$location', function($http, $scope, $location){
        $scope.sendMail = function(){
            var email = {
                email: $scope.email
            };
            $http.post('/api/forgot', email).success(function(res){
               $scope.message = "An email has send to your email account pls check your email before it expires!";
            }).error(function(res){
                $scope.message = res.message;
            });
        }
    }]).
    controller('ResetCtrl', ['$http', '$scope','$stateParams', function($http, $scope, $stateParams){
        $scope.resetPassword = function(){
            var password = {
                password: $scope.password
            };

            $http.post('/reset/' + $stateParams.token, password).success(function(res){
                $scope.message = res.message;
            }).error(function(res){
                $scope.message = res.message;
            });
        }
    }]);

angular.module("app")
    .directive('compareTo', function(){
        return {
            require: 'ngModel',
            restrict : 'A',
            scope : {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attrs, ngModel){
                ngModel.$validators.compareTo = function(modelValue) {
                    var isMatch = modelValue === scope.otherModelValue;
                    if(isMatch){
                        ngModel.$setValidity("passwordVerify", true);
                        return true;
                    }else{
                        ngModel.$setValidity("passwordVerify", false);
                        return false;
                    }
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        }
    });

angular.module('app')
    .directive('sbNav', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/directives/sb-nav.html',
            controller: function(userService, $scope){
                $scope.isOn = false;

                $scope.toggleMenu = function(){
                    $scope.isOn = !$scope.isOn;
                };

                $scope.turnOffMenu = function(){
                    $scope.isOn = false;
                };

                $scope.isAuth = function(){
                    return userService.isAuthenticate();
                };

                $scope.logOut = function(){
                    $scope.toggleMenu();
                    userService.isAuthenticate = function(){return false;};
                    userService.logOut('/');
                }
            },
            link: function(scope, element, attrs){

            }
        }
    });

angular.module('app')
    .directive('toggleClass', function(){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(){
                    element.toggleClass(attrs.toggleClass);
                });
            }
        }
    });

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
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

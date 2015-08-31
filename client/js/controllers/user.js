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

    });

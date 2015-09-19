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

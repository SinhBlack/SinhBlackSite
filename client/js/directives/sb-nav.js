angular.module('app')
    .directive('sbNav', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/directives/sb-nav.html',
            controller: function(userService, $scope){
                $scope.tog = true;

                $scope.toggleMenu = function(){
                    $scope.tog = !$scope.tog;
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

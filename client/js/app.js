var app = angular.module('app', [
    'ui.router'
]);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

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

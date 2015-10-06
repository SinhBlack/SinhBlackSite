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

angular.module("smiled.application").directive("historicalDatePicker",[ function(){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	date: "="
        },
        link: function(scope,element,attr){
        	scope.$watch('date', function(newValue,oldValue){
        		newValue.formatted=newValue.day+"/"+newValue.month+"/"+newValue.year;
        	},true);
        }
    };
}]);
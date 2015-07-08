angular.module("smiled.application").directive("historicalDatePicker",[ function(){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	year: "=",
        	month: "=",
        	day: "=",
//        	hour: "=",
//        	minute: "=",
        	afterChrist: "="
        }
	};
}]);
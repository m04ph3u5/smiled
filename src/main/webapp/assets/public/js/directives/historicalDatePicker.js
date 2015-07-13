angular.module("smiled.application").directive("historicalDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	date: "="
        },
        controller : function (){
        	
        },
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope,element,attr){
        	
        	scope.$watch('vm.date', function(newValue,oldValue){
        		if(newValue.year && newValue.month && newValue.day){
        			var era;
        			if(newValue.afterChrist)
        				era="D.C.";
        			else
        				era="A.C.";
        			
        			newValue.formatted=newValue.day+" "+CONSTANTS.monthString(newValue.month)+" "+newValue.year+" "+era;
        		}
        	},true);
        }
    };
}]);
angular.module("smiled.application").directive("historicalDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	date: "="
        },
        controller : function (){
        	var self = this;
        	self.months = CONSTANTS.getMonths("it");
        	self.getDays = function(){
            	self.days = CONSTANTS.getDays(self.date.month);
        	}
        	if(self.date && self.date.month){
	        	self.days = CONSTANTS.getDays(self.date.month);
        	}else{
        		self.days = CONSTANTS.getDays(1);
        	}
        },
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope,element,attr){
        	
        	scope.$watch('vm.date', function(newValue,oldValue){
        		if(newValue && newValue.year && newValue.month && newValue.day){
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
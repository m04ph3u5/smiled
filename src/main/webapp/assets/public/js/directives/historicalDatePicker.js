angular.module("smiled.application").directive("historicalDatePicker",[ function(){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	date: "="
        },
        link: function(scope,element,attr){
        	var monthString = function(month){
        		var m;
        		switch(month){
        			case '1': {
        				m = "gennaio";
        				break;
        			}
        			case '2': {
        				m = "febbraio";
        				break;
        			}
        			case '3': {
        				m = "marzo";
        				break;
        			}
        			case '4': {
        				m = "aprile";
        				break;
        			}
        			case '5': {
        				m = "maggio";
        				break;
        			}
        			case '6': {
        				m = "giugno";
        				break;
        			}
        			case '7': {
        				m = "luglio";
        				break;
        			}
        			case '8': {
        				m = "agosto";
        				break;
        			}
        			case '9': {
        				m = "settembre";
        				break;
        			}
        			case '10': {
        				m = "ottobre";
        				break;
        			}
        			case '11': {
        				m = "novembre";
        				break;
        			}case '12': {
        				m = "dicembre";
        				break;
        			}
        		}
        		console.log("m vale: "+ m);
        		return m;
        	}
        	scope.$watch('date', function(newValue,oldValue){
        		if(newValue.year && newValue.month && newValue.day){
        			var era;
        			if(newValue.afterChrist)
        				era="D.C.";
        			else
        				era="A.C.";
        			
        			newValue.formatted=newValue.day+" "+monthString(newValue.month)+" "+newValue.year+" "+era;
        		}
        	},true);
        }
    };
}]);
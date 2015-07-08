angular.module('smiled.application').controller('dialogSetDateCtrl', ['modalService','alertingGeneric', '$state', 's', 'start',
       
                                                                  function dialogSetDateCtrl(modalService, alertingGeneric, $state, s, start){
	
	var self = this;
	self.scenario = {};

	self.scenario.startDate = {};
	self.scenario.endDate = {};
	self.scenario.startDate.afterChrist = true;
	self.scenario.endDate.afterChrist = true;

	self.newStartDate = {};
	self.newStartDate.year = "1000";
	self.newStartDate.month = "2";
	self.newStartDate.day = "10";
	self.newStartDate.afterChrist = true;
	
	self.changeStartDate = function(){
		console.log("changeeeeeeeee start");
	}
	self.changeEndDate = function(){
		console.log("changeeeeeeeee end");
	}
	
	
	console.log(s);
	console.log(start);
	
	var checkDate = function(date){
		// regular expression to match required date format
//		   var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
//
//
//	    if(date != '' && !date.match(re)) {
//	      return false;
//	    }
//	    else
	    	return true;
	    
	    
	}
	
	
}]);
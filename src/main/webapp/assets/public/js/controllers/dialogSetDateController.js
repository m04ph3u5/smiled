angular.module('smiled.application').controller('dialogSetDateCtrl', ['modalService','alertingGeneric', '$state', 'scen', 'start', 'CONSTANTS',
       
function dialogSetDateCtrl(modalService, alertingGeneric, $state, scen, start, CONSTANTS){
	
	var self = this;
	
	self.start = start;
	self.newDate = {};

	
	if(start==true){
		//modifico la data di inizio
		self.newDate = scen.history.startDate;
		console.log(self.newDate);
		
	}else{
		//modifico la data di fine
		self.newDate = scen.history.endDate;		
		console.log(self.newDate);
	}
	
	
	self.closeModal = function(){
		modalService.closeModalSetDate();
	}
	
	self.months = CONSTANTS.getMonths("it");
	self.days = CONSTANTS.getDays(self.newDate.month);
	self.getDays = function(){
		self.days = CONSTANTS.getDays(self.newDate.month);
	}
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
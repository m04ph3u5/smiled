angular.module('smiled.application').controller('scenariosListCtrl', 
		['loggedUser', 'CONSTANTS', 'modalService', 
		 function scenariosListCtrl(loggedUser,CONSTANTS,modalService){
	
	var self = this;
	self.user = loggedUser;
	
	self.realDateWithHour = CONSTANTS.realDateFormatWithHour;
	self.realDateWithoutHour = CONSTANTS.realDateFormatWithoutHour;
	
	console.log(self.realDateWithHour);
	console.log(self.realDateWithoutHour);
	
	self.showPopUpCreationScenario = function (){
		modalService.showModalCreateScen();
	};
}]);
angular.module('smiled.application').controller('scenariosListCtrl', ['loggedUser', 'CONSTANTS', function scenariosListCtrl(loggedUser,CONSTANTS){
	
	var self = this;
	self.user = loggedUser;
	
	self.realDateWithHour = CONSTANTS.realDateFormatWithHour;
	self.realDateWithoutHour = CONSTANTS.realDateFormatWithoutHour;
	
	console.log(self.realDateWithHour);
	console.log(self.realDateWithoutHour);
}]);
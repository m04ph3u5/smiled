angular.module('smiled.application').controller('studentsListCtrl', ['loggedUser', function studentsListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
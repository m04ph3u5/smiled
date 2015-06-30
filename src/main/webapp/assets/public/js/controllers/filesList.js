angular.module('smiled.application').controller('colleaguesListCtrl', ['loggedUser', function studentsListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
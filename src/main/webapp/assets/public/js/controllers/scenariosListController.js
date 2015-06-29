angular.module('smiled.application').controller('scenariosListCtrl', ['loggedUser', function scenariosListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
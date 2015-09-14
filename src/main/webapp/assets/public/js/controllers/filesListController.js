angular.module('smiled.application').controller('filesListCtrl', ['loggedUser', function filesListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
angular.module('smiled.application').controller('colleaguesListCtrl', ['loggedUser', function colleaguesListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
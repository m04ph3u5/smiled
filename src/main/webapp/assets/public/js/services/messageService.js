angular.module('smiled.application').factory('messageService', [ '$q',
               function messageService($q){
	var messages = [];
	
	
	var newMessage = function(m){
		m.read=false;
		messages.push(m);
	}
	
	
	return {
		newMessage : newMessage
	};
}]);

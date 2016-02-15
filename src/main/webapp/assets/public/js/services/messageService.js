angular.module('smiled.application').factory('messageService', [ '$q',
               function messageService($q){
	var messages = [];
	console.log("message service!");
	
	var newMessage = function(m){
		m.read=false;
		messages.push(m);
	}
	
	
	return {
		newMessage : newMessage
	};
}]);

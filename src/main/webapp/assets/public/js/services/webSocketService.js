angular.module('smiled.application').factory('webSocketService', [ '$timeout','messageService', 'notifyService',
               function webSocketService($timeout, messageService, notifyService){

	var service = {};
	
	var socket = {};
	var reconnectAttempt=0;
	
	 service.RECONNECT_TIMEOUT = 30000;
	 service.SOCKET_URL = "https://localhost:8443/websocket/messages";
	 //service.CHAT_TOPIC = "/topic/message";
	 //service.CHAT_BROKER = "/app/chat";
	 
	var reconnect = function() {
	      $timeout(function() {
	        retry();
	      }, service.RECONNECT_TIMEOUT);  //aggiungere un meccanismo di backoff esponenziale per la riconnessione
	};
	
	var retry = function(){
		console.log("Try to reconnect. Attempt number "+reconnectAttempt);
		reconnectAttempt+1;
		initialize();
	}
	
	var initialize = function() {
		socket = new SockJS(service.SOCKET_URL);
		console.log('open ws connection on webSocketService');
		
		socket.onmessage = function(e) {
	 	
	 	    var msg = JSON.parse(e.data);
	 	   reconnectAttempt=0;
	 	    if(msg.type=="NOTIFICATION"){
	 	    	
	 	    	notifyService.newNotify(msg);
	 	    }else{
	 	    	console.log("message is a message");
	 	    	//messageService.newMessage(e.data);
	 	    }
		};
		
		socket.onclose = function() {
	 	    console.log('close ws connection on webSocketService');
	 	    reconnect();
	 	};
	};
	 
	
	
	initialize();
	
	return {};

}]);

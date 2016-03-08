angular.module('smiled.application').factory('webSocketService', [ '$timeout','messageService', 'notifyService',
               function webSocketService($timeout, messageService, notifyService){

	var service = {};
	
	var socket = {};
	var exp=0;
	
	service.RECONNECT_TIMEOUT = 1000;
	service.START_AFTER_TIME_TO_SETUP=700;
	service.SOCKET_URL = "/websocket/messages";
	//service.CHAT_TOPIC = "/topic/message";
	//service.CHAT_BROKER = "/app/chat";
	 
	var getTimeout = function(){
		var base;
		if(exp!=0)
			base=exp*service.RECONNECT_TIMEOUT;
		else
			base=service.RECONNECT_TIMEOUT;
		
		return base+(Math.random()*1000);
	}
	
	var resetTimeout = function(){
		console.log("ON OPEN!!!!!!!!");
		exp=0;
	}
	
	//Data usually are ACK_N, VIEW_N, ACK_M, VIEW_M, or USER_MESSAGE 
	var send = function(data){
		socket.send(JSON.stringify(data));
	}

	 
	var reconnect = function() {
	      $timeout(function() {
	        retry();
	      }, getTimeout());  //aggiungere un meccanismo di backoff esponenziale per la riconnessione
	};
	
	var retry = function(){
		if(exp==0)
			exp=1;
		else if(exp<256)
			exp=exp*2;
		initialize();
	}
	
	var initialize = function() {
		socket = new SockJS(service.SOCKET_URL);
		console.log(socket);

		console.log('open ws connection on webSocketService');
		
		socket.onopen = function(){
			resetTimeout();
		}
		
		socket.onmessage = function(e) {
	 	   	var msg = JSON.parse(e.data);
	 	    if(msg.type=="NOTIFICATION"){ 	    	
	 	    	notifyService.newNotifyOrPost(msg);
	 	    }else{
	 	    	console.log("message is a message");
	 	    }
		};
		
		socket.onclose = function() {
	 	    console.log('close ws connection on webSocketService');
	 	    reconnect();
	 	};
	};
	 
	initialize();
	
	
//	$timeout(function() {
//		initialize();
//      }, service.START_AFTER_TIME_TO_SETUP);
//	
	
	return {
		send : send
	};

}]);

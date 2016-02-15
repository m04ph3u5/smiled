angular.module('smiled.application').factory('notifyService', [ '$q',
               function notifyService($q){

	var notifications = [];
	console.log("notify service!");
	
	var newNotify = function(n){
		n.read = false;
		notifications.push(n);
		console.log("NEW NOTIFY: ")
		console.log(n);
		console.log("Notifications list of notifyService:");
		console.log(notifications);
		notifyNotificationsObservers();
	}
	
	//restituisce solo le notifiche non lette (read==false)
	var readNewNotifications = function(){
		var newNotifications = [];
		for(var i=0; i < notifications.length; i++){
			var n = notifications[i];
			if(n.read==false){
				newNotifications.push(angular.copy(n));
				n.read=true;
			}
		}
		return newNotifications;
	}
	
	//restituisce le ultime notifiche che il service ha in memoria
	var readNotifications = function(){
		var count=0;
		var notifications = [];
		for(n in notifications){
			newNotifications.push(angular.copy(n));
			n.read=true;
			count++;			
		}
	}
	
	var readOldNotifications = function(){
		//questo metodo si occuperà di richiedere al server le notifiche già lette che non ha in memoria
	}
	
	var observerNotificationsCallbacks = [];
	
	//register an observer
	var registerObserverNotifications = function(callback){
		observerNotificationsCallbacks.push(callback);
	};
	  
	//call this when you know 'foo' has been changed
	var notifyNotificationsObservers = function(){
		angular.forEach(observerNotificationsCallbacks, function(callback){
			callback();
		});
	};
	
	return {
		newNotify : newNotify,
		readNewNotifications : readNewNotifications,
		readNotifications : readNotifications,
		registerObserverNotifications: registerObserverNotifications,
		notifyNotificationsObservers: notifyNotificationsObservers
	};

}]);

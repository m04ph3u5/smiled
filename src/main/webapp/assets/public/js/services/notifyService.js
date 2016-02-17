angular.module('smiled.application').factory('notifyService', [ '$q',
               function notifyService($q){

	var notifications = [];
	
	
	var newNotify = function(n){
		n.read = false;
		notifications.splice(0, 0, n);
		
		notifyNotificationsObservers();
	}
	
	//restituisce tutte le notifiche non lette che il service ha in memoria (read==false)
	var readNewNotifications = function(){
		var newNotifications = [];
		for(var i=0; i < notifications.length; i++){
			if(notifications[i].read==false){
				newNotifications.push(angular.copy(notifications[i]));
				notifications[i].read=true;
			}
		}
		console.log("notify service----->");
		console.log(newNotifications);
		return newNotifications;
	}
	
	//restituisce tutte le notifiche che il service ha in memoria
	var readNotifications = function(){
		var allNotificationInService = [];
		for(var i=0; i<notifications.length; i++){
			allNotificationInService.push(angular.copy(notifications[i]));
			n.read=true;			
		}
		return allNotificationInService;
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

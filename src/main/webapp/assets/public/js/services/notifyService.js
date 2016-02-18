angular.module('smiled.application').factory('notifyService', [ '$q','$cookies',
               function notifyService($q, $cookies){

	var notifications = [];
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
	
	var newNotifyOrPost = function(n){
		if(n.sender!=me){
			if(n.verb=="NEW_POST"){
				newPosts.unshift(n.objectId);
				notifyNewPostObservers();
			}else{
				n.read = false;
				notifications.splice(0, 0, n);
				
				notifyNotificationsObservers();
			}
		}
		//else --> non fare niente perchè è una notifica generata da me
		
	}
	var getAllNewPosts = function(){
		var nP = angular.copy(newPosts);
		newPosts = [];
		return nP;
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
	var observerNewPostCallbacks = [];
	
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
	
	//register an observer
	var registerObserverNewPost = function(callback){
		observerNewPostCallbacks.push(callback);
	};
	  
	//call this when you know 'foo' has been changed
	var notifyNewPostObservers = function(){
		angular.forEach(observerNewPostCallbacks, function(callback){
			callback();
		});
	};
	
	return {
		newNotifyOrPost : newNotifyOrPost,
		readNewNotifications : readNewNotifications,
		readNotifications : readNotifications,
		registerObserverNotifications: registerObserverNotifications,
		notifyNotificationsObservers: notifyNotificationsObservers,
		registerObserverNewPost: registerObserverNewPost,
		notifyNewPostObservers: notifyNewPostObservers,
		getAllNewPosts : getAllNewPosts
	};

}]);

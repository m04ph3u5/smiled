angular.module('smiled.application').factory('notifyService', [ '$q','$cookies',
               function notifyService($q, $cookies){

	var notifications = [];
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
	var updPosts = [];
	
	var newNotifyOrPost = function(n){
		
		if(n.sender!=me){
			if(n.verb=="NEW_POST"){
				console.log("nuovo post");
				newPosts.unshift(n.objectId);
				notifyNewPostObservers(newPosts.length);
			}else if(n.verb=="UPD_POST"){
				console.log("cambiamento generico in un post");
				updPosts.unshift(n.objectId);
				notifyUpdPostObservers();
			}
			else{
				console.log("nuova notifica");
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
		console.log("tutte le notifiche non lette che il service ha in memoria----->");
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
		console.log("tutte le notifiche che il service ha in memoria----->");
		console.log(allNotificationInService);
		return allNotificationInService;
	}
	
	var readOldNotifications = function(){
		//questo metodo si occuperà di richiedere al server le notifiche già lette che non ha in memoria
	}
	
	var observerNotificationsCallbacks = [];
	var observerNewPostCallbacks = [];
	var observerReloadListOfPost = [];
	var observerReloadAssociationCallbacks = [];
    var observerUpdPostCallbacks = [];
	
	//register an observer
	var registerObserverNotifications = function(callback){
		observerNotificationsCallbacks.push(callback);
	};
	
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
	var notifyNewPostObservers = function(n){
		angular.forEach(observerNewPostCallbacks, function(callback){
			callback(n);
		});
	};
	
	var notifyReloadAssociationObservers = function(n){
		angular.forEach(observerReloadAssociationCallbacks, function(callback){
			callback(n);
		});
	};
	
	//register an observer
	var registerObserverReloadList = function(callback){
		
		observerReloadListOfPost.push(callback);
	}
	
	//register an observer
	var registerObserverAssociation = function(callback){
		
		observerReloadAssociationCallbacks.push(callback);
	}
	var registerObserverUpdPost = function(callback){
		observerUpdPostCallbacks.push(callback);
	}
	
	var notifyReloadListObservers = function(){ //do a scenarioPostController la lista di nuovi post da scaricarsi
		angular.forEach(observerReloadListOfPost, function(callback){
			
			callback(angular.copy(newPosts)); 
		});
	}
	var notifyUpdPostObservers = function(){
		angular.forEach(observerReloadListOfPost, function(callback){
			
			callback(angular.copy(updPosts)); 
		});
	}
	var reloadList = function(){
		
		notifyReloadListObservers(); 
		newPosts = [];
	}
	
	var reloadAssociation = function(){
		notifyReloadAssociationObservers();
	}
	
	return {
		newNotifyOrPost : newNotifyOrPost,
		readNewNotifications : readNewNotifications,
		readNotifications : readNotifications,
		registerObserverNotifications: registerObserverNotifications,
		notifyNotificationsObservers: notifyNotificationsObservers,
		registerObserverNewPost: registerObserverNewPost,
		notifyNewPostObservers: notifyNewPostObservers,
		getAllNewPosts : getAllNewPosts,
		registerObserverReloadList : registerObserverReloadList,
		notifyReloadListObservers : notifyReloadListObservers,
		reloadList : reloadList,
		reloadAssociation : reloadAssociation,
		registerObserverAssociation : registerObserverAssociation,
		notifyUpdPostObservers: notifyUpdPostObservers,
		registerObserverUpdPost : registerObserverUpdPost
		
	};

}]);

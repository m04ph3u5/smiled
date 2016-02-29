angular.module('smiled.application').factory('notifyService', [ '$q','$cookies','$rootScope',
               function notifyService($q, $cookies, $rootScope){

	
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
	var updPosts = [];
    var actualScenarioId="";
    var actualNotify={};
    var observerReloadListOfPost = {};
	var observerReloadAssociationCallbacks = {};
    var observerUpdPostCallbacks = {};
    var sendAckNCallback = {};

    var setActualScenarioId = function(id){
    	actualScenarioId=id;		
    }
        
	var resetActualScenarioId = function(){
		actualScenarioId="";		
	}
	
	var newNotifyOrPost = function(n){
		
		if(n.sender!=me){
			
			if(n.verb=="NEW_POST"){
				if(n.scenarioId==actualScenarioId){
					console.log("nuovo post");
					newPosts.unshift(n.objectId);
					$rootScope.$broadcast('notification.newPostEvent');
				}
			}else if(n.verb=="UPD_POST"){
				if(n.scenarioId==actualScenarioId){
					console.log("cambiamento generico in un post");
					updPosts.unshift(n.objectId);
					notifyUpdPostObservers();
				}
			}
			else{
				console.log("nuova notifica");
				$rootScope.$broadcast('notification.newNotificationEvent', {notification: n});
				
			}
		}
		//else --> non fare niente perchè è una notifica generata da me
		
	}
	var getAllNewPosts = function(){
		var nP = angular.copy(newPosts);
		newPosts = [];
		return nP;
	}
	
	
	var readOldNotifications = function(){
		//questo metodo si occuperà di richiedere al server le notifiche già lette che non ha in memoria
	}
	
	


	
	var notifyReloadAssociationObservers = function(n){
		if(observerReloadAssociationCallbacks)
			observerReloadAssociationCallbacks(n);
	};
	
	//register an observer
	var registerObserverReloadList = function(callback){
		
		observerReloadListOfPost = callback;
	}
	var resetObserverReloadList = function(){
		observerReloadListOfPost={};
	}
	
	//register an observer
	var registerObserverAssociation = function(callback){
		observerReloadAssociationCallbacks = callback;
	}
	var resetObserverAssociation = function(){
		observerReloadAssociationCallbacks={};
	}
	
	
	var registerObserverUpdPost = function(callback, scenarioId){
		actualScenarioId = scenarioId;
		observerUpdPostCallbacks = callback;
	}
	
	var notifyReloadListObservers = function(){ //do a scenarioPostController la lista di nuovi post da scaricarsi
		if(observerReloadListOfPost)
			observerReloadListOfPost(newPosts);
	}
	
	var notifyUpdPostObservers = function(){
		if(observerUpdPostCallbacks)
			observerUpdPostCallbacks(angular.copy(updPosts)); 
	}
	
	var reloadList = function(){
		
		notifyReloadListObservers(); 
		newPosts = [];
	}
	
	var reloadAssociation = function(){
		notifyReloadAssociationObservers();
	}
	
	var sendAckN = function(ack){
		sendAckNCallback(ack);
	}
	
	var registerWebSocketSendAckN = function(callback){
		sendAckNCallback = callback;
	}
	
	return {
		newNotifyOrPost : newNotifyOrPost,
		getAllNewPosts : getAllNewPosts,
		registerObserverReloadList : registerObserverReloadList,
		resetObserverReloadList : resetObserverReloadList,
		notifyReloadListObservers : notifyReloadListObservers,
		reloadList : reloadList,
		reloadAssociation : reloadAssociation,
		registerObserverAssociation : registerObserverAssociation,
		resetObserverAssociation : resetObserverAssociation,
		notifyUpdPostObservers: notifyUpdPostObservers,
		registerObserverUpdPost : registerObserverUpdPost,
		setActualScenarioId : setActualScenarioId,
		resetActualScenarioId : resetActualScenarioId,
		sendAckN : sendAckN,
		registerWebSocketSendAckN : registerWebSocketSendAckN
	};

}]);

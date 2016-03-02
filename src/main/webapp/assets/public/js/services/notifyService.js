angular.module('smiled.application').factory('notifyService', [ '$q','$cookies','$rootScope', 'apiService',
               function notifyService($q, $cookies, $rootScope, apiService){

	
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
    var actualScenarioId="";
    var actualNotify={};
    var observerReloadListOfPost = {};
	var observerReloadAssociationCallbacks = {};
   
    var sendAckNCallback = {};

    var setActualScenarioId = function(id){
    	actualScenarioId=id;		
    }
        
	var resetActualScenarioId = function(){
		actualScenarioId="";		
	}
	
	var newNotifyOrPost = function(n){
		
		if(n.sender!=me){
			console.log("new notification !!!!!!!!!!");
			console.log(n);
			if(n.verb=="NEW_POST"){
				if(n.scenarioId==actualScenarioId){
					newPosts.unshift(n.objectId);
					$rootScope.$broadcast('notification.newPostEvent');
				}
			}else if(n.verb=="UPD_POST"){
				if(n.scenarioId==actualScenarioId){
					$rootScope.$broadcast('notification.updPostEvent',{id:n.objectId});
				}
			}
			else{
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
	
	
	var readOldNotifications = function(older, num){
		return apiService.getLastUserNotifications(older, num);
	}
	
	


	
//	var notifyReloadAssociationObservers = function(n){
//		if(observerReloadAssociationCallbacks)
//			observerReloadAssociationCallbacks(n);
//	};
	
	//register an observer
	var registerObserverReloadList = function(callback){
		
		observerReloadListOfPost = callback;
	}
	var resetObserverReloadList = function(){
		observerReloadListOfPost=null;
	}
	
	//register an observer
	var registerObserverAssociation = function(callback){
		observerReloadAssociationCallbacks = callback;
	}
	var resetObserverAssociation = function(){
		observerReloadAssociationCallbacks=null;
	}
	
	
	var notifyReloadListObservers = function(){ //do a scenarioPostController la lista di nuovi post da scaricarsi
		if(observerReloadListOfPost)
			observerReloadListOfPost(newPosts);
	}
	

	
	var reloadList = function(){
		
		notifyReloadListObservers(); 
		newPosts = [];
	}
	
	var reloadAssociation = function(){
		if(observerReloadAssociationCallbacks){
			observerReloadAssociationCallbacks();
		}
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
		setActualScenarioId : setActualScenarioId,
		resetActualScenarioId : resetActualScenarioId,
		readOldNotifications : readOldNotifications
	};

}]);

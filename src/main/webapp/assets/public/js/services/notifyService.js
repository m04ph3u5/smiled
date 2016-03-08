angular.module('smiled.application').factory('notifyService', [ '$q','$cookies','$rootScope', 'apiService',
               function notifyService($q, $cookies, $rootScope, apiService){

	
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
    var actualScenarioId="";
    var actualNotify={};
    var observerReloadListOfPost = {};
	var observerReloadAssociationCallbacks = {};
   
    var sendAckNCallback = {};
    
    var inEditPost = [];
    var toReload = [];
    var setActualScenarioId = function(id){
    	actualScenarioId=id;		
    }
        
	var resetActualScenarioId = function(){
		actualScenarioId="";	
		inEditPost = [];
		toReload = [];
	}
	
	var newNotifyOrPost = function(n){
		
		if(n.sender!=me){
			
			if(n.verb=="NEW_POST"){
				if(n.scenarioId==actualScenarioId){
					newPosts.unshift(n.objectId);
					$rootScope.$broadcast('notification.newPostEvent');
				}
			}else if(n.verb=="UPD_POST"){
				if(n.scenarioId==actualScenarioId && !isInEditPost(n.objectId)){
					$rootScope.$broadcast('notification.updPostEvent',{id:n.objectId});
				}else{
					toReload.push(n.objectId);
					$rootScope.$broadcast('notification.generateAlertUpd',{id:n.objectId});
				}
			}else if(n.verb=="UPD_NEW_COMMENT"){
				if(n.scenarioId==actualScenarioId){
					$rootScope.$broadcast('notification.updNewComment',{notification : n});
				}
			}else if(n.verb=="UPD_NEW_META"){
				if(n.scenarioId==actualScenarioId){
					$rootScope.$broadcast('notification.updNewMetaComment',{notification : n});
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
	
	var addToInEditPost = function(idPost){
		if(inEditPost.indexOf(idPost)<0)
			inEditPost.push(idPost);
	}
	
	var removeToInEditPost = function(idPost){
		var i = inEditPost.indexOf(idPost);
		if(i>=0){
			inEditPost.splice(i,1);
			var j = toReload.indexOf(idPost);
			if(j>=0){
				$rootScope.$broadcast('notification.updPostEvent',{id:idPost});
				toReload.splice(j,1);
			}
		}
	}
	
	var isInEditPost = function (idPost){
		if(inEditPost.indexOf(idPost)<0)
			return false;
		else
			return true;
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
		readOldNotifications : readOldNotifications,
		addToInEditPost : addToInEditPost,
		removeToInEditPost : removeToInEditPost,
		isInEditPost : isInEditPost
	};

}]);

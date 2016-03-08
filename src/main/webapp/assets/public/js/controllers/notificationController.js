angular.module('smiled.application').controller('notificationCtrl', ['$rootScope', '$stateParams','$state', 'userService', 'apiService','CONSTANTS', '$timeout','webSocketService',
              function characterProfileCtrl($rootScope, $stateParams, $state, userService, apiService, CONSTANTS, $timeout, webSocketService){
	
	var self = this;
	self.notifications = [];
	self.dateFormat = CONSTANTS.realDateFormatWithMinute;
	self.user = {};
	self.user.id="";
	self.basicCover = {};
	self.busy=false;
	var stopScroll=false;
	
	self.user = userService.getLastMe();
	
	var getMoreRecentNotifications = function(){
		apiService.getLastUserNotifications("", 10).then(		
				function(data){
					if(data.length==0){
						stopScroll=true;
					}else{
						formatVerb(data);
						self.notifications=data;
					}
					self.busy=false;
				},
				function(reason){
					console.log("problem in getLastUserNotifications");
				
					self.busy=false;
				}
			);
	}
	
	
	var downloadMoreNotifications = function(){
		apiService.getLastUserNotifications(self.notifications[self.notifications.length-1].id, 10).then(		
				function(data){
					if(data.length==0){
						stopScroll=true;
					}else{
						formatVerb(data);
						self.notifications = self.notifications.concat(data);
					}
					self.busy=false;
				},
				function(reason){
					console.log(reason);
					self.busy=false;
				}
			);
	}
	
	self.nextNotification = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
		if(self.notifications.length==0){
			getMoreRecentNotifications();
		}else{
			downloadMoreNotifications();
		}
	}
	
	var onStartup = function(){
		
		getMoreRecentNotifications();

	}
	
	onStartup();
	
	/* Utility -------------------- */
	
	self.clickOnNotify = function(n){
		
		$rootScope.$broadcast("notification.setViewedEvent", {id:n.id});
		n.viewed=true;
		var view={};
		view.ids = [];
		view.ids.push(n.id);
		view.type="VIEW_N";
		$timeout(webSocketService.send(view),1000);
		if(n.verb=="MODIFIED" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="LIKE_TO_POST" || n.verb=="TAG_ON_CREATE" || n.verb=="TAG_ON_MOD"){
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": n.objectId});
		}else if(n.verb=="COMMENT_TO_POST" || n.verb=="METACOMMENT_TO_POST"){
			var idPost = n.objectId.substring(0, n.objectId.indexOf("/"));
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": idPost});
		}else if(n.verb=="NEW_PERSONAL_MISSION" || n.verb=="NEW_GLOBAL_MISSION"){
			$state.go('logged.scenario.missions', {"id":n.scenarioId });
		}else if(n.verb=="NEW_ASSOCIATION" || n.verb=="DEL_ASSOCIATION" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb =="NEW_MOD_TOCREATOR" || n.verb=="NEW_MOD"){
			$state.go('logged.scenario.characters', {"id":n.scenarioId });
		}else if(n.verb=="NEW_FILE"){
			$state.go('logged.scenario.resources', {"id":n.scenarioId });
		}else if(n.verb=="DEL_MOD" || n.verb=="DEL_ATTENDEE"){
			$state.go('logged.dashboard');
		}
		
	}
	
	self.getSrcPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return CONSTANTS.urlScenarioCover(n.scenarioId);
			}else if(n.verb=="METACOMMENT_TO_POST" || n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="DEL_MOD" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				return CONSTANTS.urlUserCover(n.actorId);
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}else{
					return "assets/public/img/narr.png";
				}
			}
			else{
				if(n.verb=="TAG_ON_CREATE" ||n.verb=="TAG_ON_MOD" ){
					if(n.actorId){
						return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
					}else{
						return "assets/public/img/narr.png";
					}
				}else{
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}
				
				
			}
		}else if(n.type=="USER_MESSAGE"){
			console.log("message!!!!!!!!!!!!");
		}
		
		return "assets/public/img/icon/pg.png";
	}
	
	self.getErrPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return "assets/public/img/icon/ic_scen.png";
			}
			else if(n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="MODIFIED_POST_BY_MOD"|| n.verb=="DEL_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				
				return "assets/public/img/ic_teacher.png";
			}else if(n.verb=="METACOMMENT_TO_POST"){
				return "assets/public/img/ic_student.png";
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return "assets/public/img/icon/pg.png";
				}else{
					return "assets/public/img/narr.png";
				}
			}else{
				return "assets/public/img/icon/pg.png";
			}
		}else if(n.type=="USER_MESSAGE"){
			return "assets/public/img/ic_student.png";
		}
	}
	
	var formatVerb = function(notifications){
		
		if(notifications!=null && notifications.length>0){
			
			
				for(var i=0; i<notifications.length; i++){
					if(notifications[i].verb == "COMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha commentato un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha commentato un post che segui";
					}
					else if(notifications[i].verb == "LIKE_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = "A "+notifications[i].actorName +" piace un tuo post";
						else
							notifications[i].text = "A "+notifications[i].actorName +" piace un post in cui sei taggato";
					}
					else if(notifications[i].verb == "TAG_ON_CREATE"){
						notifications[i].text = notifications[i].actorName +" ti ha taggato in un post";
					}
					else if(notifications[i].verb == "TAG_ON_MOD"){
						if(notifications[i].tagged){
							var stringTags="";
							for(var j=0;j<notifications[i].tagged.length; j++){
								if(j<notifications[i].tagged.length-2){
									stringTags+=notifications[i].tagged[j].firstname + ", ";
								}else{
									if(j<notifications[i].tagged.length-1)
										stringTags+=notifications[i].tagged[j].firstname +" e ";
									else
										stringTags+=notifications[i].tagged[j].firstname;
								}
								
							}
								notifications[i].text = notifications[i].actorName +" ha taggato "+ stringTags+" in un post";
						}
						
					}
					else if(notifications[i].verb == "METACOMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un post che segui";
					}
					else if(notifications[i].verb == "NEW_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Ti e' stato assegnato il personaggio "+ notifications[i].actorName;
							
						}else
							notifications[i].text = "Il personaggio "+ notifications[i].actorName+" e' stato assegnato a "+notifications[i].objectContent;
					}
					else if(notifications[i].verb == "DEL_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Non stai piu' interpretando il personaggio "+ notifications[i].actorName;
										
						}else
							notifications[i].text = notifications[i].objectContent+" non sta piu' interpretando il personaggio "+ notifications[i].actorName;
					}
					else if(notifications[i].verb == "OPEN_SCENARIO"){
						notifications[i].text = "Entra nel nuovo scenario "+ notifications[i].scenarioName +" creato da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "CLOSE_SCENARIO"){
						notifications[i].text = "Lo scenario "+ notifications[i].scenarioName +" e' stato chiuso da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "MODIFIED"){
						if(self.user.id!=notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui";
					}else if(notifications[i].verb == "NEW_PERSONAL_MISSION"){
						notifications[i].text = notifications[i].actorName +", ti e' stata assegnata una nuova missione";
					}
					else if(notifications[i].verb == "NEW_GLOBAL_MISSION"){
						notifications[i].text = notifications[i].actorName +" ha assegnato una nuova missione ai partecipanti dello scenario";
					}
					else if(notifications[i].verb == "NEW_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha aggiunto come collaboratore";
					}else if(notifications[i].verb == "NEW_FILE"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto il file "+notifications[i].objectContent+" nella sezione materiali";
					}else if(notifications[i].verb == "NEW_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha iscritto allo scenario";
					}else if(notifications[i].verb == "DEL_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario";
					}else if(notifications[i].verb == "DELETED_POST_BY_MOD"){
						notifications[i].text = notifications[i].actorName +" ha cancellato un tuo post";
					}else if(notifications[i].verb == "MODIFIED_POST_BY_MOD"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui";
					}else if(notifications[i].verb == "NEW_MOD_TO_CREATOR"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto "+notifications[i].objectContent+" come collaboratore";
					}else if(notifications[i].verb == "DEL_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario ";
					}else{
						notifications[i].text="Nuova notifica!";
					}
					//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				}
		}
				
	}

}]);
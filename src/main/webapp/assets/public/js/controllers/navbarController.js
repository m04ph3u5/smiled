angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 'CONSTANTS', '$scope','webSocketService', 'notifyService', '$timeout',
                                                              function navbarCtrl(userService,$state, CONSTANTS, $scope, webSocketService, notifyService, $timeout){
	
 /*  WebSocketService viene iniettato affiché lo stessa venga istanziato e quindi inizializzato per aprire la connessione websocket.
  */	
	var self = this;
	console.log("NAVBAR LOGGED CONTROLLER");
	self.newNotifications = [];
	self.oldNotifications = [];
	self.numNewNotifications=0;
	self.user = {};
	self.basicCover = {};
	
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	self.iHaveDone = false;
	var openNotifications = false;
	
	userService.getMe().then(		
		function(data){
			self.user=data;
			if(self.user.role.authority=="ROLE_TEACHER" || self.user.role.authority=="ROLE_ADMIN"){
				self.basicCover=CONSTANTS.basicTeacherCover;
			}
			else if(self.user.role.authority=="ROLE_USER"){
				self.basicCover=CONSTANTS.basicStudentCover;				
			}
			
		},
		function(reason){
			console.log(reason);
		}
	);
	
	var updateCover = function(){
		var date = new Date();
		self.cover = CONSTANTS.urlMeCover+"?"+date.toString();
	}
	
	var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
	                  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
	
	var getNewNotification = function(n){
		
		n.read=false;
		self.newNotifications.splice(0,0,n);	
		self.numNewNotifications=self.newNotifications.length;

		formatVerb(self.newNotifications);
		
		
	}
	
	var formatVerb = function(notifications){
		
		if(notifications!=null && notifications.length>0){
			var scenarioId = userService.getScenarioId();
			var reloadAssociation = false;
			
				for(var i=0; i<notifications.length; i++){
					if(notifications[i].verb == "COMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha commentato un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha commentato un post che segui nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "LIKE_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = "A "+notifications[i].actorName +" piace un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = "A "+notifications[i].actorName +" piace un post in cui sei taggato nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "TAG_ON_CREATE"){
						notifications[i].text = notifications[i].actorName +" ti ha taggato in un post nello scenario "+notifications[i].scenarioName;
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
								notifications[i].text = notifications[i].actorName +" ha taggato "+ stringTags+" in un post nello scenario "+notifications[i].scenarioName;
						}
						
					}
					else if(notifications[i].verb == "METACOMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un post che segui nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Ti e' stato assegnato il personaggio "+ notifications[i].actorName+" nello scenario "+notifications[i].scenarioName;
							if(scenarioId == notifications[i].scenarioId)
								reloadAssociation=true;
						}else
							notifications[i].text = "Il personaggio "+ notifications[i].actorName+" e' stato assegnato a "+notifications[i].objectContent+ " nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "DEL_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Non stai piu' interpretando il personaggio "+ notifications[i].actorName+" nello scenario "+notifications[i].scenarioName;
							if(scenarioId == notifications[i].scenarioId)
								reloadAssociation=true;					
						}else
							notifications[i].text = notifications[i].objectContent+" non sta piu' interpretando il personaggio "+ notifications[i].actorName+ "nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "OPEN_SCENARIO"){
						notifications[i].text = "Entra nel nuovo scenario "+ notifications[i].scenarioName +" creato da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "CLOSE_SCENARIO"){
						notifications[i].text = "Lo scenario "+ notifications[i].scenarioName +" e' stato chiuso da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "MODIFIED"){
						if(self.user.id!=notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_PERSONAL_MISSION"){
						notifications[i].text = notifications[i].actorName +", ti e' stata assegnata una nuova missione nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_GLOBAL_MISSION"){
						notifications[i].text = notifications[i].actorName +" ha assegnato una nuova missione ai partecipanti dello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha aggiunto come collaboratore nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_FILE"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto il file "+notifications[i].objectContent+" nella sezione materiali dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha iscritto allo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DELETED_POST_BY_MOD"){
						notifications[i].text = notifications[i].actorName +" ha cancellato un tuo post nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "MODIFIED_POST_BY_MOD"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_MOD_TO_CREATOR"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto "+notifications[i].objectContent+" come collaboratore dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario "+notifications[i].scenarioName;
					}else{
						notifications[i].text="Nuova notifica!";
					}
					//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				}
		}
		if(reloadAssociation){
			
			notifyService.reloadAssociation();
		}
		
		
	}
	
	var formatDate = function(notifications){
		
		if(notifications!=null && notifications.length>0){
			var actual = new Date();
			for(var i=0; i<notifications.length; i++){
	
				var timeString="";
				var diff = actual-notifications[i].date;
				diff = Math.round(diff/1000);
				if(diff<=1)
					timeString="un secondo fa";
				else if(diff<60)
					timeString = diff+" secondi fa";
				else if(diff>=60){
					diff = Math.round(diff/60);
					if(diff<=1)
						timeString = "un minuto fa";
					else if(diff<60)
						timeString = diff+" minuti fa";
					else if(diff>=60){
						var dd = new Date(notifications[i].date);
						diff= Math.round(diff/60);
						if(diff<=1)
							timeString = "circa un'ora fa";
						else if(diff<24)
							timeString =diff+" ore fa";
						else if(diff<48)
							timeString = "Ieri alle "+dd.getHours()+" "+dd.getMinutes();
						else if(diff>=48) 
							timeString = dd.getDate()+" "+ monthNames[dd.getMonth()] + " alle ore "+dd.getHours()+":"+dd.getMinutes();
					}
				}
				
				notifications[i].formatDate = timeString;
	
			}
			
		}
	}
	
	var closeDropDown = function(){
		if(self.newNotifications && self.newNotifications.length>0){
			var ack={};
			ack.ids = [];
			ack.type="ACK_N";
			for(var i=self.newNotifications.length-1; i>=0; i--){
				self.oldNotifications.splice(0,0,angular.copy(self.newNotifications[i]));
				ack.ids.push(angular.copy(self.newNotifications[i].id));
			}
			self.newNotifications = [];

		}
		self.numNewNotifications=0;
		openNotifications=false;
		
		if(ack && ack.ids)
			webSocketService.send(ack);
	}
	
	self.onBlurDropDown = function(){
		closeDropDown();
	}
	
	var openDropDown = function(){
		
		if(self.newNotifications.length>0)
			formatDate(self.newNotifications);
		if(self.oldNotifications.length>0)		
			formatDate(self.oldNotifications);
		
		
		openNotifications=true;	
		if(self.newNotifications.length+self.oldNotifications.length<10){
			var older="";
			var num=10;
			if(self.oldNotifications.length>0)
				older=self.oldNotifications[self.oldNotifications.length-1].id;
			else if(self.newNotifications.length>0)
				older=self.newNotifications[self.newNotifications.length-1].id;
			if(older){
				num=10-self.newNotifications.length+self.oldNotifications.length;
			}
			if(num>0)
				notifyService.readOldNotifications(older, num).then(
						function(data){
							formatDate(data);
							formatVerb(data);
							for(var i=0; data && i<data.length; i++){
								data[i].read=false;
								self.oldNotifications.push(data[i]);
							}
						},
						function(reason){
							console.log("Error retriving old notification (REST)");
							console.log(reason);
						}
				);
		}
	}
	
	self.clickOnNotificationsButton = function(){
		//se openNotifications==true significa che sto chiudendo il dropDown delle notifiche
		//se openNotifications==false significa che sto aprendo il dropDown delle notifiche
		
		if (openNotifications){ //era aperto quindi sto chiudendo
			closeDropDown();
		}else{ //era chiuso quindi sto aprendo
			openDropDown();		
		}
	}
	
	
	self.getNotificationCover = function(){
		return null;
	}
	
	
	
	self.clickOnNotify = function(n){
		
		
		if(!n.viewed){
			n.viewed=true;
			var view={};
			view.ids = [];
			view.ids.push(n.id);
			view.type="VIEW_N";
			$timeout(webSocketService.send(view),1000);
		}
		
		if(n.verb=="MODIFIED" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="LIKE_TO_POST" || n.verb=="TAG_ON_CREATE" || n.verb=="TAG_ON_MOD"){
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": n.objectId});
		}else if(n.verb=="COMMENT_TO_POST" || n.verb=="METACOMMENT_TO_POST"){
			var idPost = n.objectId.substring(0, n.objectId.indexOf("/"));
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": idPost});
		}else if(n.verb=="NEW_PERSONAL_MISSION" || n.verb=="NEW_GLOBAL_MISSION"){
			$state.go('logged.scenario.missions', {"id":n.scenarioId });
		}else if(n.verb=="NEW_ASSOCIATION" || n.verb=="DEL_ASSOCIATION" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE"){
			$state.go('logged.scenario.characters', {"id":n.scenarioId });
		}else if(n.verb =="NEW_MOD_TOCREATOR" || n.verb=="NEW_MOD"){
			$state.go('logged.scenarioWizard.info', {"id":n.scenarioId });
		}
		else if(n.verb=="NEW_FILE"){
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
	
//	var updateNotifications = function(){
//		console.log("new notifications (navbar controller)");
//		var oldNoRead = angular.copy(self.newNotifications);
//		self.newNotifications = angular.copy(notifyService.readNewNotifications()).concat(oldNoRead);	
//		console.log("New notifications: ")
//		console.log(self.newNotifications);
//		console.log("Lunghezza: ");
//		console.log(self.newNotifications.length);
//	}
	
//	self.setNotificationsToRead = function(){
//		self.oldNotifications = self.oldNotifications.concat(angular.copy(self.newNotifications));
//		self.newNotifications = [];
//		console.log("Notifiche già lette: ");
//		console.log(self.oldNotifications);
//		self.iHaveDone=true;
//	}
	

	
	
	
	
		  
//	function isLoggedUpdate(){
//		console.log("isLoggedUpdate call")
//		self.isLogged = userService.isLogged();
//		if(self.isLogged){
//			apiService.getMe().then(
//					function(data){
//						self.user=data;
//						console.log(data);
//						
//						var imageProfileUrl = baseImageProfile;
//						var random = new Date();
//						self.cover = imageProfileUrl+"?"+random.toString();
//					},
//					function(reason){
//						console.log("Something wrong");
//					}
//			);
//		}
//		console.log(userService.isLogged());
//	}
	
	function logout(){
		userService.logout().then(
				function(data){
					self.cover="";
					$state.go('notLogged.login');
				},
				function(reason){
					console.log('Errore logout');
				}
		);
	}
	
//	function updateImageProfile(){
//		var random = new Date();
//		console.log(baseImageProfile+"?"+random.toString());
//		self.cover = baseImageProfile+"?"+random.toString();
//	}
//	
	self.logout = logout;
	
	//isLoggedUpdate();
	
	updateCover();
	userService.registerObserverPersonalCover(updateCover);
	
	
	//metodo usato dall'esterno per settare a viewed la notifica con l'id specificato
	var setViewedNotifify = function(id){
		if(self.newNotifications)
			for(var i =0; i< self.newNotifications.length; i++){
				if(self.newNotifications[i].id == id){
					self.newNotifications[i].viewed = true;
					return;
				}
			}
		if(self.oldNotifications)
			for(var i =0; i< self.oldNotifications.length; i++){
				if(self.oldNotifications[i].id == id){
					self.oldNotifications[i].viewed = true;
	
				}
			}
	}
	
	var newNotificationListener = $scope.$on('notification.newNotificationEvent', function (event, data) {
		
        getNewNotification(data.notification);
        $scope.$applyAsync();
       
    })
    
    var setViewedListener = $scope.$on('notification.setViewedEvent', function (event, data) {
		
    	setViewedNotifify(data.id);
     
       
    })
  
	
	$scope.$on("$destroy", function() {
		newNotificationListener();
		setViewedListener();
        notifyService.resetObserverAssociation();
    });

}]);
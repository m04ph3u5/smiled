angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 'CONSTANTS', '$scope','webSocketService', 'notifyService',
                                                              function navbarCtrl(userService,$state, CONSTANTS, $scope, webSocketService, notifyService){
	
	
	var self = this;
	console.log("NAVBAR LOGGED CONTROLLER");
	self.newNotifications = [];
	self.oldNotifications = [];
	self.numNewNotifications=0;
	
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
		console.log("Navbar Controller  - Get new notifications from notifyService!");
	
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
					if(notifications[i].verb == "NEW_POST"){
						notifications[i].text = "Nuovo post nello scenario "+ notifications[i].scenarioName;
					}
						
					else if(notifications[i].verb == "COMMENT_TO_POST"){
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
							for(var j=0;j<notifications[i].tagged.length; ij++){
								if(j<notifications[i].tagged.length-1){
									stringTags+=notifications[i].tagged[j] + ", ";
								}else{
									stringTags+=notifications[i].tagged[j];
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
						notifications[i].text = notifications[i].actorName +" ti ha assegnato una nuova missione nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_GLOBAL_MISSION"){
						notifications[i].text = notifications[i].actorName +" ha assegnato una nuova missione globale nello scenario "+notifications[i].scenarioName;
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
					}else if(notifications[i].verb == "NEW_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha aggiunto come moderatore dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_MOD_TO_CREATOR"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto "+notifications[i].objectContent+" come moderatore dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario "+notifications[i].scenarioName;
					}else{
						notifications[i].text="Nuova notifica!";
					}
					//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				}
		}
		if(reloadAssociation){
			console.log("reload association!!!!!!!!!!!!!!");
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
						diff= Math.round(diff/60);
						if(diff<=1)
							timeString = "circa un'ora fa";
						else if(diff<24)
							timeString =diff+" ore fa";
						else if(diff<48)
							timeString = "Ieri alle "+notifications[i].date.getHours()+" "+notifications[i].getMinutes();
						else if(diff>=48) 
							timeString = notifications[i].getDate() +" "+ monthNames[notifications[i].getMonth()] + " alle ore "+notifications[i].getHours()+":"+notifications[i].getMinutes();
					}
				}
				
				notifications[i].formatDate = timeString;
	
			}
			
		}
	}
	
	var closeDropDown = function(){
		if(self.newNotifications && self.newNotifications.length>0){
			
			for(var i=self.newNotifications.length-1; i>=0; i--){
				self.oldNotifications.splice(0,0,angular.copy(self.newNotifications[i]));
			
			}
			self.newNotifications = [];

		}
		self.numNewNotifications=0;
		openNotifications=false;
	}
	
	self.onBlurDropDown = function(){
		closeDropDown();
	}
	
	var openDropDown = function(){
		if(self.newNotifications.length==0 && self.oldNotifications.length==0){
			console.log("richiedere le notifiche vecchie al server");
		}
		else{
			if(self.newNotifications.length>0)
				formatDate(self.newNotifications);
			if(self.oldNotifications.length>0){
				formatDate(self.oldNotifications);
			}
		}
		openNotifications=true;	
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
	
	var newNotificationListener = $scope.$on('notification.newNotificationEvent', function (event, data) {
		console.log("on newNotificationListener!!!!!!!");
		console.log(data.notification);
        getNewNotification(data.notification);
        $scope.$applyAsync();
       
    })
  
	$scope.$on("$destroy", function() {
        newPostListener();
        notifyService.resetObserverAssociation();
    });

}]);
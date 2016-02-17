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
	
	var getNewNotifications = function(){
		console.log("Navbar Controller  - Get new notifications from notifyService!");
	
		var n = notifyService.readNewNotifications();
		for(var i=0; i<self.newNotifications.length;i++){
			n.push(self.newNotifications[i]);
		}
			
		self.newNotifications = n;
		
		self.numNewNotifications=self.newNotifications.length;
		
		console.log("navbar controller #####");
	
		console.log(self.newNotifications);
		
	}
	
	var formatDateAndVerb = function(notifications){
		
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
				if(notifications[i].verb == "NEW_POST")
					notifications[i].text = "Nuovo post nello scenario "+ notifications[i].scenarioName;
				//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				
			}
		}
	}
	
	self.clickOnNotificationsButton = function(){
		//se openNotifications==true significa che sto chiudendo il dropDown delle notifiche
		//se openNotifications==false significa che sto aprendo il dropDown delle notifiche
		
		if (openNotifications){ //sto chiudendo
			if(self.newNotifications.length>0){
				
//				var temp = angular.copy(self.oldNotifications);
//				console.log("TEMP "+temp.length);
//				self.oldNotifications = [];
//				self.oldNotifications = angular.copy(self.newNotifications);
//				console.log("OLD "+self.oldNotifications.length);
//
//				self.oldNotifications.concat(temp);
//				console.log("TOT "+self.oldNotifications.length);
//
//				self.newNotifications=[];
				
				for(var i=self.newNotifications.length-1; i>=0; i--){
					self.oldNotifications.splice(0,0,angular.copy(self.newNotifications[i]));
					console.log(i);
				}
				self.newNotifications = [];

			}
			self.numNewNotifications=0;
		}else{ //sto aprendo
			if(self.newNotifications.length>0)
				formatDateAndVerb(self.newNotifications);
			if(self.oldNotifications.length>0)
				formatDateAndVerb(self.oldNotifications);
		}
		openNotifications=!openNotifications;
		
		
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
	
	
	
	self.calculateTime = function(d){
		console.log("---->");
		console.log(d);
//		if(d!=null && d!=0 ){
//			var actual = new Date();
//			var diff;
//			console.log("actual date:");
//			console.log(actual);
//			diff= actual-d;
//			console.log("time difference: ");
//			console.log(diff);
//			return diff;
//		}
		
	}
	
	updateCover();
	
	
	userService.registerObserverPersonalCover(updateCover);
	
	notifyService.registerObserverNotifications(getNewNotifications);
	
	
		  
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
	
	

}]);
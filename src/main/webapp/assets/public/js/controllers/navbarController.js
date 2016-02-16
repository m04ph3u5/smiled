angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 'CONSTANTS', '$scope','webSocketService', 'notifyService',
                                                              function navbarCtrl(userService,$state, CONSTANTS, $scope, webSocketService, notifyService){
	
	
	var self = this;
	console.log("NAVBAR LOGGED CONTROLLER");
	self.newNotifications = [];
	self.oldNotifications = [];
	
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	self.iHaveDone = false;
	
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
	var updateNotifications = function(){
		console.log("new notifications (navbar controller)");
		var oldNoRead = angular.copy(self.newNotifications);
		self.newNotifications = angular.copy(notifyService.readNewNotifications()).concat(oldNoRead);
		
		console.log("New notifications: ")
		console.log(self.newNotifications);
		console.log("Lunghezza: ");
		console.log(self.newNotifications.length);
	}
	
	self.setNotificationsToRead = function(){
		self.oldNotifications = self.oldNotifications.concat(angular.copy(self.newNotifications));
		self.newNotifications = [];
		console.log("Notifiche già lette: ");
		console.log(self.oldNotifications);
		self.iHaveDone=true;
	}
	
	self.showNotify = function(n){
		console.log("I am in showNotify!!");
		var text ="";
		if(n.verb=="NEW_POST")
			text+="Nuovo post nello scenario "+ n.scenarioName;
		
		return text;
	}
	
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
	
	notifyService.registerObserverNotifications(updateNotifications);
	
	
		  
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
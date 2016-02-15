angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 'CONSTANTS', '$scope','webSocketService', 'notifyService',
                                                              function navbarCtrl(userService,$state, CONSTANTS, $scope, webSocketService, notifyService){
	
	
	var self = this;
	console.log("NAVBAR LOGGED CONTROLLER");
	self.newNotifications = [];
	self.oldNotifications = [];
	
	
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
		console.log("new notifications");
		console.log(notifyService.readNewNotifications());
		self.newNotifications = self.newNotifications.concat(notifyService.readNewNotifications());
		console.log("Navbar Controller ");
		console.log("New notifications: ")
		console.log(self.newNotifications);
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
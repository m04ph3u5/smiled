angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 
                                                              function navbarCtrl(userService,$state){
	
	
	var baseImageProfile = "api/v1/me/cover";
	
	var self = this;
	userService.getMe().then(		
		function(data){
			self.user=data;
		},
		function(reason){
			console.log("------------------------>navbarCtrl");
			console.log(reason);
		}
	);
	
	
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
angular.module('smiled.application').controller('indexCtrl', [ 'userService', 'apiService', 
                                                              function indexCtrl(userService,apiService){
	userService.registerObserverLoginCallback(isLoggedUpdate);
	userService.registerObserverImageProfileCallback(updateImageProfile);
	
	var baseImageProfile = "api/v1/me/cover";
	
	var self = this;
	
	function isLoggedUpdate(){
		console.log("isLoggedUpdate call")
		self.isLogged = userService.isLogged();
		if(self.isLogged){
			apiService.getMe().then(
					function(data){
						self.user=data;
						console.log(data);
						
						var imageProfileUrl = baseImageProfile;
						var random = new Date();
						self.cover = imageProfileUrl+"?"+random.toString();
					},
					function(reason){
						console.log("Something wrong");
					}
			);
		}
		console.log(userService.isLogged());
	}
	
	function logout(){
		userService.logout();
	}
	
	function updateImageProfile(){
		var random = new Date();
		console.log(baseImageProfile+"?"+random.toString());
		self.cover = baseImageProfile+"?"+random.toString();
	}
	
	self.logout = logout;
	
	isLoggedUpdate();
	

}]);
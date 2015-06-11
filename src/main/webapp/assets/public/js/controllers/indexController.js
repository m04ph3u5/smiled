angular.module('smiled.application').controller('indexCtrl', ['$scope', 'userService', 'apiService', 
                                                              function indexCtrl($scope, userService,apiService){
	userService.registerObserverLoginCallback(isLoggedUpdate);
	userService.registerObserverImageProfileCallback(updateImageProfile);
	
	var user = {};
	var baseImageProfile = "/media/img/cover/users/";
	
	
	function isLoggedUpdate(){
		console.log("isLoggedUpdate call")
		$scope.isLogged = userService.isLogged();
		if($scope.isLogged){
			apiService.getMe().then(
					function(data){
						$scope.user=data;
						user=data;
						console.log(data);
						
						var imageProfileUrl = baseImageProfile+$scope.user.id;
						var random = new Date();
						$scope.cover = imageProfileUrl+"?"+random.toString();
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
		console.log(baseImageProfile+user.id+"?"+random.toString());
		$scope.cover = baseImageProfile+user.id+"?"+random.toString();
	}
	
	$scope.logout = logout;
	
	isLoggedUpdate();
	

}]);
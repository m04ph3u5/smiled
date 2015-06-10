angular.module('smiled.application').controller('indexCtrl', ['$scope', 'userService', 'apiService', 
                                                              function indexCtrl($scope, userService,apiService){
	
	userService.registerObserverCallback(isLoggedUpdate);
	
	function isLoggedUpdate(){
		console.log("isLoggedUpdate call")
		$scope.isLogged = userService.isLogged();
		if($scope.isLogged){
			apiService.getMe().then(
					function(data){
						$scope.user=data;
						console.log(data);
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
	
	$scope.logout = logout;
	
	isLoggedUpdate();
	

}]);
angular.module('smiled.application').controller('indexCtrl', ['$scope', 'userService', function indexCtrl($scope, userService){
	
	userService.registerObserverCallback(isLoggedUpdate);
	
	function isLoggedUpdate(){
		console.log("isLoggedUpdate call")
		$scope.isLogged = userService.isLogged();
		console.log(userService.isLogged());
	}
	
	function logout(){
		console.log("--------> LOGOUT");
	}
	
	$scope.logout = logout;
	
	isLoggedUpdate();
	

}]);
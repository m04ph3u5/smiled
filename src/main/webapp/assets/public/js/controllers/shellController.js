angular.module('smiled.application').controller('shellCtrl', ['$scope', '$location' ,'userService', '$state',
         function shellCtrl($scope, $location, userService,$state){
	
	if(!userService.isLogged){
		console.log("---------->ShellCTRL, LOGIN");
		$state.go("login");
	}else{
		console.log("---------->ShellCTRL, LOGGED");		
		switch($location.path()){
			case "/":
				$state.go("logged");
				break;
			case "/dashboard":
				$state.go("logged");
				break;
			default:
				$state.go("notFound");
		}
	}
}]);



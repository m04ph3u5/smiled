angular.module('smiled.application').controller('shellCtrl', ['$scope', '$location' ,'userService', '$state',
         function shellCtrl($scope, $location, userService,$state){
	
	if(!userService.isLogged){
		$state.go("login");
	}else{
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



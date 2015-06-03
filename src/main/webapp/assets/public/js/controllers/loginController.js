angular.module('smiled.application').controller('loginCtrl', ['$scope', 'userService', function loginCtrl($scope, userService){
	
	$scope.login = login;
	$scope.logout = logout;
	
	function login(){
		console.log("-----------> User: "+$scope.user.email+" - Password: "+$scope.user.password);
		userService.login($scope.user.email, $scope.user.password);
	}
	
	function logout(){
		userService.logout();
	}
}]);
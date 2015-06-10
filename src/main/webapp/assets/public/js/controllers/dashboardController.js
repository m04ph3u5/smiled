angular.module('smiled.application').controller('dashboardCtrl', ['$scope', '$state', 'Permission', 'apiService', 'userService',
                                                                  function dashboardCtrl($scope, $state, permission,apiService,userService){

	function onStartup(){
		if(userService.hasRoleUser()){
			$state.go("student");
		}
		if(userService.hasRoleTeacher()){
			$state.go("teacher");
		}
		if(userService.hasRoleAdmin()){
			$state.go("admin");
		}
	}
	onStartup();
	
	apiService.getMe().then(
		function(data){
			$scope.user = data;
		},
		function(reason){
			console.log("dashboardCtrl error getting user");
		}
	);
}]);
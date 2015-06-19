angular.module('smiled.application').controller('dashboardCtrl', ['$state', 'Permission', 'apiService', 'userService',
       
                                                                  function dashboardCtrl( $state, permission,apiService,userService){
	
	var self = this;
	self.showPopUp = false;
	
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
	
	var createScenario = function(){
		self.showPopUp = true;
		
	}
	function getMe(){
		
		return apiService.getMe().then(
				
				function(data){
					self.user = data;
					var list = data.creatingScenarios;
//					if (list.lenght<=3){
//						
//					}
//					self.firstScenarios; 
//					
				},
				function(reason){
					self.user={};
					console.log("dashboardCtrl error getting user");
				}
			);
	}
	
	onStartup();
	getMe();
	
}]);
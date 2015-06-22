angular.module('smiled.application').controller('dashboardCtrl', ['$state', 'Permission', 'apiService', 'userService', 'scenarioService',
       
                                                                  function dashboardCtrl( $state, permission,apiService,userService, scenarioService){
	
	var self = this;
	self.user = {};
	
	var onStartup = function (){
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
	
	var showPopupCreationScenario = function (){
		console.log("showPopupCreationScenario");
		scenarioService.showModal();
		
	};
			
	var getMe = function(){
		
		return apiService.getMe().then(
				
				function(data){
					self.user = data;
					console.log("-----------");
					console.log(self.user.creatingScenarios);
//					if (list.lenght<=3){
//						
//					}
//					self.firstScenarios; 
//					
				},
				function(reason){
					console.log("dashboardCtrl error getting user");
				}
			);
	}
	
	
	onStartup();
	getMe();
	
	return {
		showPopupCreationScenario : showPopupCreationScenario
	}
	
}]);
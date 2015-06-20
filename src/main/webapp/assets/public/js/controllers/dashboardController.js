angular.module('smiled.application').controller('dashboardCtrl', ['$state', 'Permission', 'apiService', 'userService', 'scenarioService',
       
                                                                  function dashboardCtrl( $state, permission,apiService,userService, scenarioService){
	
	var self = this;

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
	
	return {
		showPopupCreationScenario : showPopupCreationScenario
	}
	
}]);
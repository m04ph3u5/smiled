angular.module('smiled.application').controller('dashboardCtrl', ['$state', 'Permission', 'apiService', 'userService','ngDialog',
       
                                                                  function dashboardCtrl( $state, permission,apiService,userService,ngDialog){
	
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
	var showPopUpCreationScenario = function (){
		
		ngDialog.open({
		     template:'assets/private/partials/createScenario.html',
		     className: 'ngdialog-message',
		     controller: 'createScenarioCtrl',
		     controllerAs: 'createScenario',
		     preCloseCallback: function(value) {
                 if (confirm('Close it?  (Value = ' + value+ ')')) {
                     return true;
                 }
                 return false;
             }
		     

		});
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
	return {
		showPopUpCreationScenario : showPopUpCreationScenario
	};
	
	onStartup();
	getMe();
	
}]);
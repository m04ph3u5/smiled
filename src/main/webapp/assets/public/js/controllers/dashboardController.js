angular.module('smiled.application').controller('dashboardCtrl', ['userService','scenarioService',
   function dashboardCtrl(userService,scenarioService){
	
	var self = this;
	//self.user = {};
	
	userService.getUser().then(
		function(data){
			self.user=data;
			console.log(self.user);
		}
	);

	var showPopUpCreationScenario = function (){
		scenarioService.showModal();
	};
		
		

	self.showPopUpCreationScenario=showPopUpCreationScenario;
	
	
}]);
angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','scenarioService',
   function dashboardCtrl(loggedUser,scenarioService){
	
	var self = this;
	//self.user = {};
	
//	userService.getUser().then(
//		function(data){
//			self.user=data;
//			console.log(self.user);
//		}
//	);
	console.log("dashboard");
	console.log(loggedUser);
	self.user = loggedUser;

	var showPopUpCreationScenario = function (){
		scenarioService.showModal();
	};
		
		

	self.showPopUpCreationScenario=showPopUpCreationScenario;
	
	
}]);
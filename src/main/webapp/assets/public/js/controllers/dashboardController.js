angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService',
   function dashboardCtrl(loggedUser,modalService){
	
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

	self.showPopUpCreationScenario = function (){
		modalService.showModalCreateScen();
	};
		
		
	
}]);
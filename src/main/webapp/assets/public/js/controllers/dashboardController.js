angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','apiService',
   function dashboardCtrl(loggedUser,modalService,apiService){
	
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
	
//	self.missionList = apiService.getMyMissions();
		
		
	
}]);
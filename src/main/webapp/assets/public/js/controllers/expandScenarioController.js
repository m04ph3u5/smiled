angular.module('smiled.application').controller('expandCtrl', ['apiService', function dashboardCtrl( apiService){
	
	var self = this;
	function getMe(){
		
		return apiService.getMe().then(
				
				function(data){
					self.user = data;
					var list = data.creatingScenarios;

				},
				function(reason){
					self.user ={};
					console.log("dashboardCtrl error getting user");
				}
			);
	}
	
	getMe();
	
}]);
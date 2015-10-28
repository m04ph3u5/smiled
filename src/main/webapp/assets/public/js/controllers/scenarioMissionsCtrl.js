angular.module('smiled.application').controller('scenarioMissionsCtrl', ['$stateParams','apiService',
                                                                         
		 function scenarioMissionsCtrl($stateParams, apiService){
	
			 var self = this;
			 console.log("scenarioMissionsCtrl---------------");
			 console.log($stateParams.id);
			 self.myMissions = [];
		
			var onStartUp = function(){
				apiService.getMyMissionsInScenario($stateParams.id).then(
						function(data){
							self.myMissions = data;
						},
						function(reason){
							console.log("error in find my missions");
						}
				);
			}
			
			
			onStartUp();
	
}]);
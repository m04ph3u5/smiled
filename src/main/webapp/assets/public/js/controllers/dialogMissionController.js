angular.module('smiled.application').controller('dialogMissionCtrl', ['modalService', 'apiService', 'alertingGeneric', '$scope',
                 function dialogMissionCtrl(modalService, apiService, alertingGeneric, $scope){
	var self = this;
	self.mission = {};
	console.log("prova------->");
	console.log($scope.scenario);
	
	self.createMission = function (scenId){
		if(scenId == null){
			//compito creato dalla dashboard
			apiService.createMission(self.mission.scenId, self.mission).then(
					function(data){
//						self.mission.title="";
//						self.mission.description="";
//						self.mission.deliverydate=null;
//						self.mission.studentId="";
						
						 //alertingGeneric.addSuccess("MissionCreata");
						 modalService.closeModalCreateMission();
					},
					function(reason){
						
						console.log("error in creation of new mission");
					}
			);
		}else{
			//compito creato dallo scenario
			
		}
		
	}
}]);
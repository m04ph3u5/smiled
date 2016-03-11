angular.module('smiled.application').controller('personalMissionCtrl', ['apiService', 'CONSTANTS', '$scope', '$stateParams',
   function personalMissionCtrl(apiService, CONSTANTS, $scope, $stateParams){
	
	var self = this;
	console.log($stateParams.missions);
	if($stateParams.missions!=null && $stateParams.missions.length>0){
		self.myMissions = $stateParams.missions;
	}else{
		console.log("download missions");
		apiService.getMyMissions().then(
				function(data){
					self.myMissions = data;
				},
				function(reason){
					console.log("Error retrieve missions");
					console.log(reason);
				}
		);
	}
	
	self.missionDateFormatDay = CONSTANTS.realDateFormatOnlyDay;
	self.missionDateFormatMonth = CONSTANTS.realDateFormatOnlyMonth;
	
}]);
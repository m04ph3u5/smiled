angular.module('smiled.application').controller('personalMissionCtrl', ['apiService', 'CONSTANTS', '$scope',
   function personalMissionCtrl(apiService, CONSTANTS, $scope){
	
	var self = this;
	apiService.getMyMissions().then(
			function(data){
				self.myMissions = data;
			},
			function(reason){
				console.log("Error retrieve missions");
				console.log(reason);
			}
	);
	self.missionDateFormatDay = CONSTANTS.realDateFormatOnlyDay;
	self.missionDateFormatMonth = CONSTANTS.realDateFormatOnlyMonth;
	
}]);
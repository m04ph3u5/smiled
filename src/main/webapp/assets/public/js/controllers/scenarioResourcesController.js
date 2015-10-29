angular.module('smiled.application').controller('scenarioResourcesCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload',
              function scenarioResourcesCtrl(CONSTANTS,$scope, apiService,Upload){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.uploadable = $scope.scenario.isCreator || $scope.scenario.isModerator;
	
	self.uploadFiles = function(file){
		console.log("TEST TEST TEST");
	}
}]);
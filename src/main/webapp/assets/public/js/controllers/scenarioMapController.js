angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope',
              function scenarioMapCtrl(CONSTANTS,$scope){
	
	var self = this;
	self.scen = $scope.scenario.scen;
	if(self.scen.history.mapId)
		self.map = CONSTANTS.urlMedia(self.scen.history.mapId);
	console.log(self.map);
}]);
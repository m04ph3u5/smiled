angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope',
              function scenarioMapCtrl(CONSTANTS,$scope){
	
	var self = this;
	self.scen = $scope.scenario.scen;
}]);
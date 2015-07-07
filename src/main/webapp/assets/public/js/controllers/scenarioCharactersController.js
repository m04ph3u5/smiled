angular.module('smiled.application').controller('scenarioCharactersCtrl', ['CONSTANTS', '$scope',
              function scenarioCharactersCtrl(CONSTANTS,$scope){
	
	var self = this;
	self.scen = $scope.scenario.scen;
}]);
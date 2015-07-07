angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope',
              function scenarioPostCtrl(CONSTANTS,$scope){
	var self = this;
	self.scen = $scope.scenario.scen;
}]);
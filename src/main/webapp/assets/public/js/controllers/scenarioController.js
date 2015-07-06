angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'CONSTANTS',
                                                              function scenarioCtrl(scenario, CONSTANTS){
	
	console.log("controller");
	console.log(scenario);
	
	var self = this;
	self.scen = scenario;
	self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id);
	console.log(self.scen.cover);
}]);
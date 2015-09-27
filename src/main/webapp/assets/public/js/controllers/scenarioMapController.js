angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope', 'apiService',
              function scenarioMapCtrl(CONSTANTS,$scope,apiService){
	
	var self = this;
	self.scen = $scope.scenario.scen;
	if(self.scen.history.mapId)
		self.map = CONSTANTS.urlMedia(self.scen.history.mapId);
	
	self.posts = apiService.getPagedPosts(self.scen.id, 0, 300, false);
	
	self.slide = 0;

	
	self.options = {
		orientation: 'horizontal',
		min: 0,
		max: 100,
		range: 'min',
	};
	
}]);
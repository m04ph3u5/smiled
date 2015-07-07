angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.posts = [];
	
	apiService.getPagedPosts(self.scen.id, 0, 5, false).then(
			function(data){
				
			
			}, function(reason){
				console.log("errore");
			}
	);
}]);
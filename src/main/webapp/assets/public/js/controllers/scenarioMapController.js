angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope', 'apiService',
              function scenarioMapCtrl(CONSTANTS,$scope,apiService){
	
	var self = this;
	self.scen = $scope.scenario.scen;
	if(self.scen.history.mapId)
		self.map = CONSTANTS.urlMedia(self.scen.history.mapId);
	
	var getPost = function(){
		apiService.getPagedPosts(self.scen.id, 0, 300, false).then(
	
			function(data){
				self.posts = data.content;				
			}, function(reason){
				console.log("errore");
			}
		);
	}
	
	getPost();
}]);
angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'userService',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, userService){
	
	var self = this;
	self.character = {};
	var idChar = $stateParams.idCharacter;
	console.log(idChar);
	console.log($scope.scenario.scen.id);
	apiService.getCharacter($scope.scenario.scen.id, idChar).then(
			function(data){
				self.character = data;
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	function getCover(id){
		userService.getUser(id).coverPhoto;
		
	}
}]);
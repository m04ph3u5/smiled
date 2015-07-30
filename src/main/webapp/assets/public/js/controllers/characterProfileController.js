angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'userService',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, userService){
	
	var self = this;
	self.character = {};
	var idChar = $stateParams.idCharacter;
	
	apiService.getCharacter($scope.scenario.scen.id, idChar).then(
			function(data){
				self.character = data;
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	var currentCharacter = $scope.scenario.currentCharacter;
	var isOwner = currentCharacter.id==idChar;
	//prendere la roba dalla vista e salvarla
	/*self.updateDescription(){
		character.quote=;
		apiService.updateCharacter(self.id, character,idChar).then{
			
		}
		
	}*/

}]);
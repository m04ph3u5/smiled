angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'userService',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, userService){
	
	var self = this;
	self.character = {};
	var idChar = $stateParams.idCharacter;
	var scenarioId = $scope.scenario.scen.id;
	self.bornMonth = null;
	self.deadMonth = null;
	self.isOwner = false;
	//mi serve il currentOwner per mettere l'immagine. Perché è undefined?
	var currentOwnerId  = null;
	var idUser = $scope.scenario.loggedUser.id;
	self.actualUserCover = null;
	//qua non dovrebbe avere il currentCharacter ereditato da scenario?
	
	
	apiService.getCharacter(scenarioId, idChar).then(
			function(data){
				self.character = data;
				//perché è undefined??
				self.bornMonth = CONSTANTS.monthString(self.character.bornDate.month);
				self.deadMonth = CONSTANTS.monthString(self.character.deadDate.month);
				if(self.character.actualUser.id == idUser) self.isOwner = true;	
				self.actualUserCover = CONSTANTS.urlUserCover(self.character.actualUser.id);
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar);
	console.log("OHUUU"+currentOwnerId + idUser + self.isOwner);
	
	//prendere la roba dalla vista e salvarla
	self.updateDescription = function(){
		self.editDescription = !self.editDescription;
		//apiService.updateCharacter(self.id, character,idChar).then{
			
		//}		
	}
//	self.getUserCover = function(){
//		console.log("STO CERCANDO"+id)
//		self.userCover = CONSTANTS.urlUserCover(id);				
//	}

}]);
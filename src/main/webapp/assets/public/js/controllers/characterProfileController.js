angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'userService',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, userService){
	
	var self = this;
	self.character = {};
	var idChar = $stateParams.idCharacter;
	var scenarioId = $scope.scenario.scen.id;
	self.bornMonth = null;
	self.deadMonth = null;
	self.isOwner = false;
	var currentOwnerId  = null;
	var idUser = $scope.scenario.loggedUser.id;
	self.actualUserCover = null;
	self.newQuote = null;
	
	apiService.getCharacter(scenarioId, idChar).then(
			function(data){
				self.character = data;
				self.bornMonth = CONSTANTS.monthString(self.character.bornDate.month);
				self.deadMonth = CONSTANTS.monthString(self.character.deadDate.month);
				if(self.character.actualUser.id == idUser) self.isOwner = true;	
				self.actualUserCover = CONSTANTS.urlUserCover(self.character.actualUser.id);
				self.newQuote = self.character.quote;
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
	
	self.updateChar = function(){
		console.log(self.newQuote);
		var charDTO = {
				'name': self.character.name,
				'nickname': self.character.nickname,
				'description' : self.character.bornDate,
				'bornDate': self.character.bornDate,
				'deadDate': self.character.deadDate,
				'cover': self.character.deadDate,
				'quote': self.newQuote,
				'gender': self.character.gender,
				'role': self.character.role,
				'bornTown': self.character.bornTown,
				'deadTown': self.character.deadTown
		}
//		apiService.updateCharacter(scenarioId, charDTO , idChar);
	}
	
//	self.getUserCover = function(){
//		console.log("STO CERCANDO"+id)
//		self.userCover = CONSTANTS.urlUserCover(id);				
//	}

}]);
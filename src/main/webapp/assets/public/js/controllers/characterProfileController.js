angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'userService',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, userService){
	
	var self = this;
	self.character = {};
	//due variabili identiche perché ad api service non piaceva self.idchar
	idChar = $stateParams.idCharacter;
	self.idChar = idChar;
	var scenarioId = $scope.scenario.scen.id;
	
	self.bornMonth = null;
	self.deadMonth = null;
	self.actualUserCover = null;
	self.newQuote = null;
	self.newRole = null;
	self.newDescription = null;
	
	//var idUser = $scope.scenario.loggedUser.id;
	self.currentChar = $scope.scenario.currentCharacter.id;
	
	apiService.getCharacter(scenarioId, idChar).then(
			function(data){
				
				self.character = data;
				self.bornMonth = CONSTANTS.monthString(self.character.bornDate.month);
				self.deadMonth = CONSTANTS.monthString(self.character.deadDate.month);				
				self.actualUserCover = CONSTANTS.urlUserCover(self.character.actualUser.id);
				self.newQuote = self.character.quote;
				self.newRole = self.character.role;
				self.newDescription = self.character.description;
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar);

	
	self.updateChar = function(){		
		var charDTO = {};
		charDTO.name= self.character.name;
		charDTO.nickname= self.character.nickname;
		charDTO.description= self.newDescription;
		charDTO.bornDate= self.character.bornDate;
		charDTO.deadDate= self.character.deadDate;
		charDTO.cover= self.character.cover;
		charDTO.quote= self.newQuote;
		charDTO.gender= self.character.gender;
		charDTO.role= self.newRole;
		charDTO.bornTown= self.character.bornTown;
		charDTO.deadTown= self.character.deadTown;
		
		apiService.updateCharacter(scenarioId, charDTO , idChar).then(
				function(data){
					self.character.name=data.name;
					self.character.nickname=data.nickname;
					self.character.description=data.description;
					self.character.bornDate=data.bornDate;
					self.character.deadDate=data.deadDate;
					self.character.cover=data.coverPhotoId;
					self.character.quote=data.quote;
					self.character.gender=data.gender;
					self.character.role=data.role;
					self.character.bornTown=data.bornTown;
					self.character.deadTown=data.deadTown;
				},
				function(reason){
					
				}
		);
	}
	
//	self.getUserCover = function(){
//		console.log("STO CERCANDO"+id)
//		self.userCover = CONSTANTS.urlUserCover(id);				
//	}

}]);
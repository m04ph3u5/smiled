angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'loggedUser', 'CONSTANTS', 
                                                              function scenarioCtrl(scenario, loggedUser, CONSTANTS){
	
	console.log("controller");
	console.log(scenario);
	
	var self = this;
	self.scen = scenario;
	
	self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id);
	
	self.isModerator = false;
	self.isCreator = false;
	self.hasCharacter = false;
	self.currentCharacter = {};
	

	
	
	
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	var onStartup = function(){

		if(self.scen.teacherCreator.id==loggedUser.id){
			console.log("isCreator");
			self.isCreator=true;
			self.isModerator=true;
		}
		
		if(!self.isModerator){
			if(self.scen.collaborators){
				for(var i=0; i<self.scen.collaborators.length; i++){
					if(self.scen.collaborators[i].id==loggedUser.id){
						console.log("isModerator");
						self.isModerator=true;
						break;
					}
				}
			}
		}
		
		if(self.scen.status=="ACTIVE"){
			for(var i=0; i<loggedUser.openScenarios.length; i++){
				if(loggedUser.openScenarios[i].id==self.scen.id){
					if(loggedUser.openScenarios[i].myCharacterId){
						self.hasCharacter=true;
						self.currentCharacter.name = loggedUser.openScenarios[i].name;
						self.cuurentCharacter.cover = CONSTANTS.urlCharacterCover(self.scen.id, self.currentCharacter.id);
					}
				}
			}
		}
	}
	
	onStartup();

}]);
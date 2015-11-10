angular.module('smiled.application').controller('draftsListCtrl', ['loggedUser', 'drafts','apiService', 'CONSTANTS',
    function draftsListCtrl(loggedUser, drafts, apiService, CONSTANTS){
	
	var self = this;
	self.user = loggedUser;
	self.myDraft = drafts;
	
	var onStartUp = function(){			
		for(var i=0;self.myDraft && i<self.myDraft.length;i++){
			if(self.myDraft[i].character){
				self.myDraft[i].character.cover = CONSTANTS.urlCharacterCover(self.myDraft[i].scenarioId, self.myDraft[i].character.id);
			}
			for(var j=0; loggedUser.openScenarios && j<loggedUser.openScenarios.length; j++){
				if(self.myDraft[i].scenarioId==loggedUser.openScenarios[j].id){
					self.myDraft[i].scenarioName = loggedUser.openScenarios[j].name; 
				}
			}
		}
		console.log("DRAFT");
	}
	
	onStartUp();
	
}]);
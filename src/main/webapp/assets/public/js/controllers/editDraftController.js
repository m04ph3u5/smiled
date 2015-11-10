angular.module('smiled.application').controller('editDraftCtrl', ['loggedUser', 'drafts', 'apiService', 'CONSTANTS', '$stateParams',
    function editDraftCtrl(loggedUser, drafts, apiService, CONSTANTS, $stateParams){
	
	var self = this;
	self.user = loggedUser;
	self.post = {};
	
	self.postId = $stateParams.postId;

	var onStartUp = function(){
		if(drafts){
			self.drafts = drafts;
			for(var i=0; i<self.drafts.length; i++){
				self.drafts[i].character.cover = CONSTANTS.urlCharacterCover(self.drafts[i].scenarioId, self.drafts[i].character.id);
			}
		}
	}
	
	onStartUp();
	
}]);
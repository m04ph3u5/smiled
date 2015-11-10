angular.module('smiled.application').controller('editDraftCtrl', ['loggedUser', 'drafts', 'apiService', 'CONSTANTS', '$stateParams',
    function editDraftCtrl(loggedUser, drafts, apiService, CONSTANTS, $stateParams){
	
	var self = this;
	self.user = loggedUser;
	self.post = {};
	
	var postId = $stateParams.postId;
	
	var onStartUp = function(){
		if(drafts){
			for(var i=0; i<drafts.length; i++){
				if(drafts[i].id==postId){
					self.post = drafts[i];
					if(self.post.character)
						self.post.character.cover = CONSTANTS.urlCharacterCover(self.post.scenarioId, self.post.character.id);
					break;
				}
			}
		}
	}
	
	onStartUp();
	
}]);
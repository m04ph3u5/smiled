angular.module('smiled.application').controller('editDraftCtrl', ['loggedUser', 'drafts', '$stateParams',
    function editDraftCtrl(loggedUser, drafts, $stateParams){
	
	var self = this;
	self.user = loggedUser;
	self.drafts = drafts;
	self.postId = $stateParams.postId;

}]);
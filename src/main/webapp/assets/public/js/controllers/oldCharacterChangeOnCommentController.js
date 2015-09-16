angular.module("smiled.application").controller('oldCharacterChangeOnCommentCtrl', [ 'charName', 'modalService', '$window', 
	function oldCharacterChangeOnCommentCtrl(charName, modalService,$window){
		var self = this;
		
		self.charName=charName;
		self.ok = function(){
			modalService.closeModalOldCharacterChangeOnComment();
			$window.location.reload();
		}
		
}]);
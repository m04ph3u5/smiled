angular.module("smiled.application").controller('dialogDeleteNewspaperCtrl', ['modalService', '$state', 'scenarioId', 'newspaperNumber', 'alertingGeneric', 'article',
   function(modalService, $state, scenarioId, newspaperNumber, alertingGeneric, article){
	var self = this;
	self.deleteNewspaper = function(){
		console.log(scenarioId);
		console.log(newspaperNumber);
		var n = modalService.deleteNewspaper(scenarioId, newspaperNumber);
		article.setIsJustDeleted(); 
		article.setIsDraft(false); 
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
}                                                                    
]);
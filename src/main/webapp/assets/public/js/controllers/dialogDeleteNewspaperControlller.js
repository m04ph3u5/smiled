angular.module("smiled.application").controller('dialogDeleteNewspaperCtrl', ['modalService', '$state', 'scenarioId', 'newspaperNumber',
   function(modalService, $state, scenarioId, newspaperNumber){
	var self = this;
	self.deleteNewspaper = function(){
		console.log(scenarioId);
		console.log(newspaperNumber);
		modalService.deleteNewspaper(scenarioId, newspaperNumber);
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
}                                                                    
]);
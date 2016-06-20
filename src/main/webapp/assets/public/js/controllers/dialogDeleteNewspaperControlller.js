angular.module("smiled.application").controller('dialogDeleteNewspaperCtrl', ['modalService', '$state', 'scenarioId', 'newspaperNumber', 'alertingGeneric',
   function(modalService, $state, scenarioId, newspaperNumber, alertingGeneric){
	var self = this;
	self.deleteNewspaper = function(){
		console.log(scenarioId);
		console.log(newspaperNumber);
		var n = modalService.deleteNewspaper(scenarioId, newspaperNumber);
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
}                                                                    
]);
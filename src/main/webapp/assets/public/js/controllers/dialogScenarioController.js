angular.module('smiled.application').controller('dialogScenarioCtrl', ['modalService','alertingGeneric', '$state', 
       
                                                                  function dialogScenarioCtrl(modalService, alertingGeneric, $state){
	
	var self = this;
	self.scenario = {};
	self.scenToDelete = modalService.getScenToDelete();
	self.scenario.startDate = {};
	self.scenario.endDate = {};
	self.scenario.startDate.afterChrist = true;
	self.scenario.endDate.afterChrist = true;
	
	self.createScenario = function (){
		console.log("aaaasssdddffggg");
		if(self.scenario.title=="" || self.scenario.title==null || self.scenario.startDate==null || self.scenario.endDate==null){
			alertingGeneric.addWarning("Inserire tutti i dati richiesti");
		}
		else if (self.scenario.title.length<2)
			alertingGeneric.addWarning("Inserire un titolo di almeno 2 caratteri");
		else if(checkDate(self.scenario.startDate) == false)
			alertingGeneric.addWarning("Data di inizio errata");
		else if(checkDate(self.scenario.endDate) == false)
			alertingGeneric.addWarning("Data di fine errata");
		else{
			var s= modalService.createScenario(self.scenario);
			s.then(function(data){
				 alertingGeneric.addSuccess("ScenarioCreato");
				 modalService.closeModalCreateScen();
				 $state.go("logged.scenarioWizard.info", {"id": data.id});
				 
			 }, function(reason){
				 console.log("Creazione scenario fallita!");
				 alertingGeneric.addWarning("Non e' stato possibile creare lo scenario, riprova!");
			 });
			
		}
		
		
	}
	self.deleteScenario = function(){
		
		if(self.scenToDelete!=null && self.scenToDelete!=""){
			modalService.deleteScenario();
			modalService.closeModalDeleteScen();
			$state.go("logged.dashboard");
			
		}
		console.log("delete  aaaaaaaaaaaaaaaaaaaa");
	}
	

	
	var checkDate = function(date){
		// regular expression to match required date format
//		   var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
//
//
//	    if(date != '' && !date.match(re)) {
//	      return false;
//	    }
//	    else
	    	return true;
	    
	    
	}
	
	
}]);
angular.module('smiled.application').controller('createScenarioCtrl', ['scenarioService','alertingGeneric', '$timeout',
       
                                                                  function createScenarioCtrl(scenarioService, alertingGeneric, $timeout){
	
	var self = this;
	var scenario = {
			
	};
	
	var createScenario = function (){
		if(scenario.title=="" || scenario.title==null || scenario.startDate=="" || scenario.startDate==null || scenario.endDate=="" || scenario.endDate==null){
			alertingGeneric.addWarning("Inserire tutti i dati richiesti");
		}
		else if (scenario.title.length<2)
			alertingGeneric.addWarning("Inserire un titolo di almeno 2 caratteri");
		else if(checkDate(scenario.startDate) == false)
			alertingGeneric.addWarning("Data di inizio errata");
		else if(checkDate(scenario.endDate) == false)
			alertingGeneric.addWarning("Data di fine errata");
		else{
			var s= scenarioService.createScenario(scenario);
			s.then(function(data){
				 alertingGeneric.addSuccess("ScenarioCreato");
					$timeout(function () {
						scenarioService.closeModal();
		    		}, 2000);
				 
			 }, function(reason){
				 console.log("Creazione scenario fallita!");
				 alertingGeneric.addWarning("Non e' stato possibile creare lo scenario, riprova!");
			 });
			
		}
		
		
	}
	var checkDate = function(date){
		// regular expression to match required date format
		   var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;


	    if(date != '' && !date.match(re)) {
	      return false;
	    }
	    else
	    	return true;
	    
	    
	}
	return {
		scenario : scenario,
		createScenario : createScenario
	}
	
}]);
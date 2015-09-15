angular.module('smiled.application').controller('dialogScenarioCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS',
       
                                                                  function dialogScenarioCtrl(modalService, alertingGeneric, $state, CONSTANTS){
	
	var self = this;
	self.scenario = {};
	self.scenToDelete = modalService.getScenToDelete();
	self.scenario.startDate = {};
	self.scenario.endDate = {};
	self.scenario.startDate.afterChrist = true;
	self.scenario.endDate.afterChrist = true;
	self.startDate = {};
	self.endDate = {};
	
	self.createScenario = function (){
	
		if(self.scenario.title=="" || self.scenario.title==null || self.scenario.startDate==null || self.scenario.endDate==null){
			alertingGeneric.addWarning("Inserire tutti i dati richiesti");
		}
		else if (self.scenario.title.length<2)
			alertingGeneric.addWarning("Inserire un titolo di almeno 2 caratteri");
		else if(checkDate(self.scenario.startDate) == false)
			alertingGeneric.addWarning("Data di inizio errata");
		else if(checkDate(self.scenario.endDate) == false)
			alertingGeneric.addWarning("Data di fine errata");
		else if(checkIfEndIsAfterStart(self.scenario.startDate, self.scenario.endDate) == false)
			alertingGeneric.addWarning("La data di fine non puo' precedere la data di inizio");
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
	
	self.startDate.months = CONSTANTS.getMonths("it");
	self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	
	self.endDate.months = CONSTANTS.getMonths("it");
	self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	
	self.getStartDays = function(){
		self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	}
	self.getEndDays = function(){
		self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	}
	
	var checkIfEndIsAfterStart = function(sD, eD){
		var startDate = parseInt(sD);
		var endDate = parseInt(eD);
		console.log("checkIfEndIsAfterStart");
		if(startDate.afterChrist && endDate.afterChrist){  //entrambe dopo cristo
			console.log("entrambe dopo cristo");
			if(startDate.year > endDate.year){  //startDate.year > endDate.year ERR
				console.log ("startDate.year > endDate.year ERR");
				return false;
			}else if (startDate.year < endDate.year){ //startDate.year > endDate.year GOOD
				console.log("startDate.year > endDate.year GOOD");
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
					console.log ("startDate.month > endDate.month ERR");
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					console.log("startDate.month < endDate.month GOOD");
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					console.log("data inizio e fine con stesso anno e stesso mese");
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
						console.log("startDate.day > endDate.day ERR");
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
						console.log("startDate.day < endDate.day GOOD");
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
				
		}
		else if(!startDate.afterChrist && !endDate.afterChrist){  //entrambe avanti cristo
			console.log("entrambe avanti cristo");
			if(startDate.year < endDate.year){  //startDate.year < endDate.year ERR
				console.log ("startDate.year < endDate.year ERR");
				console.log(startDate.year); console.log(endDate.year);
				return false;
			}else if (startDate.year > endDate.year){ //startDate.year > endDate.year GOOD
				console.log("startDate.year > endDate.year GOOD");
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
					console.log ("startDate.month > endDate.month ERR");
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					console.log("startDate.month < endDate.month GOOD");
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					console.log("data inizio e fine con stesso anno e stesso mese");
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
						console.log("startDate.day > endDate.day ERR");
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
						console.log("startDate.day < endDate.day GOOD");
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
		}
		else if(!startDate.afterChrist && endDate.afterChrist){   //inizio a.c. e fine d.c.  SICURAMENTE BUONO
			console.log("inizio a.c. e fine d.c.");
			return true;
		}
		else{																				//inizio d.c. e fine a.c. SICURAMENTE ERRATO
			console.log("inizio d.c. e fine a.c. ERRORE SICURO");
			return false;
		}
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
angular.module('smiled.application').controller('dialogScenarioCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS',
       
                                                                  function dialogScenarioCtrl(modalService, alertingGeneric, $state, CONSTANTS){
	
	var self = this;
	self.scenario = {};
	self.scenToDelete = modalService.getScenToDelete();
	self.attendeeToDelete = modalService.getAttendeeToDelete();
	self.collaboratorToDelete = modalService.getCollaboratorToDelete();
	self.characterToDelete = modalService.getCharacterToDelete();
	self.scenario.startDate = {};
	self.scenario.endDate = {};
	self.scenario.showRelationsToAll = true;
	self.scenario.newspaperEnabled = true;
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
		else if(checkDate(self.scenario.startDate.year) == false)
			alertingGeneric.addWarning("Data di inizio errata");
		else if(checkDate(self.scenario.endDate.year) == false)
			alertingGeneric.addWarning("Data di fine errata");
		else if(checkIfEndIsAfterStart(self.scenario.startDate, self.scenario.endDate) == false)
			alertingGeneric.addWarning("La data di fine non puo' precedere la data di inizio");
		else if(!self.scenario.startDate.afterChrist && (parseInt(self.scenario.startDate.year)>4712))
			alertingGeneric.addWarning("La minima data rappresentabile e': 1 gennaio 4712 AC");
		else{
			
			var s= modalService.createScenario(self.scenario);
			s.then(function(data){
				 alertingGeneric.addSuccess("ScenarioCreato");
				 modalService.closeModalCreateScen();
				 $state.go("logged.scenarioWizard.info", {"id": data.id});
				 
			 }, function(reason){
				 
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
		
	}
	
	self.startDate.months = CONSTANTS.getMonths("it");
	self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	
	self.endDate.months = CONSTANTS.getMonths("it");
	self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	
	self.getStartDays = function(){
		console.log("++++++++++++++++++");
		console.log(self.scenario.startDate.month);
		self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	}
	self.getEndDays = function(){
		self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	}
	
	var checkIfEndIsAfterStart = function(sD, eD){
		var startDate = {};
		var endDate = {};
		startDate.year = parseInt(sD.year);
		endDate.year = parseInt(eD.year);
		startDate.month = sD.month;
		endDate.month = eD.month;
		startDate.day = sD.day;
		endDate.day = eD.day;
		startDate.afterChrist = sD.afterChrist;
		endDate.afterChrist = eD.afterChrist;
		
		
		if(startDate.afterChrist && endDate.afterChrist){  //entrambe dopo cristo
			
			if(startDate.year > endDate.year){  //startDate.year > endDate.year ERR
				
				return false;
			}else if (startDate.year < endDate.year){ //startDate.year > endDate.year GOOD
				
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
					
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
					
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
						
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
				
		}
		else if(!startDate.afterChrist && !endDate.afterChrist){  //entrambe avanti cristo
			
			if(startDate.year < endDate.year){  //startDate.year < endDate.year ERR
				
				return false;
			}else if (startDate.year > endDate.year){ //startDate.year > endDate.year GOOD
				
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
			
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
						
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
					
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
		}
		else if(!startDate.afterChrist && endDate.afterChrist){   //inizio a.c. e fine d.c.  SICURAMENTE BUONO
			
			return true;
		}
		else{																				//inizio d.c. e fine a.c. SICURAMENTE ERRATO
			
			return false;
		}
	}
	
	
	var checkDate = function(year){
		if(isNaN(year)){
			return false;
		}else{
			return true;
		}
    
	}
	
	
}]);
angular.module('smiled.application').factory('modalService', ['$modal', 'apiService', function modalService($modal, apiService){
	
		var scenario = {
				
		};
		
		var modalInstanceCreateScen;
		var modalInstanceDeleteScen;
		var modalInstanceSetDate;
		
		var optionsCreateScen = {
				templateUrl:'assets/private/partials/createScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
				size: 'modal-lg'  //TODO non funziona
				
		};
		
		var optionsDeleteScen = {
				templateUrl:'assets/private/partials/deleteScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
		};
		
		var optionsSetDateStart = {
				templateUrl:'assets/private/partials/setDate.html',
				controller: 'dialogSetDateCtrl',
				controllerAs: 'dialogSetDate',
				resolve : {
					s : function(){
						return scenario;
					},
					start : function(){
						return true;
					}
				}
		};
		var optionsSetDateEnd = {
				templateUrl:'assets/private/partials/setDate.html',
				controller: 'dialogSetDateCtrl',
				controllerAs: 'dialogSetDate',
				resolve : {
					s : function(){
						return scenario;
					},
					start : function(){
						return false;
					}
				}
		};
		
		
		var showModalCreateScen = function(){
			modalInstanceCreateScen = $modal.open(optionsCreateScen);
			return modalInstanceCreateScen.result;
			
		}
		
		var closeModalCreateScen = function(){
			modalInstanceCreateScen.close();
		}
		
		var showModalDeleteScen = function(s){
			scenario = s;
			modalInstanceDeleteScen = $modal.open(optionsDeleteScen);
			return modalInstanceDeleteScen.result;
			
		}
		
		var closeModalDeleteScen = function(){
			modalInstanceDeleteScen.close();
		}
		
		var createScenario = function(scenario){
			console.log("CREATE SCENARIO -----------------------");
			 var history ={
					 startDate : {
						 year : "",
						 month :"",
						 day : "",
						 afterChrist : "",
					 },
					 endDate : {
						 year : "",
						 month :"",
						 day : "",
						 afterChrist : "",
					 }
			 };
			 history.startDate.year = scenario.startDate.year;
			 history.startDate.month = scenario.startDate.month;
			 history.startDate.day = scenario.startDate.day;
			 history.startDate.afterChrist = scenario.startDate.afterChrist;
			 
			 history.endDate.year = scenario.endDate.year;
			 history.endDate.month = scenario.endDate.month;
			 history.endDate.day = scenario.endDate.day;
			 history.endDate.afterChrist = scenario.endDate.afterChrist;
			 
			 var scenarioDTO = {};
			 scenarioDTO.name = scenario.title;
			 scenarioDTO.history = history;
			 			 
			 s = apiService.createScenario(scenarioDTO);
			 return s; 
			 
		}
		
		var deleteScenario = function(){
			console.log(scenario);
			 s = apiService.deleteScenario(scenario.id);
			 return s; 
			 
		}
		
		var getScenToDelete = function(){
			return scenario;
		}
		
		//f serve a specificare (nel caso di set date) se si cerca di modificare la data di inizio o di fine dello scenario

		var showPopUpSetDate = function(s, f){
			scenario = s;
			if(f==true)
				modalInstanceSetDate = $modal.open(optionsSetDateStart);
			else
				modalInstanceSetDate = $modal.open(optionsSetDateEnd);
			return modalInstanceSetDate.result;
		}
	
		
		return {
			createScenario : createScenario,
			deleteScenario : deleteScenario,
			showModalCreateScen : showModalCreateScen,
			closeModalCreateScen: closeModalCreateScen,
			showModalDeleteScen : showModalDeleteScen,
			closeModalDeleteScen: closeModalDeleteScen,
			getScenToDelete : getScenToDelete,
			showPopUpSetDate : showPopUpSetDate
		}
}]);





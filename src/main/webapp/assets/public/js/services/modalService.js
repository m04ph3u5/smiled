angular.module('smiled.application').factory('modalService', ['$modal', 'apiService', function modalService($modal, apiService){
	
		var scenario = {
				
		};
		
		var modalInstanceCreateScen;
		var modalInstanceDeleteScen;
		
		var optionsCreateScen = {
				templateUrl:'assets/private/partials/createScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
				
		};
		
		var optionsDeleteScen = {
				templateUrl:'assets/private/partials/deleteScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
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
			 var history ={};
			 history.startDate = scenario.startDate;
			 history.endDate = scenario.endDate;
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
		
	
		
		return {
			createScenario : createScenario,
			deleteScenario : deleteScenario,
			showModalCreateScen : showModalCreateScen,
			closeModalCreateScen: closeModalCreateScen,
			showModalDeleteScen : showModalDeleteScen,
			closeModalDeleteScen: closeModalDeleteScen,
			getScenToDelete : getScenToDelete
		}
}]);





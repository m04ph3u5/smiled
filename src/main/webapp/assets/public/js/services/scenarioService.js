angular.module('smiled.application').factory('scenarioService', ['$modal', 'apiService', function scenarioService($modal, apiService){
	
		var self = this;
		var scenario = {
				
		};
		
		var options = {
				templateUrl:'assets/private/partials/createScenario.html',
				controller: 'createScenarioCtrl',
				controllerAs: 'createScenario'
		};
		var modalInstance; 
		
		var showModal = function(){
			modalInstance = $modal.open(options);
			return modalInstance.result;
			
		}
		
		var closeModal = function(){
			modalInstance.close();
		}
		
		
		
		var createScenario = function(scenario){
			 var history ={};
			 history.startDate = scenario.startDate;
			 history.endDate = scenario.endDate;
			 var scenarioDTO = {};
			 scenarioDTO.name = scenario.title;
			 scenarioDTO.history = history;
			 			 
			 s = apiService.createScenario(scenarioDTO);
			 return s; 
			 
		}
		
		var updateScenario = function(scenario){
			
		}
		
		return {
			createScenario : createScenario,
			updateScenario : updateScenario,
			showModal : showModal,
			closeModal: closeModal
		}
}]);





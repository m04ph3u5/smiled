angular.module('smiled.application').factory('apiService', [ 'Restangular', 
              function apiService(Restangular){
	
	var me = Restangular.one('me');
	var register = Restangular.one('register');
	var uploadMedia = Restangular.one("media");
	
	function getMe(){
		return me.get();
	}
	
	function postRegister(registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}
	
	function createScenario(scenarioDTO){
		var scenario = Restangular.one("scenarios");
		console.log(scenarioDTO);
		return scenario.post("",scenarioDTO);
	}
	
	function updateScenario(id,scenarioDTO){
		var scenario = Restangular.one("scenarios",id);
		scenario.name = scenarioDTO.name;
		scenario.startHistoryDate = scenarioDTO.startHistoryDate;
		scenario.endHistoryDate = scenarioDTO.endHistoryDate;
		scenario.put();		
	}
	

	return {
		getMe: getMe,
		postRegister: postRegister,
		createScenario : createScenario
	}
	
	
	
}]);
angular.module('smiled.application').factory('apiService', [ 'Restangular', 
              function apiService(Restangular){
	
	var me = Restangular.one('me');
	var register = Restangular.one('register');
	var uploadMedia = Restangular.one("media");
	
	var getMe = function(){
		return me.get();
	}
	
	var postRegister = function (registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}
	
	var createScenario = function (scenarioDTO){
		var scenario = Restangular.one("scenarios");
		console.log(scenarioDTO);
		return scenario.post("",scenarioDTO);
	}
	
	var updateScenario = function (id,scenarioDTO){
		var scenario = Restangular.one("scenarios",id);
		scenario.name = scenarioDTO.name;
		scenario.startHistoryDate = scenarioDTO.startHistoryDate;
		scenario.endHistoryDate = scenarioDTO.endHistoryDate;
		scenario.put();		
	}
	

	return {
		getMe: getMe,
		postRegister: postRegister,
		createScenario : createScenario,
		updateScenario : updateScenario
	}
	
	
	
}]);
angular.module('smiled.application').factory('apiService', [ 'Restangular', '$http', '$q',
              function apiService(Restangular,$http,$q){
	
	/*TODO Da riscrivere utilizzando il pattern giusto $http*/
	
	var register = Restangular.one('register');
	
	function postRegister(registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}
	
//	function createScenario(scenarioDTO){
//		var scenario = Restangular.one("scenarios");
//		console.log(scenarioDTO);
//		return scenario.post("",scenarioDTO);
//	}
	
//	function updateScenario(id,scenarioDTO){
//		var scenario = Restangular.one("scenarios",id);
//		scenario.name = scenarioDTO.name;
//		scenario.startHistoryDate = scenarioDTO.startHistoryDate;
//		scenario.endHistoryDate = scenarioDTO.endHistoryDate;
//		scenario.put();		
//	}
	/*-----------------------------------------------------------*/	

	var getScenario = function(idScenario){
		var p = $q.defer();
		$http.get('/ThesisProject/api/v1/scenarios/'+idScenario).then(
				function(response){
					console.log(response.data);
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	
	var createScenario = function(scenarioDTO){
		var s = $q.defer();
		$http.post("/ThesisProject/api/v1/scenarios", scenarioDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var updateScenario = function(scenarioDTO, id){
		var s = $q.defer();
		$http.put("/ThesisProject/api/v1/scenarios/"+id, scenarioDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var addUsersToScenario = function(emailsDTO, id){
		var e = $q.defer();
		$http.post("/ThesisProject/api/v1/scenarios/"+id+"/users", emailsDTO).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					e.reject(reason);
				}
		);
		return e.promise;
	}
	
	var addCharacterToScenario = function(character, id){
		var c = $q.defer();
		$http.post("/ThesisProject/api/v1/scenarios/"+id+"/characters", character).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
	var updateCharacter = function(id, characterDTO){
		var c = $q.defer();
		$http.put("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+characterDTO.id, characterDTO).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
//	var onSuccessGetScenario = function(response){
//		console.log("Getting data scenario: "+response.data);
//		scenarios = response.data;
//		return scenarios;
//	}
//	
//	var onErrorGetScenario = function(reason){
//		console.log("Error retreaving scenario: "+reason);
//	}

	return {
		postRegister: postRegister,
		createScenario : createScenario,
		getScenario : getScenario,
		updateScenario : updateScenario,
		addUsersToScenario: addUsersToScenario,
		addCharacterToScenario : addCharacterToScenario,
		updateCharacter: updateCharacter
	}
	
	
	
}]);
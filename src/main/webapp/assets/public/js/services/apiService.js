angular.module('smiled.application').factory('apiService', ['$http', '$q',
              function apiService($http,$q){
	
	/*TODO Da riscrivere utilizzando il pattern giusto $http*/
	
//	var register = Restangular.one('register');
//	
//	function postRegister(registerObject){
//		console.log(registerObject);
//		return register.post("",registerObject);
//	}
	
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
	
	var deleteScenario = function(id){
		var s = $q.defer();
		$http.delete("/ThesisProject/api/v1/scenarios/"+id).then(
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
	
	var addCollaboratorToScenario = function (emailDTO, id){
		var e = $q.defer();
		$http.post("/ThesisProject/api/v1/scenarios/"+id+"/collaborators", emailDTO).then(
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
	
	var updateCharacter = function(id, characterDTO, idCharacter){
		var c = $q.defer();
		$http.put("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+idCharacter, characterDTO).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
	var getCharacter = function(id, idCharacter){
		var c = $q.defer();
		$http.get("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
	var removeUserFromScenario = function(id, idUser){
		var u = $q.defer();
		$http.delete("/ThesisProject/api/v1/scenarios/"+id+"/users/"+idUser).then(
				function(response){
					u.resolve(response.data);
				},
				function(reason){
					u.reject(reason);
				}
		);
		return u.promise;
	} 
	
	var removeCollaboratorFromScenario = function(id, idCollaborator, putInAttendeesList){
		var u = $q.defer();
		$http.delete("/ThesisProject/api/v1/scenarios/"+id+"/collaborators/"+idCollaborator, putInAttendeesList).then(
				function(response){
					u.resolve(response.data);
				},
				function(reason){
					u.reject(reason);
				}
		);
		return u.promise;
	} 
	
	var removeCharacterFromScenario = function(id, idCharacter){
		var c = $q.defer();
		$http.delete("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	} 
	
	var getAllCharactersFromScen = function(id){
		var c = $q.defer();
		
		$http.get("/ThesisProject/api/v1/scenarios/"+id+"/characters").then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		
		return c.promise;
	}
	
	var addUserToCharacter = function(id, userId, characterId){
		var c = $q.defer();
		
		$http.put("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		
		return c.promise;
	}
	
	var removeUserFromCharacter = function(id, userId, characterId){
		var c = $q.defer();
		
		$http.delete("/ThesisProject/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
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
//		postRegister: postRegister,
		createScenario : createScenario,
		getScenario : getScenario,
		updateScenario : updateScenario,
		addUsersToScenario: addUsersToScenario,
		removeUserFromScenario: removeUserFromScenario,
		addCollaboratorToScenario: addCollaboratorToScenario,
		removeCollaboratorFromScenario: removeCollaboratorFromScenario,
		addCharacterToScenario : addCharacterToScenario,
		updateCharacter: updateCharacter,
		getCharacter : getCharacter,
		deleteScenario: deleteScenario,
		removeCharacterFromScenario: removeCharacterFromScenario,
		getAllCharactersFromScen : getAllCharactersFromScen,
		addUserToCharacter: addUserToCharacter,
		removeUserFromCharacter: removeUserFromCharacter
	}
	
	
	
}]);
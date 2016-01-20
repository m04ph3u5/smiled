 angular.module('smiled.application').factory('apiService', ['$http', '$q', 'Restangular',
                                                            function apiService($http,$q, Restangular){

	/* TODO Da riscrivere utilizzando il pattern giusto $http */

	var register = Restangular.one('register');

	function postRegister(registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}

// function createScenario(scenarioDTO){
// var scenario = Restangular.one("scenarios");
// console.log(scenarioDTO);
// return scenario.post("",scenarioDTO);
// }

// function updateScenario(id,scenarioDTO){
// var scenario = Restangular.one("scenarios",id);
// scenario.name = scenarioDTO.name;
// scenario.startHistoryDate = scenarioDTO.startHistoryDate;
// scenario.endHistoryDate = scenarioDTO.endHistoryDate;
// scenario.put();
// }
	/*-----------------------------------------------------------*/	

	var getScenario = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario).then(
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
		$http.post("/api/v1/scenarios", scenarioDTO).then(
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
		$http.put("/api/v1/scenarios/"+id, scenarioDTO).then(
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
		$http.delete("/api/v1/scenarios/"+id).then(
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
		$http.post("/api/v1/scenarios/"+id+"/users", emailsDTO).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					e.reject(reason);
				}
		);
		return e.promise;
	}

	var addCollaboratorToScenario = function (idCollaborator, id){
		var e = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/collaborators/"+ idCollaborator).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					console.log(reason);
					e.reject(reason);
				}
		);
		return e.promise;
	}

	var addCharacterToScenario = function(character, id){
		var c = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/characters", character).then(
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
		$http.put("/api/v1/scenarios/"+id+"/characters/"+idCharacter, characterDTO).then(
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

		$http.get("/api/v1/scenarios/"+id+"/characters").then(
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
		$http.get("/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
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
		$http.delete("/api/v1/scenarios/"+id+"/users/"+idUser).then(
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
		$http.delete("/api/v1/scenarios/"+id+"/collaborators/"+idCollaborator, putInAttendeesList).then(
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
		$http.delete("/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
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

		$http.put("/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
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

		$http.delete("/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);

		return c.promise;
	}

	/* -------------- GESTIONE DEI POST----------------- */	

	var sendStatus = function(id, idCharacter, status){
		var s = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/characters/"+idCharacter+"/status", status).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var updateStatus = function(id, idStatus, newStatus){
		var s = $q.defer();
		$http.put("/api/v1/scenarios/"+id+"/status/"+idStatus, newStatus).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var updateEvent = function(id, idEvent, newEvent){
		var s = $q.defer();
		$http.put("/api/v1/scenarios/"+id+"/events/"+idEvent, newEvent).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var deletePost = function(id, idPost){
		var s = $q.defer();
		$http.delete("/api/v1/scenarios/"+id+"/posts/"+idPost).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var getPagedPosts = function(id, nPag, nItem, historicalOrder, orderDesc){
		
		if(typeof orderDesc === 'undefined'){ 
			orderDesc = true; 
		}
		
		var c = $q.defer();

		$http.get("/api/v1/scenarios/"+id+"/posts", {
			params: { "nPag": nPag, "nItem": nItem, "historicOrder": historicalOrder, "orderDesc" : orderDesc }}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedLogs = function(nPag, nItem){
		
		var c = $q.defer();

		$http.get("/api/v1/log", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getUsersByFirstNameAndLastName = function(firstName, lastName){
		var c = $q.defer();

		$http.get("/api/v1/userScenarios", {
			params: { "firstName": firstName, "lastName": lastName}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}

	var getPagedTeachers = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/teachers", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedStudents = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/students", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedScenarios = function(nPag, nItem, orderByCreation){
		var c = $q.defer();

		$http.get("/api/v1/scenarios", {
			params: { "nPag": nPag, "nItem": nItem, "orderByCreation": orderByCreation}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedExceptions = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/clientException", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedTeacherByRegex = function(nPag, nItem, regex){
		var c = $q.defer();

		$http.get("/api/v1/searchTeachers", {
			params: {"regex": regex, "nPag": nPag, "nItem": nItem }}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}

	var getSingleStatus = function(idScenario, idPost){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/posts/"+idPost).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var addLikeToPost = function(idScenario, idPost){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/likes").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendCommentToPost = function(idScenario, idPost, comment){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/comments",comment).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendMetaCommentToPost = function(idScenario, idPost, comment){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/metaComments",comment).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendEvent = function(idScenario, event){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/events",event).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var postIssue = function(issue){
		var s = $q.defer();

		$http.post("/api/v1/report",issue).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}


// var onSuccessGetScenario = function(response){
// console.log("Getting data scenario: "+response.data);
// scenarios = response.data;
// return scenarios;
// }

// var onErrorGetScenario = function(reason){
// console.log("Error retreaving scenario: "+reason);
// }
	
	/* inizio GESTIONE COMPITI ---------------------------------- */
	var addMissionToScenario = function(idScenario, mission){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/mission", mission).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var deleteMissionToScenario = function(idScenario){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/mission").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var addMissionToCharacter = function(idScenario, idCharacter, mission){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/mission", mission).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var deleteMissionToCharacter = function(idScenario, idCharacter){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/mission").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var postTrustedMediaMetadata = function(idScenario, idMedia, metadata){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta", metadata).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getTrustedMediaMetadata = function(idScenario){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/media/trusted/meta").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var postTrustedMediaMetadata = function(idScenario, idMedia, metadata){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta", metadata).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getTrustedMediaMetadata = function(idScenario){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/media/trusted/meta").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getMyMissions = function(){
		var s = $q.defer();

		$http.get("/api/v1/missions").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getMyDraft = function(preview){
		var s = $q.defer();
		var url;
		if(preview)
			url="/api/v1/draft?preview=true";
		else
			url="/api/v1/draft";
		$http.get(url).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	
	
	var deleteTrustedMedia = function(idScenario, idMedia){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/trustedMedia/"+idMedia).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var deleteMedia = function(idMedia, postId){
		var s = $q.defer();
		var url;
		if(!postId)
			url = "/api/v1/me/media/"+idMedia;
		else
			url = "/api/v1/me/media/"+idMedia+"?postId="+postId;
				
		$http.delete(url).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
//	var getMyMissions = function(nPag, nItem, orderByDeliveryDate, onlyActive){
//		var s = $q.defer();
//
//		$http.get("/api/v1/missions", {
//			params: {"nPag": nPag, "nItem": nItem, "orderByDeliveryDate": orderByDeliveryDate, 
//						"onlyActive": onlyActive }}).then(
//					function(response){
//						s.resolve(response.data);
//					},
//					function(reason){
//						s.reject(reason);
//					}
//			);
//
//		return s.promise;
//	}
	/* fine GESTIONE COMPITI ---------------------------------- */
	
	return {
		postRegister: postRegister,
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
		removeUserFromCharacter: removeUserFromCharacter,
		getPagedTeacherByRegex : getPagedTeacherByRegex,
		/* Gesitone post */
		sendStatus: sendStatus,
		updateStatus: updateStatus,
		deletePost: deletePost,
		getPagedPosts : getPagedPosts,
		getSingleStatus: getSingleStatus,
		addLikeToPost: addLikeToPost,
		sendCommentToPost: sendCommentToPost,
		sendMetaCommentToPost: sendMetaCommentToPost,
		sendEvent: sendEvent,
		addMissionToScenario: addMissionToScenario,
		addMissionToCharacter: addMissionToCharacter,
		deleteMissionToScenario: deleteMissionToScenario,
		deleteMissionToCharacter: deleteMissionToCharacter,
		postIssue: postIssue,
		getPagedStudents: getPagedStudents,
		getPagedTeachers: getPagedTeachers,
		getPagedScenarios : getPagedScenarios,
		getUsersByFirstNameAndLastName : getUsersByFirstNameAndLastName,
		updateEvent: updateEvent,
		getPagedExceptions: getPagedExceptions,
		getPagedLogs : getPagedLogs,
		postTrustedMediaMetadata: postTrustedMediaMetadata,
		getTrustedMediaMetadata: getTrustedMediaMetadata,
		deleteTrustedMedia: deleteTrustedMedia,
		getMyMissions : getMyMissions,
		getMyDraft : getMyDraft,
		deleteMedia : deleteMedia
		
	}



}]);

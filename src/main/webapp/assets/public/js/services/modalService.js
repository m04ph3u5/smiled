angular.module('smiled.application').factory('modalService', ['$modal', 'apiService', function modalService($modal, apiService){
	
		var scenario = {
				
		};
		
		var post = {};
		var scenarioMap = "";
		var startDate = {};
		var endDate = {};
		var charName;
		var scenario = {};
		
		
		var modalInstanceCreateScen;
		var modalInstanceDeleteScen;
		var modalInstanceSetDate;
		var modalInstanceOpenMap;
		var modalInstanceOpenMapForPost;
		var modalInstanceOldCharacterChangeOnComment;
		var modalInstanceSetHistoryDate;
		var modalInstanceCreateMission;
		
		var optionSetHistoryDate = {
				templateUrl: 'assets/private/partials/customDatePickerTemplate.html',
				controller: 'customDatePickerTemplateCtrl',
				controllerAs: 'customDatePickerTemplate',
				size: 'sm',
				resolve : {
					startDate : function(){
						return startDate;
					},
					endDate : function(){
						return endDate;
					},
					post : function(){
						return post;
					}
				}
		}
		
		var optionsCreateScen = {
				templateUrl:'assets/private/partials/createScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
				size: 'lg'  //TODO non funziona
				
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
					scen : function(){
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
					scen : function(){
						return scenario;
					},
					start : function(){
						return false;
					}
				}
		};
		
		var optionsOpenMap = {
				templateUrl: 'assets/private/partials/openMap.html',
				controller: 'openMapCtrl',
				controllerAs: 'openMap',
				size: "lg",
				resolve: {
					post : function(){
						return post;
					},
					scenarioMap : function(){
						return scenarioMap;
					}
				}
		}
		
		var optionsOpenMapForPost = {
				templateUrl: 'assets/private/partials/openMapForPost.html',
				controller: 'openMapForPostCtrl',
				controllerAs: 'openMapForPost',
				size: "lg",
				resolve: {
					post : function(){
						return post;
					},
					scenarioMap : function(){
						return scenarioMap;
					}
				}
		}
		
		var optionsOldCharacterChangeOnComment = {
				templateUrl: 'assets/private/partials/oldCharacterChangeOnComment.html',
				controller: 'oldCharacterChangeOnCommentCtrl',
				controllerAs: 'oldCharacterChangeOnComment',
				size: "sm",
				resolve: {
					charName : function(){
						return charName;
					}
				}
		}
		var optionsCreateMission = {
				templateUrl:'assets/private/partials/createMission.html',
				controller: 'dialogMissionCtrl',
				controllerAs: 'dialogMission',
				size: 'lg',
				resolve : {
					scenarioReferenceList : function(){
						return scenarioReferenceList;
					},
					scenario : function(){
						return scenario;
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
			console.log("DELETE SCENARIO");
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
		
		//first serve a specificare (nel caso di set date) se si cerca di modificare la data di inizio o di fine dello scenario

		var showPopUpSetDate = function(s, first){
			scenario = s;
			if(first==true)
				modalInstanceSetDate = $modal.open(optionsSetDateStart);
			else
				modalInstanceSetDate = $modal.open(optionsSetDateEnd);
			return modalInstanceSetDate.result;
		}
		
		var closeModalSetDate = function(){
			modalInstanceSetDate.close();
		}
		
		var showModalOpenMap = function(p, sMap){
			post = p;
			scenarioMap = sMap;
			modalInstanceOpenMap = $modal.open(optionsOpenMap);
			return modalInstanceOpenMap.result;
		}
	
		var closeModalOpenMap = function(){
			modalInstanceOpenMap.close();
		}
		
		var showModalOpenMapForPost = function(p, sMap){
			post = p;
			scenarioMap = sMap;
			modalInstanceOpenMapForPost = $modal.open(optionsOpenMapForPost);
			return modalInstanceOpenMapForPost.result;
		}
	
		var closeModalOpenMapForPost = function(){
			modalInstanceOpenMapForPost.close();
		}
		
		var showModalOldCharacterChangeOnComment = function(characterName){
			charName = characterName;
			modalInstanceOldCharacterChangeOnComment = $modal.open(optionsOldCharacterChangeOnComment);
			return modalInstanceOldCharacterChangeOnComment.result;
		}
	
		var closeModalOldCharacterChangeOnComment = function(){
			modalInstanceOldCharacterChangeOnComment.close();
		}
		
		
		var showModalSetHistoryDate = function(sDate, eDate, p){
			startDate = sDate;
			endDate = eDate;
			post = p;
			modalInstanceSetHistoryDate = $modal.open(optionSetHistoryDate);
			return modalInstanceSetHistoryDate.result;
		}
	
		var closeModalSetHistoryDate = function(){
			modalInstanceSetHistoryDate.close();
		}
		
		var showModalCreateMission = function(){
			modalInstanceCreateMission = $modal.open(optionsCreateMission);
			return modalInstanceCreateMission.result;
			
		}
		
		var closeModalCreateMission = function(){
			modalInstanceCreateMission.close();
		}
		
		var createMission = function(mission){
			console.log("CREATE MISSION -----------------------");
			 //BOZZA
			 s = apiService.createMission(mission.scenId,mission);
			 return s; 
			 
		}
		
		return {
			createScenario : createScenario,
			deleteScenario : deleteScenario,
			showModalCreateScen : showModalCreateScen,
			closeModalCreateScen: closeModalCreateScen,
			showModalDeleteScen : showModalDeleteScen,
			closeModalDeleteScen: closeModalDeleteScen,
			getScenToDelete : getScenToDelete,
			showPopUpSetDate : showPopUpSetDate,
			closeModalSetDate : closeModalSetDate,
			showModalOpenMap : showModalOpenMap,
			closeModalOpenMap : closeModalOpenMap,
			showModalOpenMapForPost: showModalOpenMapForPost,
			closeModalOpenMapForPost: closeModalOpenMapForPost,
			showModalOldCharacterChangeOnComment: showModalOldCharacterChangeOnComment,
			closeModalOldCharacterChangeOnComment: closeModalOldCharacterChangeOnComment,
			showModalSetHistoryDate: showModalSetHistoryDate,
			closeModalSetHistoryDate: closeModalSetHistoryDate,
			createMission : createMission,
			showModalCreateMission : showModalCreateMission,
			closeModalCreateMission: closeModalCreateMission,
		}
}]);





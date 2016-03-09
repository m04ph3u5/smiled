angular.module("smiled.application").directive("insertMission", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService', '$timeout',
                                     function(CONSTANTS, apiService, Upload, $q, modalService, $timeout){
	return {
		templateUrl: "assets/private/partials/insert-mission-template.html",
		scope : {
			idScenarioVeloce: "@?",  //mi serve per visualizzare la cover dello scenario
			scenario: "=",
			character: "=?",
			isModerator: "=",
			isCreator: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.dirty = false;
			self.realDateFormat = CONSTANTS.realDateFormatWithHour;
			
			if(self.isModerator || self.isCreator){
				self.formMission = false;
			}else{
				self.formMission = true;
			}
			
			
			self.openFormMission = function(){
				self.formMission = true;
			}
			
			self.closeFormMission = function(){
				self.formMission = false;
			}
			
			if(self.character){
				if(self.character.mission){
					self.mission= self.character.mission;
					self.newMission = angular.copy(self.mission);
					
				}else{
					self.mission=null;
					self.newMission = null;
				}
				self.urlCover = "url('"+CONSTANTS.urlCharacterCover(self.scenario.id,self.character.id)+"'),url('assets/public/img/icon/pg.png')";
			}else{
				self.urlCover = "url('"+CONSTANTS.urlScenarioCover(self.idScenarioVeloce)+"'),url('assets/public/img/icon/ic_scen.png')";
				
				if(self.scenario.mission){
					self.mission= self.scenario.mission;
					self.newMission = angular.copy(self.mission);
				}else{
					self.mission=null;
					self.newMission=null;
				}
					
			}
			
			
			self.saveMission = function(){
				if(self.character){
					
					apiService.addMissionToCharacter(self.scenario.id, self.character.id, self.newMission).then(
							function(data){
								self.character = data;
								self.mission = self.character.mission;
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							},
							function(reason){
								console.log("error in add mission to character");
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							}
					);
				}else{
					
					apiService.addMissionToScenario(self.scenario.id, self.newMission).then(
							function(data){
								self.scenario = data;
								self.mission = self.scenario.mission;
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							},
							function(reason){
								console.log("error in add mission to scenario");
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							}
					);
				}
				
			}
			
			self.deleteModifyMission = function(){
				self.newMission = angular.copy(self.mission);
				$timeout(function(){self.dirty=false;},200);
				
			}
			
			self.deleteMission = function(){
				if(self.character){
					apiService.deleteMissionToCharacter(self.scenario.id, self.character.id).then(
							function(data){
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							},
							function(reason){
								console.log("error in delete mission to character");
								self.newMission = null;
								self.dirty=false;
							}
					);
				}else{
					apiService.deleteMissionToScenario(self.scenario.id).then(
							function(data){
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							},
							function(reason){
								console.log("error in delete mission to scenario");
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							}
					);
				}
				
			}
			


		}],
		controllerAs: "insertMission",
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('insertMission.newMission.title', function(newVal, oldVal){
				if(newVal && newVal!=oldVal)
					ctrl.dirty=true;
			});
			
			scope.$watch('insertMission.newMission.description', function(newVal, oldVal){
				if(newVal && newVal!=oldVal)
					ctrl.dirty=true;
			});
			
			scope.$watch('insertMission.scenario.mission.title', function(newVal, oldVal){
				if(newVal && newVal!=oldVal && !ctrl.character){
					ctrl.mission.title = newVal;
					ctrl.newMission.title = newVal;
				}
			});
			
			scope.$watch('insertMission.scenario.mission.description', function(newVal, oldVal){
				if(newVal && newVal!=oldVal && !ctrl.character){
					ctrl.mission.description = newVal;
					ctrl.newMission.description = newVal;
				}
			});
		}
	}
}]);


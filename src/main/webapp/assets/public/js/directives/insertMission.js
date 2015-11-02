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
					console.log("saving mission character...");
					console.log(self.newMission);
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
					console.log("saving mission scenario...");
					console.log(self.mission);
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
				console.log("delete mission");
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
		}
	}
}]);


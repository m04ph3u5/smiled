angular.module("smiled.application").directive("insertMission", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService',
                                     function(CONSTANTS, apiService, Upload, $q, modalService){
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
			self.realDateFormat = CONSTANTS.realDateFormatWithHour;
			if(self.character){
				if(self.character.mission){
					self.mission= self.character.mission;
					
				}else
					self.mission={};
				self.urlCover = "url('"+CONSTANTS.urlCharacterCover(self.scenario.id,self.character.id)+"'),url('assets/public/img/icon/pg.png')";
			}else{
				self.urlCover = "url('"+CONSTANTS.urlScenarioCover(self.idScenarioVeloce)+"'),url('assets/public/img/icon/ic_scen.png')";
				
				if(self.scenario.mission){
					self.mission= self.scenario.mission;
				}else
					self.mission={};
			}
			
			
			self.saveMission = function(){
				if(self.character){
					console.log("saving mission character...");
					console.log(self.mission);
					apiService.addMissionToCharacter(self.scenario.id, self.character.id, self.mission).then(
							function(data){
								self.character = data;
							},
							function(reason){
								console.log("error in add mission to character");
							}
					);
				}else{
					console.log("saving mission scenario...");
					console.log(self.mission);
					apiService.addMissionToScenario(self.scenario.id, self.mission).then(
							function(data){
								self.scenario = data;
							},
							function(reason){
								console.log("error in add mission to scenario");
							}
					);
				}
				
			}
			


		}],
		controllerAs: "insertMission",
		link : function(scope,elem,attrs,ctrl){

		}
	}
}]);


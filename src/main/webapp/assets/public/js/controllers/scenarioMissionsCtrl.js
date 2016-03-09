angular.module('smiled.application').controller('scenarioMissionsCtrl', ['$stateParams','apiService','$scope', 'CONSTANTS',
                                                                         
		 function scenarioMissionsCtrl($stateParams, apiService, $scope, CONSTANTS){
	
			 var self = this;
			 
			 var myId = $scope.scenario.loggedUser.id;
			 self.myCharacter = null;
			 self.characters = [];
		
			var onStartUp = function(){
				apiService.getScenario($stateParams.id).then(
						function(data){
	
							$scope.scenario.scen = data;
							var date = new Date();
							$scope.scenario.scen.cover = CONSTANTS.urlScenarioCover($scope.scenario.scen.id)+"?"+date.toString();
						},
						function(reason){
							console.log("error in find scenario");
						}
				);
				
				if($scope.scenario.isModerator || $scope.scenario.isCreator || $scope.scenario.loggedUser.role.authority=="ROLE_ADMIN"){
					apiService.getAllCharactersFromScen($stateParams.id).then(
							function(data){
								self.characters = data;						
							},
							function(reason){
								console.log("error in find all characters");
							}
					);
				}else{
					if($scope.scenario.scen.characters){
						for(var i=0; i< $scope.scenario.scen.characters.length; i++){
							if($scope.scenario.scen.characters[i].userId == myId){
								self.myCharacter = $scope.scenario.scen.characters[i];
							
								break;
							}
						}
					}
					if(self.myCharacter){
						apiService.getCharacter($stateParams.id, self.myCharacter.id).then(
								function(data){
									
									self.characters.push(data);
								},
								function(reason){
									console.log("error in find my character");
								}
						);
					}
					
				}
				
				
			}
			
			var reloadCharacterMission = function(idS, idC){
				apiService.getCharacter(idS, idC).then(
						function(data){
							if(self.characters){
								for(var i = 0; i< self.characters.length; i++){
									if(self.characters[i].id == data.id){
										self.characters[i] = data;
									}
								}
							}
						},
						function(reason){
							console.log("error in reload character mission");
						}
				);
			}
			
			var reloadGlobalMission = function(idS){
				apiService.getScenario(idS).then(
						function(data){
							$scope.scenario.scen = data;
							var date = new Date();
							$scope.scenario.scen.cover = CONSTANTS.urlScenarioCover(idS)+"?"+date.toString();
						},
						function(reason){
							console.log("error in reload global mission");
						}
				);
			}
			
			onStartUp();
			
			var updateGlobalMission = $scope.$on('notification.updateGlobalMission', function (event, data) {
				console.log("event!!!!!!!!!");
				reloadGlobalMission(data.idS);
		    });
			
			var updateCharacterMission = $scope.$on('notification.updateCharacterMission', function (event, data) {
		       reloadCharacterMission(data.idS, data.idC);
		    });
		    
		    $scope.$on("$destroy", function() {
		    	updateCharacterMission();
		    	updateGlobalMission();
		        
		    });
	
}]);
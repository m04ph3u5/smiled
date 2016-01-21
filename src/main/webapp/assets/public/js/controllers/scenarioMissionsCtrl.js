angular.module('smiled.application').controller('scenarioMissionsCtrl', ['$stateParams','apiService','$scope', 'CONSTANTS',
                                                                         
		 function scenarioMissionsCtrl($stateParams, apiService, $scope, CONSTANTS){
	
			 var self = this;
			 console.log("scenarioMissionsCtrl---------------");
			 
			 
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
				
				if($scope.scenario.isModerator || $scope.scenario.isCreator){
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
								console.log("my character----->");
								console.log(self.myCharacter);
								break;
							}
						}
					}
					if(self.myCharacter){
						apiService.getCharacter($stateParams.id, self.myCharacter.id).then(
								function(data){
									console.log("personaggio mio prelevato");
									console.log(data);
									self.characters.push(data);
								},
								function(reason){
									console.log("error in find my character");
								}
						);
					}
					
				}
				
				
			}
			
			
			onStartUp();
	
}]);
angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'loggedUser', 'CONSTANTS', 'apiService',
                                                function scenarioCtrl(scenario, loggedUser, CONSTANTS, apiService){
	
	
	console.log("controller");
	
	var self = this;
	self.scen = scenario;
	self.loggedUser = loggedUser;
    var date = new Date();
	self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id)+"?"+date.toString();
	self.isModerator = false;
	self.isCreator = false;
	self.hasCharacter = false;
	self.currentCharacter = {};
	self.showBoxEvent = false;
	self.mission = {};
//	self.myMissions = [];
//	
//
//	var findMyMissions = function(){
//		apiService.getMissionsInScenario(self.scen.id).then(
//				function(data){
//					myMissions = data;
//				},
//				function(reason){
//					console.log("error in find my missions");
//				}
//		);
//	}
	
	self.openBoxEvent = function(){
		self.showBoxEvent = !self.showBoxEvent;
	}
	
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	var onStartup = function(){

		if(self.scen.teacherCreator.id==loggedUser.id){
			console.log("isCreator");
			self.isCreator=true;
			self.isModerator=true;
	
		}
		
		if(!self.isModerator){
			if(self.scen.collaborators){
				for(var i=0; i<self.scen.collaborators.length; i++){
					if(self.scen.collaborators[i].id==loggedUser.id){
						console.log("isModerator");
						self.isModerator=true;
						break;
					}
				}
			}
		}
		
		if(self.scen.status=="ACTIVE"){
			if(loggedUser.openScenarios!=null)
				for(var i=0; i<loggedUser.openScenarios.length; i++){
					if(loggedUser.openScenarios[i].id==self.scen.id){
						if(loggedUser.openScenarios[i].myCharacterId){
							var date = new Date();
							self.hasCharacter=true;
							self.currentCharacter.id = loggedUser.openScenarios[i].myCharacterId;
							self.currentCharacter.name = loggedUser.openScenarios[i].myCharacterName;
							self.currentCharacter.cover = CONSTANTS.urlCharacterCover(self.scen.id, self.currentCharacter.id)+"?"+date.toString();
						}
					}
				}
			//if(!self.isModerator && !self.isCreator)
				//findMyMissions();
		}
	}
	
	self.createMission = function(){
		console.log("create mission-----> "+ self.mission);
		console.log(self.mission.title);
		console.log(self.mission.description);
		console.log(self.mission.deliveryDate);
		console.log(self.mission.studentId);
		console.log(self.mission.studentId);
		apiService.createMission(self.scen.id, self.mission).then(
				function(data){
					self.mission.title="";
					self.mission.description="";
					self.mission.deliverydate=null;
					self.mission.studentId="";
				},
				function(reason){
					console.log("error in creation of new mission");
				}
		);
	}
	
	onStartup();

}]);
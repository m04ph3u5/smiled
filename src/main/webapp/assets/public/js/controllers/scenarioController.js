angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'loggedUser', 'CONSTANTS', 'apiService', 'userService','modalService', '$location','$anchorScroll','Upload',
                                                function scenarioCtrl(scenario, loggedUser, CONSTANTS, apiService, userService, modalService, $location, $anchorScroll, Upload){
	
	
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
	self.showBoxCharacters = false;
	self.showBoxAttendees = false;
	self.showBoxCollaborators = false;
	self.showBoxInfo = true;
	
	
	self.openBoxEvent = function(){
		self.showBoxEvent = !self.showBoxEvent;
	}
	
	self.openBoxCharacters = function(){
		self.showBoxCharacters = true;
	}
	self.openBoxAttendees = function(){
		self.showBoxAttendees = true;
	}
	self.openBoxCollaborators = function(){
		self.showBoxCollaborators = true;
	}
	self.openBoxInfo = function(){
		self.showBoxInfo = true;
	}
	
	self.closeBoxInfo = function(){
		self.showBoxInfo = false;
	}
	
	self.closeBoxCharacters = function(){
		self.showBoxCharacters = false;
	}
	self.closeBoxAttendees = function(){
		self.showBoxAttendees = false;
	}
	self.closeBoxCollaborators = function(){
		self.showBoxCollaborators = false;
	}
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	var onStartup = function(){

		if(self.scen.teacherCreator.id==loggedUser.id){
			console.log("isCreator");
			self.isCreator=true;
			self.isModerator=true;	
			console.log(self.scen);
		}
		userService.setScenarioId(self.scen.id);

		
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
		
		}
	}
	
	self.uploadCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: CONSTANTS.urlScenarioCover(self.scen.id),
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	            var date = new Date();
	            self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id)+"?"+date.toString() ;
	        });
		}
	}
	
	onStartup();
	
	self.goToBody = function(){
		$location.hash("body-content");
	    $anchorScroll();
	}

}]);
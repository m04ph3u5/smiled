angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'loggedUser', 'CONSTANTS', 'apiService', 'userService','modalService', '$location','$anchorScroll','Upload','notifyService','$scope','$interval',
                                                function scenarioCtrl(scenario, loggedUser, CONSTANTS, apiService, userService, modalService, $location, $anchorScroll, Upload, notifyService, $scope, $interval){
	
	
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
	self.numNewPost = 0;
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	self.firstNameAndSecondName = function(first, second){
		return first + " "+ second;
	}
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
	
	self.incrementNumNewPost = function(){	
		
		self.numNewPost++;
		
	}
	
	var resetNumNewPost = function(){
		self.numNewPost = 0;
	}
	
	
	self.showNewPosts = function(){		
		notifyService.reloadList(); //dico al notifyService di avvertire scenarioPostController che ci sono nuovi post da scaricare
		resetNumNewPost();
		$location.hash("top");
	    $anchorScroll();
	    $location.url($location.path());
	}
	
	var reloadMe = function(){
		
		userService.getMe().then(function(data){
			self.loggedUser =data;
			onStartup();
		}, function (reason){
			consolelog("error");
		});
			
		
	}
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	
	var onStartup = function(){
		
		if(self.scen.teacherCreator.id==self.loggedUser.id){
		
			self.isCreator=true;
			self.isModerator=true;	
			
		}
		userService.setScenarioId(self.scen.id);

		
		if(!self.isModerator){
			if(self.scen.collaborators){
				for(var i=0; i<self.scen.collaborators.length; i++){
					if(self.scen.collaborators[i].id==self.loggedUser.id){
						
						self.isModerator=true;
						break;
					}
				}
			}
		}
		
		if(self.scen.status=="ACTIVE"){
			if(self.loggedUser.openScenarios!=null)
				for(var i=0; i<self.loggedUser.openScenarios.length; i++){
					if(self.loggedUser.openScenarios[i].id==self.scen.id){
						if(self.loggedUser.openScenarios[i].myCharacterId){
							var date = new Date();
							self.hasCharacter=true;
							self.currentCharacter.id = self.loggedUser.openScenarios[i].myCharacterId;
							self.currentCharacter.name = self.loggedUser.openScenarios[i].myCharacterName;
							self.currentCharacter.cover = CONSTANTS.urlCharacterCover(self.scen.id, self.currentCharacter.id)+"?"+date.toString();
						}else{
							self.hasCharacter=false;
							self.currentCharacter={};
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
//	        })
	        .success(function (data, status, headers, config) {
	            var date = new Date();
	            self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id)+"?"+date.toString() ;
	        });
		}
	}
	
	
	
	self.goToBody = function(){
		$location.hash("body-content");
	    $anchorScroll();
	    $location.url($location.path());
	}
	
	var newPostListener = $scope.$on('notification.newPostEvent', function () {
        self.incrementNumNewPost();
        $scope.$applyAsync();
       
    })
  
	$scope.$on("$destroy", function() {
        notifyService.resetObserverAssociation();
		newPostListener();
    });
	
	
	notifyService.registerObserverAssociation(reloadMe);
	onStartup();

}]);
angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','userService', '$scope','$interval','apiService', 'CONSTANTS',
   function dashboardCtrl(loggedUser,modalService,userService,$scope,$interval,apiService, CONSTANTS){
	
	var self = this;
	var originalUser = angular.copy(loggedUser);
	
	
	self.missionDateFormatDay = CONSTANTS.realDateFormatOnlyDay;
	self.missionDateFormatMonth = CONSTANTS.realDateFormatOnlyMonth;
	
	if(loggedUser.role.authority=="ROLE_USER"){
		self.numScenariosToShow = 5;
		apiService.getMyMissions().then(
				function(data){
					self.myMissions = data;
				},
				function(reason){
					console.log("Error retrieve missions");
					console.log(reason);
				}
		);
	}
	else
		self.numScenariosToShow = 4;
	
	
	apiService.getMyDraft(true).then(
			function(data){
				self.myDraft = data;
				
				for(var i=0;self.myDraft && i<self.myDraft.length;i++){
					if(self.myDraft[i].character){
						self.myDraft[i].character.cover = CONSTANTS.urlCharacterCover(self.myDraft[i].scenarioId, self.myDraft[i].character.id);
					}
					for(var j=0; loggedUser.openScenarios && j<loggedUser.openScenarios.length; j++){
						if(self.myDraft[i].scenarioId==loggedUser.openScenarios[j].id){
							self.myDraft[i].scenarioName = loggedUser.openScenarios[j].name; 
						}
					}
				}
				console.log("DRAFT");
				console.log(self.myDraft);
			},
			function(reason){
				
			}
	);

	//self.user = {};
	
//	userService.getUser().then(
//		function(data){
//			self.user=data;
//			console.log(self.user);
//		}
//	);
	console.log("dashboard");
	console.log(loggedUser);
	
	
	
	self.user = loggedUser;
	self.scenariosToShow = new Array();
	
	self.studentsList = loggedUser.students;
	self.showCollCard = [false,false,false,false,false,false];
	self.selectedUserID = null;
	self.myCharacters = new Array()
	
	self.tab = new Array();
	self.showPopUpCreationScenario = function (){
		modalService.showModalCreateScen();
	};
	
	// -> Fisher–Yates shuffle algorithm
	var shuffleArray = function(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle
	  while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}
	
	function compareDate (a, b){
		
		if (a.creationDate > b.creationDate)
			return -1;
		if(a.creationDate < b.creationDate)
			return 1;
		else return 0;
	}
	
	
	var createArrayOfScenariosToShow = function(){
		var tmp = new Array();
		if (self.user.openScenarios != null && self.user.creatingScenarios != null){
			for(var i=0; i<self.user.openScenarios.length; i++){
				self.user.openScenarios[i].isOpen=true;
			}
			for(var i=0; i<self.user.creatingScenarios.length; i++){
				self.user.creatingScenarios[i].isOpen=false;
			}
			tmp = angular.copy(self.user.openScenarios).concat(angular.copy(self.user.creatingScenarios));
			
		}else if(self.user.openScenarios != null && self.user.creatingScenarios == null){
			self.myCharacters = [];
			for(var i=0; i<self.user.openScenarios.length; i++){
				self.user.openScenarios[i].isOpen=true;
				console.log("createArrayOfScenariosToShow IN");
				console.log(self.user.openScenarios[i]);
				if(self.user.openScenarios[i].myCharacterId){
					var character = {};
					character.scenarioId = self.user.openScenarios[i].id;
					character.id = self.user.openScenarios[i].myCharacterId;
					character.name = self.user.openScenarios[i].myCharacterName;
					character.cover = CONSTANTS.urlCharacterCover(self.user.openScenarios[i].id, self.user.openScenarios[i].myCharacterId);
					self.myCharacters.push(character);
				}
			}
			tmp = angular.copy(self.user.openScenarios);
		}
		else if(self.user.openScenarios == null && self.user.creatingScenarios != null){
			for(var i=0; i<self.user.creatingScenarios.length; i++){
				self.user.creatingScenarios[i].isOpen=false;
			}
			tmp = angular.copy(self.user.creatingScenarios);
		}
		
		tmp.sort(compareDate);
		
		tmp.splice(self.numScenariosToShow, (tmp.length - self.numScenariosToShow));
		console.log(angular.copy(tmp));
		self.scenariosToShow = tmp;
	}
	
	var getLoggedUser = function(){
		userService.getMe().then(
	
			function(data){
				if(!angular.equals(originalUser, data)){
					self.user=data;
					originalUser = angular.copy(self.user);
					createArrayOfScenariosToShow();
					if(data.students)
						shuffleArray(data.students);
					if(data.colleagues)
						shuffleArray(data.colleagues);
					if(self.myCharacters)
						shuffleArray(self.myCharacters);
				}
			}, function(reason){
				console.log("errore");
			}
	    );
	}
	
	var interval;
	var intervalSet = false;
	var startUpdateUser = function(){
		if(!intervalSet){
			interval = $interval(getLoggedUser,20000);
			intervalSet=true;
		}
	}
	
	var stopUpdateUser = function(){
		if(intervalSet){
			$interval.cancel(interval);
			intervalSet=false;
		}
	}
	
    startUpdateUser();
    createArrayOfScenariosToShow();
	
	$scope.$on('$destroy', function() {
      	stopUpdateUser();
	});
	
	self.scenarioChanged  = function(){
		//aggiorna la lista degli studenti e ci inserisce solo quelli che fanno parte di quello scenario
		
	}
	self.studentChanged  = function(){
		//aggiorna la lista degli scenari e ci inserisce solo quelli in cui lo studente è iscritto
		
	}	
	
	self.openCollCard= function(userID,index){
		self.selectedUserID = userID;
	
		for(i=0; i<6; i++){
			if(i!=index) self.showCollCard[i] = false;
			self.tab[i]=i+1;
		}
		self.showCollCard[index] = !self.showCollCard[index];
		if(self.showCollCard[index]){
			self.tab[index]=0;
		}
	}
	

	
	
}]);

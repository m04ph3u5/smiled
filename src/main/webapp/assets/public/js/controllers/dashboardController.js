angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','userService', '$scope','$interval','apiService',
   function dashboardCtrl(loggedUser,modalService,userService,$scope,$interval,apiService){
	
	var self = this;
	self.numScenariosToShow = 4;
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
			tmp = self.user.openScenarios.concat(self.user.creatingScenarios);
			
		}else if(self.user.openScenarios != null && self.user.creatingScenarios == null){
			for(var i=0; i<self.user.openScenarios.length; i++){
				self.user.openScenarios[i].isOpen=true;
			}
			tmp = self.user.openScenarios;
		}
		else if(self.user.openScenarios == null && self.user.creatingScenarios != null){
			for(var i=0; i<self.user.creatingScenarios.length; i++){
				self.user.creatingScenarios[i].isOpen=false;
			}
			tmp = self.user.creatingScenarios;
		}
		
		tmp.sort(compareDate);
		
		tmp.splice(self.numScenariosToShow, (tmp.length - self.numScenariosToShow));
		console.log(angular.copy(tmp));
		self.scenariosToShow = tmp;
	}
	
	var getLoggedUser = function(){
		userService.getMe().then(
	
			function(data){
				self.user=data;
				createArrayOfScenariosToShow();
				if(data.students)
					shuffleArray(data.students);
				if(data.colleagues)
					shuffleArray(data.colleagues);
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

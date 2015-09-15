angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','userService', '$scope','$interval',
   function dashboardCtrl(loggedUser,modalService,userService,$scope,$interval){
	
	var self = this;
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
	
	var getLoggedUser = function(){
		userService.getMe().then(
	
			function(data){
				self.user=data;
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
	
	$scope.$on('$destroy', function() {
      	stopUpdateUser();
	});

	
	/*
	self.missionList = apiService.getMyMissions(0, 20, true, true);
	self.createMission = function(){
		var newMission = {
				'student': "", //mettere reference vuota
				'teacher':"", //mettere reference al prof che crea
				'title': self.missionTitle, //prenderlo dalla vista
				'description': "",
				'scenarioId': "", //prenderlo dalla vista
				'creationDate': "", //ora
				'lastChangeDate': "", //mettere valore vuoto
				'deliveryDate': "" //prenderlo dalla vista
		}
	}
	*/
		
	
}]);
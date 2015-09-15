angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','apiService',
   function dashboardCtrl(loggedUser,modalService,apiService){
	
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
	self.createMission = function(){
		console.log("create mission-----> "+ self.mission);
		console.log(self.mission.title);
		console.log(self.mission.deliveryDate);
		console.log(self.mission.studentId);
//		apiService.createMission(self.scen.id, self.mission).then(
//				function(data){
//					self.mission.title="";
//					self.mission.description="";
//					self.mission.deliverydate=null;
//					self.mission.studentId="";
//				},
//				function(reason){
//					console.log("error in creation of new mission");
//				}
//		);
	}	
	
}]);
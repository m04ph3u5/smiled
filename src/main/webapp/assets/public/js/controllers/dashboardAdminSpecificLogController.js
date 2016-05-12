angular.module('smiled.application').controller('dashboardAdminSpecificLogCtrl' ,['apiService', 'userService', 'CONSTANTS','$stateParams','$state',
   function dashboardAdminSpecificLogCtrl(apiService, userService, CONSTANTS, $stateParams, $state){
	
	var self = this;
	
	var nItemDefault=20;
	var nPagDefault=0;
	var maxItemDefault=20;
	self.nItemLogs=nItemDefault;
	
	self.nPagLogs=nPagDefault;
	
	self.myListOfLogs = [];
	self.numLogsFounded=0;
	self.showErrorSearchBy = false;
	self.noMoreLogs = "";
	self.infoStatistics={};
	var firstName, lastName, idUser, idScenario, scenarioName;
	var mapOfScenariosInLog = {};
	var mapOfUsersInLog = {};
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	
	var onStartup = function(){
		
		firstName=$stateParams.firstName;
		lastName=$stateParams.lastName;
		idUser=$stateParams.idUser;
		idScenario=$stateParams.idScenario;
		scenarioName=$stateParams.scenarioName;
		
		if(idUser && ( !firstName || !lastName) && !idScenario){
			whoIsUserAndInfoStatistics();
		}else if(idScenario && !scenarioName){
			if(idUser && ( !firstName || !lastName)){
				whoIsUserAndScenarioAndInfoStatistics();
			}else if(!idUser){
				whoIsScenarioAndInfoStatistics();
			}
			
		}else{
			getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);
		}
	
	}
	

	var getInfoStatistics = function(idUser, idScenario, userFirstName, userLastName, scenarioName){
			
			self.infoStatistics = {};
			if(userFirstName && userLastName)
				self.nameOfUser = userFirstName+" "+userLastName;
			
			self.nameOfScenario=scenarioName;
			
			apiService.getInfoStatistics(idUser, idScenario).then(
	    			function(data){			
	    				self.infoStatistics=data;
	
	    			}, function(reason){
	    				console.log("errore in getInfoStatistics!!!");
	
	    			}
	    	);
	}
	
	var whoIsUserAndScenarioAndInfoStatistics = function(){

		userService.getUser(idUser).then(
				function(data){
					
					firstName = data.firstName;
					lastName = data.lastName;
					whoIsScenarioAndInfoStatistics();
				}, function(reason){
					console.log("errore in getUser");
					$state.go('logged.dashboard.admin.log');
				}
		);
		
	}
	var whoIsUserAndInfoStatistics = function(){

		userService.getUser(idUser).then(
				function(data){
					var ref = {};
					firstName = data.firstName;
					lastName = data.lastName;
					getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);

				}, function(reason){
					console.log("errore in getUser");
					$state.go('logged.dashboard.admin.log');
				}
		);
		
	}
	var whoIsScenarioAndInfoStatistics = function(){

		apiService.getScenario(idScenario).then(
				function(data){
					
					scenarioName = data.name;
					getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);

				}, function(reason){	
					console.log("errore in getScenario");
					$state.go('logged.dashboard.admin.log');
				}
		);
	
	}
	
	/*
	 * INIZIO-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.showTwoCal=false;
	var today = new Date();
	self.dateStartOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
		    "numberOfMonths": 1
	};
	self.dateEndOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
            "numberOfMonths": 1
	};
	
	var weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate()-7);
	self.dateEnd=today;
	self.dateStart=weekAgo;
	/*
	 * FINE-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.typeOfLog="ALL";
	var count = 0;

	
	
	self.toggleShowClose = function(){
		self.showClose = !self.showClose;
	}

	self.getInfoStatistics = function(user){
		
		self.infoStatistics = {};
		self.nameOfUser = user.firstName+" "+user.lastName;
		apiService.getInfoStatistics(user.id, null).then(
    			function(data){
    				console.log("getInfoStatistics done!!!");
    				console.log(data);
    				self.infoStatistics=data;

    			}, function(reason){
    				console.log("errore in getInfoStatistics!!!");

    			}
    	);
	}
	
	self.changeLogsToPrev = function(){
		self.nPagLogs--;
		self.searchLogs();
	}
	self.changeLogsToNext = function(){
		self.nPagLogs++;
		self.searchLogs();
	}
	
	var findScenario = function(l){
		
		var mapOfScenariosInLog = {};
		if(l.scenarioId in mapOfScenariosInLog){
			
			l.nameScenario = mapOfScenariosInLog[l.scenarioId].nameScenario;
			l.creator = mapOfScenariosInLog[l.scenarioId].creator;
			
		}
		else{
			apiService.getScenario(l.scenarioId).then(
					function(data){
						var ref = {};
						ref.nameScenario = data.name;
						ref.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
						
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = data.name;
						l.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
	
					}, function(reason){
						
						var ref = {};
						ref.nameScenario = "nome non disponibile";
						ref.creator = "creatore non disponibile";
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = "nome non disponibile";
						l.creator = "creatore non disponibile";
						
						
					}
			);
		}
	}
	var findUser = function(l){
		
		
		if(l.userId in mapOfUsersInLog){
	
			l.firstName = mapOfUsersInLog[l.userId].firstName;
			l.lastName = mapOfUsersInLog[l.userId].lastName;
			l.email = mapOfUsersInLog[l.userId].email;
			
		}
		else{
			userService.getUser(l.userId).then(
					function(data){
						var ref = {};
						ref.firstName = data.firstName;
						ref.lastName = data.lastName;
						ref.email = data.email;
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = data.firstName;
						l.lastName = data.lastName;
						l.email = data.email;
						
						
					}, function(reason){
						var ref = {};
						ref.firstName = "nome non disponibile";
						ref.lastName = "cognome non disponibile";
						ref.email = "email non disponibile";
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = "nome non disponibile";
						l.lastName = "cognome non disponibile";
						l.email = "email non disponibile";
						
						
					}
			);
		}
	}

	self.searchLogs = function(){
		if(self.nItemLogs>maxItemDefault)
			self.nItemLogs=maxItemDefault;
		var start=null;
		var end = null;
		var type=null;
		console.log("searchLogs");
		console.log(self.typeOfLog);
		type=self.typeOfLog;
		if(type=="ALL")
			type=null;
		if(self.showTwoCal){
			start = self.dateStart;
			end = self.dateEnd;
		}
		apiService.getPagedLogs(start, end, type, self.nPagLogs, self.nItemLogs, idUser, idScenario).then(
    			function(data){
    				self.numLogsFounded= data.totalElements;
    				self.myListOfLogs = data.content;
    				if(self.myListOfLogs.length==0)
    					self.noMoreLogs = "Nessun log trovato in questa pagina";
    				else{
    					self.noMoreLogs = "";
    					for(var i=0; i< self.myListOfLogs.length; i++){
    						if(!idUser)
    							findUser(self.myListOfLogs[i]);
    						findScenario(self.myListOfLogs[i]);
    					}
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numLogsFounded= 0;
    			}
    	);
	}
	
	
	self.showResetLogs = function(){
		if (self.myListOfLogs.length>0 || self.nPagLogs!=nPagDefault || self.nItemLogs!=nItemDefault || self.noMoreLogs!="")
			return true;
		else return false;
	}
	
	
	self.resetLogs = function(){
		self.myListOfLogs = [];
		self.nItemLogs=nItemDefault;
		self.nPagLogs=0;
		self.noMoreLogs = "";
		self.numLogsFounded=0;
		self.showTwoCal=false;
		self.typeOfLog="ALL";
	}
	
	onStartup();
	
}]);

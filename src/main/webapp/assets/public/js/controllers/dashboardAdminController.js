angular.module('smiled.application').controller('dashboardAdminCtrl', ['loggedUser','modalService','apiService','CONSTANTS', '$location','userService','alertingGeneric','$anchorScroll', '$q',
   function dashboardCtrl(loggedUser,modalService,apiService, CONSTANTS, $location, userService, alertingGeneric, $anchorScroll, $q){
	
	var self = this;
	var order=true;
	self.typeOrder="creationDate";
	
	self.user = loggedUser;
	var nItemDefault=20;
	var nPagDefault=0;
	var maxItemDefault=20;
	
	
	self.showClose=true;
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	self.dateFormatBornDate = CONSTANTS.realDateFormatWithoutHour;
	
	self.nItemStudents=nItemDefault;
	self.nItemTeachers=nItemDefault;
	self.nItemExceptions=nItemDefault;
	self.nItemScenarios=nItemDefault;
	self.nItemLogs=nItemDefault;
	self.nItemRegistrationRequests=nItemDefault;
	self.nItemIssues=nItemDefault;
	self.nItemSuggestions=nItemDefault;
	
	self.nPagStudents=nPagDefault;
	self.nPagTeachers=nPagDefault;
	self.nPagExceptions=nPagDefault;
	self.nPagScenarios=nPagDefault;
	self.nPagLogs=nPagDefault;
	self.nPagRegistrationRequests=nPagDefault;
	self.nPagIssues=nPagDefault;
	self.nPagSuggestions=nPagDefault;
	
	
	self.myListOfTeachers = [];
	self.myListOfStudents = [];
	self.myListOfExceptions = [];
	self.myListOfLogs = [];
	self.myListOfScenarios = [];
	self.myListOfUsers = [];
	self.myListOfRegistrationRequests = [];
	self.myListOfSuggestions = [];
	self.myListOfIssues = [];
	
	self.numExceptionsFounded=0;
	self.numLogsFounded=0;
	self.numTeachersFounded=0;
	self.numStudentsFounded=0;
	self.numScenariosFounded=0;
	self.numUsersFounded=0;
	self.numRegistrationRequestsFounded=0;
	self.numIssuesFounded=0;
	self.numSuggestionsFounded=0;
	
	self.showErrorSearchBy = false;
	
	self.noMoreStudents = "";
	self.noMoreTeachers = "";
	self.noMoreScenarios = "";
	self.noMoreUsers = "";
	self.noMoreExceptions = "";
	self.noMoreLogs = "";
	self.noMoreRegistrationRequests = "";
	self.noMoreSuggestions = "";
	self.noMoreissues = "";
	
	
	self.infoStatistics={};
	
	
	var mapOfUsersInLog = {};
	var mapOfScenariosInLog = {};
	
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

	self.whoIsUser = function(l){
		
		
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
	self.whoIsScenario = function(l){
		
		
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
	
	self.toggleShowClose = function(){
		self.showClose = !self.showClose;
	}
	self.calculateCover = function (id){
		return CONSTANTS.urlScenarioCover(id);
	}
	self.changeScenariosToPrev = function(){
		self.nPagScenarios--;
		self.searchScenarios();
	}
	self.changeScenariosToNext = function(){
		
		self.nPagScenarios++;
		
		self.searchScenarios();
	}
	
	self.changeRegistrationRequestsToPrev = function(){
		self.nPagRegistrationRequests--;
		self.searchRegistrationRequests();
	}
	self.changeRegistrationRequestsToNext = function(){
		self.nPagRegistrationRequests++;
		self.searchRegistrationRequests();
	}
	
	self.changeIssuesToPrev = function(){
		self.nPagIssues--;
		self.searchIssues();
	}
	self.changeIssuesToNext = function(){
		self.nPagIssues++;
		self.searchIssues();
	}
	
	self.changeSuggestionsToPrev = function(){
		self.nPagSuggestions--;
		self.searchSuggestions();
	}
	self.changeSuggestionsToNext = function(){
		self.nPagSuggestions++;
		self.searchSuggestions();
	}
	
	self.switchTypeOrder = function(){
		self.searchScenarios();
	}
	self.searchScenarios = function(){
		if(self.nItemScenarios>maxItemDefault)
			self.nItemScenarios=maxItemDefault;
		
		if(self.typeOrder=="creationDate"){
			order = true;
		}else{
			order = false;
		}
		apiService.getPagedScenarios(self.nPagScenarios, self.nItemScenarios, order).then(
    			function(data){
    				self.numScenariosFounded= data.totalElements;
    				self.myListOfScenarios = data.content;
    				if(self.myListOfScenarios.length==0)
    					self.noMoreScenarios = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreScenarios = "";
    			}, function(reason){
    				console.log("errore");
    				self.numScenariosFounded= 0;
    			}
    	);
	}
	
	self.searchIssues = function(){
		if(self.nItemIssues>maxItemDefault)
			self.nItemIssues=maxItemDefault;
		
		
		apiService.getPagedIssues(self.nPagIssues, self.nItemIssues).then(
    			function(data){
    				self.numIssuesFounded= data.totalElements;
    				self.myListOfIssues = data.content;
    				if(self.myListOfIssues.length==0)
    					self.noMoreIssues = "Nessuna segnalazione di errore trovata in questa pagina";
    				else
    					self.noMoreIssues = "";
    			}, function(reason){
    				console.log("errore");
    				self.numIssuesFounded= 0;
    			}
    	);
	}
	
	self.searchSuggestions = function(){
		if(self.nItemSuggestions>maxItemDefault)
			self.nItemSuggestions=maxItemDefault;
		
		
		apiService.getPagedSuggestions(self.nPagSuggestions, self.nItemSuggestions).then(
    			function(data){
    				self.numSuggestionsFounded= data.totalElements;
    				self.myListOfSuggestions = data.content;
    				if(self.myListOfSuggestions.length==0)
    					self.noMoreSuggestions = "Nessuna segnalazione di errore trovata in questa pagina";
    				else
    					self.noMoreSuggestions = "";
    			}, function(reason){
    				console.log("errore");
    				self.numSuggestionsFounded= 0;
    			}
    	);
	}
	
	self.searchRegistrationRequests = function(){
		if(self.nItemRegistrationRequests>maxItemDefault)
			self.nItemRegistrationRequests=maxItemDefault;
		
		apiService.getPagedRegistrationRequests(self.nPagRegistrationRequests, self.nItemRegistrationRequests).then(
    			function(data){
    				self.numRegistrationRequestsFounded= data.totalElements;
    				self.myListOfRegistrationRequests = data.content;
    				if(self.myListOfRegistrationRequests.length==0)
    					self.noMoreRegistrationRequests = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreRegistrationRequests = "";
    			}, function(reason){
    				console.log("errore");
    				self.numRegistrationRequestsFounded= 0;
    			}
    	);
	}
	
	self.changeTeachersToPrev = function(){
		self.nPagTeachers--;
		self.searchTeachers();
	}
	self.changeTeachersToNext = function(){
		self.nPagTeachers++;
		self.searchTeachers();
	}
	
	self.searchTeachers = function(){
		if(self.nItemTeachers>maxItemDefault)
			self.nItemTeachers=maxItemDefault;
		apiService.getPagedTeachers(self.nPagTeachers, self.nItemTeachers).then(
    			function(data){
    				self.numTeachersFounded= data.totalElements;
    				self.myListOfTeachers = data.content;
    				if(self.myListOfTeachers.length==0)
    					self.noMoreTeachers = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreTeachers = "";
    			}, function(reason){
    				console.log("errore");
    				self.numTeachersFounded= 0;
    			}
    	);
	}
	
	
	self.getInfoStatistics = function(idUser, idScenario, userFirstName, userLastName, scenarioName){
		
		self.infoStatistics = {};
		self.nameOfUser = userFirstName+" "+userLastName;
		self.nameOfScenario=scenarioName;
		apiService.getInfoStatistics(idUser, idScenario).then(
    			function(data){
    				console.log("getInfoStatistics done!!!");
    				console.log(data);
    				self.infoStatistics=data;

    			}, function(reason){
    				console.log("errore in getInfoStatistics!!!");

    			}
    	);
	}
	self.searchUsersByFirstNameAndLastName = function(){
		
		if( ( self.firstName==null || self.firstName=="" ) &&
				( self.lastName==null  || self.lastName=="") ) {
			self.showErrorSearchBy = true;
			self.numUsersFounded=0;
			self.myListOfUsers = [];
		}else{
			self.showErrorSearchBy = false;
			apiService.getUsersByFirstNameAndLastName(self.firstName, self.lastName).then(
	    			function(data){
	    				if(data.length>0){
	    					self.numUsersFounded = data.length;
	    					self.myListOfUsers = data;
	    					self.noMoreUsers = "";
	    				}
	    				else{
	    					self.numUsersFounded=0;
		    				self.myListOfUsers = [];
	    					self.noMoreUsers = "Nessun utente trovato";	
	    				}

	    			}, function(reason){
	    				console.log("errore");
	    				self.numUsersFounded=0;
	    				self.myListOfUsers = [];
	    				self.noMoreUsers = "Nessun utente trovato";
	    			
	    			}
	    	);
		}
			
		
	}
	
	self.changeStudentsToPrev = function(){
		self.nPagStudents--;
		self.searchStudents();
	}
	self.changeStudentsToNext = function(){
		self.nPagStudents++;
		self.searchStudents();
	}
	self.searchStudents = function(){
		if(self.nItemStudents>maxItemDefault)
			self.nItemStudents=maxItemDefault;
		apiService.getPagedStudents(self.nPagStudents, self.nItemStudents).then(
    			function(data){
    				self.numStudentsFounded= data.totalElements;
    				self.myListOfStudents = data.content;
    				if(self.myListOfStudents.length==0)
    					self.noMoreStudents = "Nessun utente trovato";	
    				else
    					self.noMoreStudents = "";
    			}, function(reason){
    				console.log("errore");
    				self.numStudentsFounded= 0;
    			}
    	);
	}
	
	
	self.changeExceptionsToPrev = function(){
		self.nPagExceptions--;
		self.searchExceptions();
	}
	self.changeExceptionsToNext = function(){
		self.nPagExceptions++;
		self.searchExceptions();
	}
	self.changeLogsToPrev = function(){
		self.nPagLogs--;
		self.searchLogs();
	}
	self.changeLogsToNext = function(){
		self.nPagLogs++;
		self.searchLogs();
	}
	
	self.searchExceptions = function(){
		if(self.nItemExceptions>maxItemDefault)
			self.nItemExceptions=maxItemDefault;
		apiService.getPagedExceptions(self.nPagExceptions, self.nItemExceptions).then(
    			function(data){
    				self.numExceptionsFounded= data.totalElements;
    				self.myListOfExceptions = data.content;
    				if(self.myListOfExceptions.length==0)
    					self.noMoreExceptions = "Nessuna eccezione trovata in questa pagina";
    				else{
    					self.noMoreExceptions = "";
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numExceptionsFounded= 0;
    			}
    	);
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
		apiService.getPagedLogs(start, end, type, self.nPagLogs, self.nItemLogs, null, null).then(
    			function(data){
    				self.numLogsFounded= data.totalElements;
    				self.myListOfLogs = data.content;
    				if(self.myListOfLogs.length==0)
    					self.noMoreLogs = "Nessun log trovato in questa pagina";
    				else{
    					self.noMoreLogs = "";
    					for(var i=0; i< self.myListOfLogs.length; i++){
    						self.whoIsUser(self.myListOfLogs[i]);
    						self.whoIsScenario(self.myListOfLogs[i]);
    					}
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numLogsFounded= 0;
    			}
    	);
	}
	
	self.showResetExceptions = function(){
		if (self.myListOfExceptions.length>0 || self.nPagExceptions!=nPagDefault || self.nItemExceptions!=nItemDefault || self.noMoreExceptions!="")
			return true;
		else return false;
	}
	self.showResetSuggestions = function(){
		if (self.myListOfSuggestions.length>0 || self.nPagSuggestions!=nPagDefault || self.nItemSuggestions!=nItemDefault || self.noMoreSuggestions!="")
			return true;
		else return false;
	}
	self.showResetIssues = function(){
		if (self.myListOfIssues.length>0 || self.nPagIssues!=nPagDefault || self.nItemIssues!=nItemDefault || self.noMoreIssues!="")
			return true;
		else return false;
	}
	self.showResetRegistrationRequests = function(){
		if (self.myListOfRegistrationRequests.length>0 || self.nPagRegistrationRequests!=nPagDefault || self.nItemRegistrationRequests!=nItemDefault || self.noMoreRegistrationRequests!="")
			return true;
		else return false;
	}
	self.showResetLogs = function(){
		if (self.myListOfLogs.length>0 || self.nPagLogs!=nPagDefault || self.nItemLogs!=nItemDefault || self.noMoreLogs!="")
			return true;
		else return false;
	}
	self.showResetScenarios = function(){
		if (self.myListOfScenarios.length>0 || self.nPagScenarios!=nPagDefault || self.nItemScenarios!=nItemDefault || self.noMoreScenarios!="")
			return true;
		else return false;
	}
	
	self.showResetTeachers = function(){
		if (self.myListOfTeachers.length>0 || self.nPagTeachers!=nPagDefault || self.nItemTeachers!=nItemDefault || self.noMoreTeachers!="")
			return true;
		else return false;
	}
	self.showResetUsersByName = function(){
		if (self.myListOfUsers.length>0 || self.showErrorSearchBy || self.noMoreUsers!="")
			return true;
		else return false;
	}
	self.showResetStudents = function(){
		if (self.myListOfStudents.length>0 || self.nPagStudents!=nPagDefault || self.nItemStudents!=nItemDefault || self.noMoreStudents!="")
			return true;
		else return false;
	}
	
	self.resetExceptions = function(){
		self.myListOfExceptions = [];
		self.nItemExceptions=nItemDefault;
		self.nPagExceptions=0;
		self.noMoreExceptions = "";
		self.numExceptionsFounded=0;
	}
	self.resetIssues = function(){
		self.myListOfIssues = [];
		self.nItemIssues=nItemDefault;
		self.nPagIssues=0;
		self.noMoreIssues = "";
		self.numIssuesFounded=0;
	}
	self.resetSuggestions = function(){
		self.myListOfSuggestions = [];
		self.nItemSuggestions=nItemDefault;
		self.nPagSuggestions=0;
		self.noMoreSuggestions = "";
		self.numSuggestionsFounded=0;
	}
	self.resetRegistrationRequests = function(){
		self.myListOfRegistrationRequests = [];
		self.nItemRegistrationRequests=nItemDefault;
		self.nPagRegistrationRequests=0;
		self.noMoreRegistrationRequests = "";
		self.numRegistrationRequestsFounded=0;
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
	self.resetScenarios = function(){
		self.myListOfScenarios = [];
		self.nItemScenarios=nItemDefault;
		self.nPagScenarios=0;
		self.noMoreScenarios = "";
		self.numScenariosFounded=0;
	}
	self.resetTeachers = function(){
		self.myListOfTeachers = [];
		self.nItemTeachers=nItemDefault;
		self.nPagTeachers=0;
		self.noMoreTeachers = "";
		self.numTeachersFounded=0;
	}
	self.resetStudents = function(){
		self.myListOfStudents = [];
		self.nItemStudents=nItemDefault;
		self.nPagStudents=0;
		self.noMoreStudents = "";
		self.numStudentsFounded=0;
	}
	self.resetUsersByName = function(){
		self.firstName ="";
		self.lastName="";
		self.myListOfUsers = [];
		self.showErrorSearchBy = false;
		self.numUsersFounded=0;
		self.noMoreUsers = "";
	}
	
	
	self.showPopUpConfirmRegistration = function(l){
		modalService.showModalConfirmRegistration(l, true).then(
				function(response){

					
					alertingGeneric.addSuccess("Registrazione confermata");
					if(self.myListOfRegistrationRequests){
						for(var i=0; i<self.myListOfRegistrationRequests.length; i++){
							if(self.myListOfRegistrationRequests[i].id == l.id){
								self.myListOfRegistrationRequests.splice(i,1);
								break;
							}
						}
						self.numRegistrationRequestsFounded--;
						$location.hash("comeHere");
					    $anchorScroll();
					    $location.url($location.path());
					}
					
				}, function(reason){
					alertingGeneric.addWarning("Operazione annullata");			
					$location.hash("comeHere");
				    $anchorScroll();
				    $location.url($location.path());
				
				});
	}
	
	
	self.showPopUpDeleteRegistration = function (l){
		modalService.showModalConfirmRegistration(l, false).then(
				function(response){
					
					alertingGeneric.addSuccess("Registrazione cancellata");
					if(self.myListOfRegistrationRequests){
						for(var i=0; i<self.myListOfRegistrationRequests.length; i++){
							if(self.myListOfRegistrationRequests[i].id == l.id){
								self.myListOfRegistrationRequests.splice(i,1);
								break;
							}
						}
						self.numRegistrationRequestsFounded--;
						$location.hash("comeHere");
					    $anchorScroll();
					    $location.url($location.path());
					}
					
				}, function(reason){
					alertingGeneric.addWarning("Operazione annullata");			
					$location.hash("comeHere");
				    $anchorScroll();
				    $location.url($location.path());
				});
	};
	
	
	
	self.searchMoreInfo = function(l){
		
		
		userService.getUserByEmail(l.email).then(
				function(data){
					l.firstName = data.firstName;
					l.lastName = data.lastName;
					l.registrationDate = data.registrationDate;
					l.agree = data.agree;
					l.profile={};
					l.profile = data.profile;
				}, function(reason){
					console.log("Error in getUserByEmail !!!");
				}
		);
		l.moreInfo=true;
	}
	
}]);

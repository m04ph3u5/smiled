angular.module('smiled.application').controller('scenarioWizardCtrl', ['apiService', '$stateParams', '$state', 
                                                                       '$location', '$scope', '$element', 'userService', 
                                                                       'Upload', 'CONSTANTS',
   function scenarioWizardCtrl(apiService, $stateParams, $state, $location, $scope, $element, userService, Upload, CONSTANTS){
	
		var self = this;
		self.scenario = {};
		var tab;
		self.scenarioServer = {};
		//self.charactersCover = [];
		self.emailList;
		self.user;
		self.currentCharacter = {};
		self.characters = [];
		var currentCharacterIndex = -1;
		
		userService.getMe().then(
			function(data){
				self.user = data;
			}
		);
		
		var fillCharactersCover = function(){
			for(var i=0; i<self.scenario.characters.length; i++){
				var char = angular.copy(self.scenario.characters[i]);
				char.cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
				self.characters.push(char);
			}
		}
		
		var id = $stateParams.id;
		if(id==null){
			self.title="Crea nuovo scenario";
		}else{
			apiService.getScenario(id).then(
					function(data){
						self.scenarioServer = data;
						self.scenario = angular.copy(data);
						self.title = data.name;
						fillCharactersCover();
					}
			);
			self.scenarioCover = CONSTANTS.urlScenarioCover(id);
		}
		
		
		self.saveInfo = function(){
			console.log("saveInfo");
			var scenarioDTO = {};
			scenarioDTO.name = self.scenario.name;
			scenarioDTO.history = self.scenario.history;
			if(id==null){
				if(infoValidate()){
					apiService.createScenario(scenarioDTO).then(
							function(data){
								console.log("then saveInfo");
								id = data.id;
								console.log("after then save Info");
							},
							function(reason){								
								console.log("Errore creazione scenario");
							}
					);
				}else{
					console.log("fail infoValidate");
				}
			}else{
				if(!isEquivalent(self.scenario,self.scenarioServer) && infoValidate()){
					apiService.updateScenario(scenarioDTO, id).then(
							function(data){
								self.scenarioServer = data;
								console.log("then saveInfo updateScenario");
							},
							function(reason){
								console.log("Errore update scenario");
							}
					);
				}else
					console.log("---------------> Nessun cambiamento NO PUT");
			}
		}
		
		self.inviteStudents = function(){
			var emails = extractEmails(self.emailList);
			var emailsDTO=[];
			for(var i=0; i<emails.length; i++){
				console.log(emails[i]);
				emailsDTO.push({"email": emails[i]});
			}
			if(emailsDTO.length>0 && id!=null){
				apiService.addUsersToScenario(emailsDTO,id).then(
						function(data){
							for(var i=0; i<data.length; i++){
								if(data[i].firstname!=null)
									self.scenarioServer.attendees.push(data[i]);
								else
									self.scenarioServer.invited.push(data[i]);
							}
						},
						function(reason){
							
						}
				);
			}
		}
		
		self.uploadCover = function(file){
			if(file && file.length){
				Upload.upload({
		            url: CONSTANTS.urlCoverScenario(id),
		            headers : {
		                'Content-Type': file.type
		            },
		            file: file
		        })
//		            .progress(function (evt) {
//		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//		            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//		        })
		        .success(function (data, status, headers, config) {
		            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		            var date = new Date();
		            self.scenarioCover = CONSTANTS.urlScenarioCover(id)+"?"+date.toString() ;
		        });
			}
		}
		
		self.uploadCharacterCover = function(file,event,idCharacter){
			if(file && file.length && idCharacter){
				Upload.upload({
		            url: CONSTANTS.urlCharacterCover(id,idCharacter),
		            headers : {
		                'Content-Type': file.type
		            },
		            file: file
		        })
//		            .progress(function (evt) {
//		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//		            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//		        })
		        .success(function (data, status, headers, config) {
		            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		            console.log(self.scenario.characters.length);
		            for(var i=0; i<self.scenario.characters.length; i++){
		            	if(self.scenario.characters[i].id==idCharacter){
		            		var d = new Date();
		            		self.charactersCover[i] = CONSTANTS.urlCharacterCover(id, idCharacter)+"?"+d.toString();
		            		console.log(self.scenario.characters[i]);
		            		console.log(self.charactersCover[i]);
		            	}
		            }
		        });
			}
		}
		
		self.addCharacter = function(){
			if(self.newCharacter && self.newCharacter.name.length>2){
				apiService.addCharacterToScenario(self.newCharacter,id).then(
						function(data){
							self.newCharacter.id = data.id;
							//self.newCharacter.status=false;
							self.scenario.characters.push(angular.copy(self.newCharacter));
							//cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
							self.charactersCover.push(CONSTANTS.urlCharacterCover(id,self.newCharacter.id));
							self.newCharacter.name = "";
							self.newCharacter.id = null;
						},
						function(reason){
							
						}
				);
			}
		}
		
		self.openAccordion = function(i){
			if(currentCharacterIndex!=-1){
				apiService.updateCharacter(id, self.scenario.characters[currentCharacterIndex]).then(
						function(data){
							self.scenario.characters[currentCharacterIndex] = data;
							currentCharacterIndex=i;
							console.log("Character aggiornato");
						}
				);
			}else
				currentCharacterIndex=i;
		}
/*--------------------------------------UTILITY----------------------------------------------------*/
		
		var onStartup = function(){
			var path = $location.path();
			var tabString = path.substr(path.lastIndexOf('/') + 1);
			if(tabString=="info"){
				tab=0;
			}else if(tabString=="attendees"){
				tab=1;
			}else if(tabString=="characters"){
				tab=2;
			}else if(tabString=="associations"){
				tab=3;
			}else if(tabString=="collaborators"){
				tab=4;
			}
			console.log("onStartup WizardController: "+tab);
		}
		
		self.changeStateTab = function(newDestination){
			switch(tab){
				case 0 : {
					tab = newDestination;
					self.saveInfo();
					break;
				}
				case 1 : {
					tab = newDestination;
					break;
				}
				case 2: {
					tab = newDestination;
					break;
				}
				case 3: {
					tab = newDestination;
					break;
				}
				case 4: {
					tab = newDestination;
					break;
				}
			}
		}
		
		var isEquivalent =  function(a, b) {
			console.log("isEquivalent");
//			console.log(a);
//			console.log(b);
//			// Create arrays of property names
//		    var aProps = Object.getOwnPropertyNames(a);
//		    var bProps = Object.getOwnPropertyNames(b);
//
//		    // If number of properties is different,
//		    // objects are not equivalent
//		    if (aProps.length != bProps.length) {
//		    	console.log("different length");
//		        return false;
//		    }
//
//		    for (var i = 0; i < aProps.length; i++) {
//		        var propName = aProps[i];
//
//		        // If values of same property are not equal,
//		        // objects are not equivalent
//		        if (a[propName] !== b[propName]) {
//		            return false;
//		        }
//		    }
//
//		    // If we made it this far, objects
//		    // are considered equivalent
//		    console.log("isEquivalent ---> return true");
//		    return true;
			return angular.equals(a, b);
		}
		
		var infoValidate = function(){
			var ret=true;
			console.log("infoValidate");
			console.log(self.scenario.history);
			console.log(self.scenario.history.startDate);
			console.log(self.scenario.history.endDate);
			if(!self.scenario.name || self.scenario.name.length<2){
				console.log("infoValidate ---> 1");
				ret=false;
				if(self.scenarioServer.name){
					self.scenario.name=self.scenarioServer.name;
				}else{
					self.scenario.name="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.startDate){
				console.log("infoValidate ---> 2");
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.startDate){
					self.scenario.history.startDate=self.scenarioServer.history.startDate;
				}else{
					self.scenario.history.startDate="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.endDate){
				console.log("infoValidate ---> 3");
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.endDate){
					self.scenario.history.endDate=self.scenarioServer.history.endDate;
				}else{
					self.scenario.history.endDate="";
				}
			}
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate){
				if(self.scenario.history.startDate>self.scenario.history.endDate){
					console.log("infoValidate ---> 4");
					ret=false;
					if(self.scenarioServer.history && self.scenarioServer.history.endDate){
						self.scenario.history.endDate=self.scenarioServer.history.endDate;
					}else{
						self.scenario.history.endDate="";
					}
					if(self.scenarioServer.history && self.scenarioServer.history.startDate){
						self.scenario.history.startDate=self.scenarioServer.history.startDate;
					}else{
						self.scenario.history.startDate="";
					}
				}
			}
				
			
			return ret;
		}
		
		var checkDate = function(date){
			// regular expression to match required date format
			var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;

		    if(date != '' && !date.match(re)) {
		      return false;
		    }
		    else
		    	return true;    
		}
		
		var extractEmails = function(text){
		    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		}	

		onStartup();

}]);
	
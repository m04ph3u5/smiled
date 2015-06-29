angular.module('smiled.application').controller('scenarioWizardCtrl', ['apiService', '$stateParams', '$state', 
                                                                       '$location', '$scope', '$element', 'userService',
   function scenarioWizardCtrl(apiService, $stateParams, $state, $location, $scope, $element, userService){
	
		var self = this;
		self.scenario = {};
		var tab;
		self.scenarioServer = {};
		self.emailList;
		self.user;
		userService.getMe().then(
			function(data){
				self.user = data;
			}
		);
		
		var id = $stateParams.id;
		if(id==null){
			self.title="Crea nuovo scenario";
		}else{
			apiService.getScenario(id).then(
					function(data){
						self.scenarioServer = data;
						self.scenario = JSON.parse(JSON.stringify(data));
						self.title = data.name;
					}
			);
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
								$state.go('logged.scenarioWizard.attendees');
								console.log("after then save Info");
							},
							function(reason){								
								console.log("Errore creazione scenario");
							}
					);
				}
			}else{
				if(!isEquivalent(self.scenario,self.scenarioServer) && infoValidate()){
					apiService.updateScenario(scenarioDTO, id).then(
							function(data){
								self.scenarioServer = data;
								console.log("then saveInfo updateScenario");
								$state.go('logged.scenarioWizard.attendees');
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
					$state.go("logged.scenarioWizard.info");
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
			// Create arrays of property names
		    var aProps = Object.getOwnPropertyNames(a);
		    var bProps = Object.getOwnPropertyNames(b);

		    // If number of properties is different,
		    // objects are not equivalent
		    if (aProps.length != bProps.length) {
		        return false;
		    }

		    for (var i = 0; i < aProps.length; i++) {
		        var propName = aProps[i];

		        // If values of same property are not equal,
		        // objects are not equivalent
		        if (a[propName] != b[propName]) {
		            return false;
		        }
		    }

		    // If we made it this far, objects
		    // are considered equivalent
		    return true;
		}
		
		var infoValidate = function(){
			var ret=true;
			console.log("infoValidate");
			
			if(!self.scenario.name || self.scenario.name.length<2){
				ret=false;
				if(self.scenarioServer.name){
					self.scenario.name=self.scenarioServer.name;
				}else{
					self.scenario.name="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.startDate || !checkDate(self.scenario.history.startDate)){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.startDate){
					self.scenario.history.startDate=self.scenarioServer.history.startDate;
				}else{
					self.scenario.history.startDate="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.endDate || !checkDate(self.scenario.history.endDate)){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.endDate){
					self.scenario.history.endDate=self.scenarioServer.history.endDate;
				}else{
					self.scenario.history.endDate="";
				}
			}
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate){
				if(self.scenario.history.startDate>self.scenario.history.endDate){
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
	
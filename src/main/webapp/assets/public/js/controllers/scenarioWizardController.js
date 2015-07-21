angular.module('smiled.application').controller('scenarioWizardCtrl', ['apiService', '$stateParams', '$state', 
                                                                       '$location', '$scope', '$element', 'userService', 
                                                                       'Upload', 'CONSTANTS', '$q','modalService',
                                                                       '$timeout',
   function scenarioWizardCtrl(apiService, $stateParams, $state, $location, $scope, $element, userService, Upload, CONSTANTS, $q, modalService, $timeout){
	
	 	var self = this;
		/*Variabile che contiene lo scenario prelevato dalla getScenario
		 * self.scenario.characters è l'array di Reference a Character contenuto in scenario*/
	 	self.scenario = {};
		var tab;
		self.scenarioServer = {};
		self.associated = [];
		self.notAssociatedAttendees = [];
		self.notAssociatedCharacters = [];
		//self.charactersCover = [];
		self.emailList;
		self.accordionIsDisabled=true;
		self.user;
		self.selectableStudents;
		self.selectableCollaborators;
		self.currentCharacters = []; //qui ci vanno le modifiche temporanee al character i-esimo. Questo ci permette di decidere se effettuare o meno la put sul server nel momento in cui andiamo a chiudere l'accordion
		self.charactersServer = []; //array di character cosi come sono sul server
		self.map;
		var currentCharacterIndex = -1;
		var getMePromise = $q.defer();
		
		//GET ME
		userService.getMe().then(
			function(data){
				self.user = data;
				var userCopy = angular.copy(self.user);
				self.selectableStudents = userCopy.students;
				self.selectableCollaborators = userCopy.colleagues;
				getMePromise.resolve();
			}
		);
		
		//GET SCENARIO
		var id = $stateParams.id;
		
		if(id==null){
			self.title="Crea nuovo scenario";
		}else{
			self.charging = true;
			apiService.getScenario(id).then(
					function(data){
						self.scenarioServer = data;
						self.scenario = angular.copy(data);
						self.title = data.name;
						
						updateSelectableAttendees();
						//aggiorno le cover dei characters dello scenario
						updateCover();
						updateSelectableCollaborators();
						
						updateAssociated();

						retrieveCharacterAndOrder();
					
					}, function(reason){
						console.log("errore");
					}
			);
			self.scenarioCover = CONSTANTS.urlScenarioCover(id);
			
		}
		
		self.isScenarioActive = function(){
			if (self.scenarioServer.status == 'ACTIVE')
				return true;
			else 
				return false;
		}
		
		var retrieveCharacterAndOrder = function(){
			
			apiService.getAllCharactersFromScen(id).then(
					function(data){
						if(self.scenario.characters){
							for(var i=0; i<self.scenario.characters.length;i++){
								for(var j=0; j<data.length;j++){
									if(data[j].id==self.scenario.characters[i].id){
										self.charactersServer[i]=data[j];
										self.currentCharacters[i] = angular.copy(data[j])
										data.splice(j,1);
										break;
									}
								}
							}
						}
						self.accordionIsDisabled=false;

						//$timeout(function(){self.accordionIsDisabled=false;},10000);
					}, function(reason){
						console.log("errore");
					}
			);
			
			
		}
		
		var updateCover = function(){
			if(self.scenario.characters)
				for(var i=0;i<self.scenario.characters.length;i++){
					self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
				}
			if(self.scenario.attendees)
				for(var i=0;i<self.scenario.attendees.length; i++){
					self.scenario.attendees[i].cover = CONSTANTS.urlUserCover(self.scenario.attendees[i].id);
				}
			self.scenario.teacherCreator.cover = CONSTANTS.urlUserCover(self.scenario.teacherCreator.id);
			self.map = CONSTANTS.urlMedia(self.scenario.history.mapId);
		}
		
		var updateAssociated = function(){
			var teacherPlay=false;
			if(self.scenario.attendees){ //TODO Sistemare il fatto che se non hai attendees non vedi nemmeno i characters
				var attendees = angular.copy(self.scenario.attendees);
				if(self.scenario.characters){
					for(var i=0; i<self.scenario.characters.length; i++){
						if(self.scenario.characters[i].userId==null){
							self.notAssociatedCharacters.push(self.scenario.characters[i]);
						}else if(self.scenario.characters[i].userId==self.scenario.teacherCreator.id){
							var association = {};
							association.character = self.scenario.characters[i];
							association.attendee = self.scenario.teacherCreator;
							self.associations.push(association);
							teacherPlay=true;
						}else{
							for(var j=0; j<attendees.length; j++){
								if(attendees[j].id==self.scenario.characters[i].userId){
									var association = {};
									association.character = self.scenario.characters[i];
									association.attendee = attendees[j];
									self.associations.push(association);
									attendees.splice(j,1);
									break;
								}
							}
						}
					}
				}
				self.notAssociatedAttendees = attendees;
				
			}
			if(!teacherPlay)
				self.notAssociatedAttendees.push(self.scenario.teacherCreator);
			console.log("----------------------------->UPDATE ASSOCIATIONS");
			console.log(self.notAssociatedAttendees);
			console.log(self.notAssociatedCharacters);
			console.log(self.associations);
		}
		
		
		/*------------------------------------------------------------------------------------------------------------------------ */
		
		
		self.showPopUpDeleteScenario = function (){
			if(self.scenario!=null)
				modalService.showModalDeleteScen(self.scenario);
		};
		
		
		
		var reInsertInSelectable = function(s){
			console.log("reInsertInSelectable");
			self.selectableStudents.push(s);
			for(var j=0; j<self.selectableStudents.length; j++){
				console.log(self.selectableStudents[j]);
			}
			
		}
		var reInsertInSelectableCollaborators = function(c){
			console.log("reInsertInSelectableCollaborators");
			self.selectableCollaborators.push(c);
		}
		
		var updateSelectableAttendees = function(){
			console.log("updateSelectableAttendees");
			console.log(self.selectableStudents);
			console.log(self.scenarioServer.attendees);
			console.log(self.scenarioServer);
			if(self.scenarioServer && self.scenarioServer.attendees && self.selectableStudents){
				
				for(var i=0; i<self.scenarioServer.attendees.length; i++){
					
					for(var j=0; j<self.selectableStudents.length; j++){
						
						if(self.scenarioServer.attendees[i].id==self.selectableStudents[j].id){
							self.selectableStudents.splice(j,1);
						}
					}
				}
			}
		}
		
		var updateSelectableCollaborators = function(){
			console.log("updateSelectableCollaborators");
			
			if(self.scenarioServer && self.scenarioServer.collaborators && self.selectableCollaborators){
			
				for(var i=0; i<self.scenarioServer.collaborators.length; i++){
			
					for(var j=0; j<self.selectableCollaborators.length; j++){
					
						if(self.scenarioSever.collaborators[i].id==self.selectableCollaborators[j].id){
							self.selectableCollaborators.splice(j,1);
						}
					}
				}
			}
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
								if(data[i].firstname!=null){
									data[i].cover = CONSTANTS.getUserCover(data[i].id);
									console.log(data[i]);
									if(self.scenarioServer.attendees==null || self.scenarioServer.attendees == "")
										self.scenarioServer.attendees = new Array();
									self.scenarioServer.attendees.push(data[i]);
									self.notAssociatedAttendees.push(angular.copy(data[i]));

								}
								else{
									if(self.scenarioServer.invited==null || self.scenarioServer.invited == "")
										self.scenarioServer.invited = new Array();
									self.scenarioServer.invited.push(data[i]);
								}
							}
							self.emailList=null;
						},
						function(reason){
							
						}
				);
			}
		}
		
		self.uploadCover = function(file){
			if(file && file.length){
				Upload.upload({
		            url: CONSTANTS.urlScenarioCover(id),
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
		            for(var i=0; i<self.scenario.characters.length; i++){
		            	if(self.scenario.characters[i].id==idCharacter){
		            		var d = new Date();
		            		self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, idCharacter)+"?"+d.toString();
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
							if(self.scenario.characters==null || self.scenario.characters=="")
								self.scenario.characters= new Array();
							self.newCharacter.cover = CONSTANTS.urlCharacterCover(id,self.newCharacter.id);
							self.newCharacter.isOpen=false;
							self.newCharacter.isSync=false;
							self.scenario.characters.push(angular.copy(self.newCharacter));
							self.newCharacter.isOpen=null;
							self.newCharacter.isSync=null;
							self.charactersServer.push(angular.copy(self.newCharacter));
							self.currentCharacters.push(angular.copy(self.newCharacter));
							console.log(self.newCharater);
							self.notAssociatedCharacters.push(angular.copy(self.newCharacter));
							self.newCharacter.cover = null;
							self.newCharacter.name = "";
							self.newCharacter.id = null;
						},
						function(reason){
							
						}
				);
			}
		}
		
		var getCharacter = function(i){
			var c = $q.defer();
			console.log("getCharacter1");
			if(!self.charactersServer[i].isSync){
				console.log("getCharacter2");
				apiService.getCharacter(id, self.charactersServer[i].id).then(
						function(data){
							var oldIsOpen = self.charactersServer[i].isOpen;
							console.log(data);
							self.charactersServer[i] = data;
							self.charactersServer[i].isSync=true;
							self.charactersServer[i].isOpen = oldIsOpen;
							c.resolve(data);
						},
						function(reason){
							self.charactersServer[i].isSync=false;
							c.reject();
						}
				);
				return c.promise;
			}
			else 
				return c.resolve(self.charactersServer[i]);
		}
		
		var syncCurrentCharacter = function(i, c){
			current = angular.copy(c);
			console.log("syncCurrentCharacter");
			self.currentCharacters[i].name = current.name;
			self.currentCharacters[i].birthDate = current.birthDate;
			self.currentCharacters[i].deadDate = current.deadDate;
			self.currentCharacters[i].bornTown = current.bornTown;
			self.currentCharacters[i].deadTown = current.deadTown;
			self.currentCharacters[i].description = current.description;
			self.currentCharacters[i].quote = current.quote;
			self.currentCharacters[i].gender = current.gender;
			self.currentCharacters[i].role = current.role;
			
		}
		
		self.openAccordion = function(i){
			
			if(self.accordionIsDisabled)
				return;
			
			console.log("openAccordion");
			if(currentCharacterIndex!=-1){
				if(isUpdatedCharacter(self.currentCharacters[currentCharacterIndex], self.charactersServer[currentCharacterIndex])){
					if(isCurrentCharacterValid(self.currentCharacters[currentCharacterIndex])){
						//va fatta la put delle nuove informazioni ed alla fine va gestito l'aggiornamento del currentCharacter
						console.log("PUT PUT PUT PUT PUT");
						console.log(i);
						if(i!=currentCharacterIndex){
							syncCurrentCharacter(i, self.charactersServer[i]);
						}
						apiService.updateCharacter(id, self.currentCharacters[currentCharacterIndex], self.charactersServer[currentCharacterIndex].id).then(
								function(data){
									self.charactersServer[currentCharacterIndex] = data;
									self.scenario.characters[currentCharacterIndex].name = data.name;
									if(self.scenario.characters[currentCharacterIndex].userId!=null){
										console.log("toUPDATE --------> ")
										for(var k=0; i<self.associations.length; k++){
											if(self.associations[k].character.id==self.scenario.characters[currentCharacterIndex].id){
												self.associations[k].character.name=self.scenario.characters[currentCharacterIndex].name;
												break;
											}
							
										}
									}else{
										for(var j=0; j<self.notAssociatedCharacters.length; j++){
											if(self.notAssociatedCharacters[j].id==self.scenario.characters[currentCharacterIndex].id){
												self.notAssociatedCharacters[j].name=self.scenario.characters[currentCharacterIndex].name;
												break;
											}
							
										}
									}
									if(currentCharacterIndex!=i)
										currentCharacterIndex=i;
									else
										currentCharacterIndex=-1;
									console.log("Character aggiornato");
								}
						);
					}else{ //il current character non differisce rispetto alle info che sono sul server quindi non è necessario fare la put sul server
						/*TO CONTINUE*/
						//TODO
						if(currentCharacterIndex!=i)
							currentCharacterIndex=i;
						else
							currentCharacterIndex=-1;
					}
				}else{ //la validazione delle info digitate è fallita
					   //TODO
					if(currentCharacterIndex!=i)
						currentCharacterIndex=i;
					else
						currentCharacterIndex=-1;
				}
			}else{
				//si tratta della prima apertura dell'accordion in questa istanza dello state
				currentCharacterIndex=i;
			}
		}
		
		self.addCollaborator = function(collaborator){
			console.log("addCollaboratorToScenario: "+collaborator);
			var emailDTO = {"email": collaborator.email};
			
			apiService.addCollaboratorToScenario(emailDTO, id).then(
					function(data){
						if(data.firstname!= null && data.lastname != null){
							if(self.scenarioServer.collaborators==null || self.scenarioServer.collaborators == "")
								self.scenarioServer.collaborators = new Array();
							self.scenarioServer.collaborators.push(data);
						}
							
						
						self.selectedCollaborator="";
						
						for(var j=0; j<self.selectableCollaborators.length; j++){
							if(self.selectableCollaborators[j].id==collaborator.id){
								self.selectableCollaborators.splice(j,1);
							}
						}
					}, 
					function(reason){
	
					});
		}
		
		self.addAttendee = function(attendee){
			console.log(attendee);
			var emailsDTO = [];
			emailsDTO.push({"email": attendee.email});
			
			//utilizzo la addUsersToScenario passandogli un vettore che contiene una sola email 
			apiService.addUsersToScenario(emailsDTO,id).then(
					function(data){
						for(var i=0; i<data.length; i++){
							if(data[i].firstname!=null){
								data[i].cover=CONSTANTS.urlUserCover(data[i].id);
								if(self.scenarioServer.attendees==null || self.scenarioServer.attendees == "")
									self.scenarioServer.attendees = new Array();
								self.scenarioServer.attendees.push(data[i]);
								self.notAssociatedAttendees.push(angular.copy(data[i]));
							}
							else{
								if(self.scenarioServer.invited==null || self.scenarioServer.invited == "")
									self.scenarioServer.invited = new Array();
								self.scenarioServer.invited.push(data[i]);
							}
						}
						self.emailList=null;
						self.selectedUser="";
						for(var j=0; j<self.selectableStudents.length; j++){
							if(self.selectableStudents[j].id==attendee.id){
								self.selectableStudents.splice(j,1);
							}
								
						}
					},
					function(reason){
						
					}
			);
			
		}
		
		self.enterInScenario = function(){
			self.saveInfo();

			$state.go("logged.scenario.posts", {id : id});
		}
		
		self.deleteAttendee = function(s){
			apiService.removeUserFromScenario(id, s.id).then(
					function(data){
						for(var i=0; i<self.scenarioServer.attendees.length; i++){
							if(self.scenarioServer.attendees[i].id==s.id){
								self.scenarioServer.attendees.splice(i,1);
								self.scenario.attendees.splice(i,1);
							}
						}
						reInsertInSelectable(s);
						manageAssociationOnAttendeeDeletion(s);
					},
					function(reason){
						console.log("Delete attendee failed: "+reason);
					}
			)
		}
		
		
		self.deleteCollaborator = function(c){
			apiService.removeCollaboratorFromScenario(id, c.id, false).then(
					function(data){
						for(var i=0; i<self.scenarioServer.collaborators.length; i++){
							if(self.scenarioServer.collaborators[i].id==c.id)
								self.scenarioServer.collaborators.splice(i,1);
						}
						reInsertInSelectableCollaborators(c);
					},
					function(reason){
						console.log("Delete collaborator failed: "+reason);
					}
			)
		}
		
		self.deleteInvited = function(s){
			apiService.removeUserFromScenario(id, s.id).then(
					function(data){
						for(var i=0; i<self.scenarioServer.invited.length; i++){
							if(self.scenarioServer.invited[i].id==s.id)
								self.scenarioServer.invited.splice(i,1);
						}
					},
					function(reason){
						console.log("Delete invited user failed: "+reason);
					}
			)
		}
		
		
		self.deleteCharacter = function(c){
			apiService.removeCharacterFromScenario(id, c.id).then(
					function(data){
						for(var i=0; i<self.scenario.characters.length; i++){
							if(self.scenario.characters[i].id==c.id){
								self.scenario.characters.splice(i,1);
								self.charactersServer.splice(i,1);
								self.currentCharacters.splice(i,1);
								/*TODO valutares*/
								self.scenarioServer.characters.splice(i,1);
								manageAssociationOnCharacterDeletion(c);
							}
						}
					},
					function(reason){
						console.log("Delete character failed: "+reason);
					}
			);
		}
		
		var manageAssociationOnAttendeeDeletion = function(a){
			if(self.notAssociatedAttendees){
				for(var j=0; j<self.notAssociatedAttendees.length; j++){
					if(self.notAssociatedAttendees[j].id==a.id){
						self.notAssociatedAttendees.splice(j,1);
						return;
					}
				}
			}
			if(self.associations){
				for(var i=0; i<self.associations.length; i++){
					if(self.associations[i].attendee.id==a.id){
						self.notAssociatedCharacters.push(self.associations[i].character);
						self.associations.splice(i,1);
						break;
					}
				}
			}
		}
		
		var manageAssociationOnCharacterDeletion = function(c){
			if(self.notAssociatedCharacters){
				for(var j=0; j<self.notAssociatedCharacters.length; j++){
					if(self.notAssociatedCharacters[j].id==c.id){
						self.notAssociatedCharacters.splice(j,1);
						return;
					}
				}
			}
			if(self.associations){
				for(var i=0; i<self.associations.length; i++){
					if(self.associations[i].character.id==c.id){
						self.notAssociatedAttendees.push(self.associations[i].attendee);
						self.associations.splice(i,1);
						break;
					}
				}
			}
		}
		
		/*Variabile temporanea utilizzata dal drag & drop per tenere traccia dell'ultima card presa*/
		var dragged;
		self.associations = new Array();
		
		self.dropSuccessHandlerCharacter =function($event, indexAttendee){
			console.log("dropSuccessHandlerCharacter");
			console.log(indexAttendee);
			var association = {};
			association.attendee = self.notAssociatedAttendees[indexAttendee];
			association.character = self.notAssociatedCharacters[dragged];
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						/*TODO allineare charactersServer*/
						self.associations.push(angular.copy(association));
						self.notAssociatedAttendees.splice(indexAttendee,1);
						self.notAssociatedCharacters.splice(dragged,1);
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		self.dropSuccessHandlerAttendee =function($event, indexCharacter){
			console.log("dropSuccessHandlerAttendee");
			console.log(indexCharacter);
			var association = {};
			association.attendee = self.notAssociatedAttendees[dragged];
			association.character = self.notAssociatedCharacters[indexCharacter];
			
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						self.associations.push(angular.copy(association));
						self.notAssociatedAttendees.splice(dragged,1);
						self.notAssociatedCharacters.splice(indexCharacter,1);
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		/*index --> dove vado*/
		self.onDrop = function($event, $data, index){
			console.log("onDrop");
			console.log($event);
			console.log($data);
			console.log(index);			
			dragged = index;
		}
		
		self.removeAssociation =  function(a){
			var character = a.character;
			var attendee = a.attendee;
			for(var i=0; i<self.associations.length; i++){
				if(self.associations[i].attendee.id==a.attendee.id){
					apiService.removeUserFromCharacter(id, attendee.id, character.id).then(
							function(data){
								self.notAssociatedAttendees.push(attendee);
								self.notAssociatedCharacters.push(character);
								self.associations.splice(i,1);
							},
							function(reason){
								console.log("Removing asssociation failed:" +reason);
							}
					);
					break;
				}
			}
		}
		
		self.openScenario = function(){
			var scenarioDTO = {"status": "ACTIVE"};
			apiService.updateScenario(scenarioDTO, id).then(
					function(data){
						console.log("activating");
						self.scenarioServer=data;
						$state.go("logged.scenario.posts", {id : id});
					},
					function(reason){
						console.log("C'è stato un problema, impossibile attivare lo scenario");
					}
			);
		}
		
		self.closeScenario = function(){
			console.log("chiusura scenario da implementare");
		}
		
		self.suspendScenario = function(){
			console.log("sospensione scenario da implementare");
		}
		
		
		
		self.showPopUpSetDate = function(flagFirst){
			modalService.showPopUpSetDate(self.scenario, flagFirst);
		}
		self.isStudent = function(s){
			if(s.type== 'Student')
				return true;
			else return false;
		}
		
		self.uploadMap = function(file){
			if(file && file.length){
				Upload.upload({
		            url: CONSTANTS.urlPostMedia(self.scenario.id),
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
		            console.log('MAP ' + config.file.name + 'uploaded. Response: ' + data);
		            self.scenario.history.mapId = data.id;
		            var date = new Date();
		            self.map = CONSTANTS.urlMedia(data.id)+"?"+date.toString() ;
		            console.log(self.scenario.history.mapId);
		        });
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
		
		self.checkOpenAccordion = function(){
			console.log("checkOpenAccordion");
			if(self.scenario.characters){
				for(var i=0; i<self.scenario.characters.length; i++){
					console.log("charactersServer[i]: "+i);
					if(self.scenario.characters[i].isOpen){
						console.log("checkOpen: "+i);
						self.openAccordion(i);
						break;
					}
				}
			}
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
					self.checkOpenAccordion();
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
		
		var isUpdatedCharacter = function(newChar, oldChar){
			if(newChar.name!=oldChar.name)
				return true;
			if(newChar.birthDate!=oldChar.birthDate)
				return true;
			if(newChar.deadDate!=oldChar.deadDate)
				return true;
			if(newChar.bornTown!=oldChar.bornTown)
				return true;
			if(newChar.deadTown!=oldChar.deadTown)
				return true;
			if(newChar.description!=oldChar.description)
				return true;
			if(newChar.quote!=oldChar.quote)
				return true;
			if(newChar.gender!=oldChar.gender)
				return true;
			if(newChar.role!=oldChar.role)
				return true;
			
			return false;
		}
		
		var isCurrentCharacterValid = function(char){
			return true;
		}

		onStartup();

}]);
	

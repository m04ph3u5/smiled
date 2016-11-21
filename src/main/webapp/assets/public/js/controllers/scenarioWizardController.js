angular.module('smiled.application').controller('scenarioWizardCtrl', ['apiService', '$stateParams', '$state', 
                                                                       '$location', '$scope', '$element', 'userService', 
                                                                       'Upload', 'CONSTANTS', '$q','modalService',
                                                                       '$timeout', 'alertingGeneric',
   function scenarioWizardCtrl(apiService, $stateParams, $state, $location, $scope, $element, userService, Upload, CONSTANTS, $q, modalService, $timeout, alertingGeneric){
	
	 	var self = this;
		/*Variabile che contiene lo scenario prelevato dalla getScenario
		 * self.scenario.characters è l'array di Reference a Character contenuto in scenario*/
	 	self.scenario = {};
	 	
//	 	for(var i=0; i<self.blabla.length; i++){
//	 		self.bobo = self.blabla[i];
//	 	}
	 	
		var tab;
		self.scenarioServer = {};
		self.associated = [];
		self.notAssociatedAttendees = [];
		self.notAssociatedCharacters = [];
		//self.charactersCover = [];
		self.emailList;
		self.accordionIsDisabled=true;
		self.user;
		self.selectableStudents = [];
		//self.selectableCollaborators = new Array();
		self.currentCharacters = []; //qui ci vanno le modifiche temporanee al character i-esimo. Questo ci permette di decidere se effettuare o meno la put sul server nel momento in cui andiamo a chiudere l'accordion
		self.charactersServer = []; //array di character cosi come sono sul server
		self.map;
		
		self.lastUserClicked = null;
		self.lastCharacterClicked = null;
		
		var currentCharacterIndex = -1;
		var getMePromise = $q.defer();
		var id = $stateParams.id;
		self.showNewspaperTab;
		
		
		//GET ME
		userService.getMe().then(
			function(data){
				self.user = data;
				var userCopy = angular.copy(self.user);
				self.selectableStudents = userCopy.students;
			
				getMePromise.resolve();
				getScenario();
			}
		);
		
		self.concatNameAndSurname = function (name, surname){
			return name + " " + surname;
		}
		
		self.isClickedUser = function(id){
			if(self.lastUserClicked && id == self.lastUserClicked.id)
				return true;
			else 
				return false;
		}
		
		self.isClickedCharacter = function(id){
			if(self.lastCharacterClicked && id == self.lastCharacterClicked.id)
				return true;
			else 
				return false;
		}
		
		self.userClicked = function(user){
			if(self.lastUserClicked && user.id == self.lastUserClicked.id){
				self.lastUserClicked = null;
			}
			else{
				self.lastUserClicked = user;
				if(self.lastCharacterClicked!=null){
					self.createAssociationWithoutDrag();
					self.lastUserClicked = null;
					self.lastCharacterClicked=null;
				}
			}
				
			
		}
		
		self.characterClicked = function(character){
			if(self.lastCharacterClicked && character.id == self.lastCharacterClicked.id){
				self.lastCharacterClicked = null;
			}
			else{
				self.lastCharacterClicked = character;
				if(self.lastUserClicked!=null){
					self.createAssociationWithoutDrag();
					self.lastUserClicked = null;
					self.lastCharacterClicked=null;
				}
			}
				
		}
		
		var getScenario = function(){
			//GET SCENARIO
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
							//updateSelectableCollaborators();
							
							updateAssociated();
							if(self.scenario.newspaperEnabled){
								
								self.showNewspaperTab=true;
								
								self.actualJournalist = self.scenario.actualJournalist;
								updateAllPeopleInScenario();
								if(self.allPeopleInScenario!=null){
									for(var i=0; i<self.allPeopleInScenario.length; i++){
										if(self.actualJournalist != null && self.allPeopleInScenario[i].id == self.actualJournalist.id)
											self.allPeopleInScenario.splice(i,1);
									}
								}
								
								
							}else{
								self.showNewspaperTab=false;
								if(tab==5){
									$state.go("logged.scenarioWizard.info");
								}
							}
							
							retrieveCharacterAndOrder();
						
						}, function(reason){
							console.log("errore");
							$state.go("logged.dashboard");
						}
				);
				self.scenarioCover = CONSTANTS.urlScenarioCover(id);
				
			}
		}
		
		self.isScenarioActive = function(){
			
			if (self.scenario.status == 'ACTIVE')
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
										if(!data[j].bornDate){
											data[j].bornDate = {};
											data[j].bornDate.afterChrist = true;
										}
										if(!data[j].deadDate){
											data[j].deadDate = {};
											data[j].deadDate.afterChrist = true;
										}
										self.charactersServer[i]=data[j];
										self.currentCharacters[i] = angular.copy(data[j]);
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
					self.scenarioServer.characters[i].cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
				}
			if(self.scenario.attendees)
				for(var i=0;i<self.scenario.attendees.length; i++){
					self.scenario.attendees[i].cover = CONSTANTS.urlUserCover(self.scenario.attendees[i].id);
					self.scenarioServer.attendees[i].cover = CONSTANTS.urlUserCover(self.scenario.attendees[i].id);
				}
			if(self.scenario.collaborators)
				for(var i=0;i<self.scenario.collaborators.length; i++){
					self.scenario.collaborators[i].cover = CONSTANTS.urlUserCover(self.scenario.collaborators[i].id);
					self.scenarioServer.collaborators[i].cover = CONSTANTS.urlUserCover(self.scenario.collaborators[i].id);
				}
			self.scenario.teacherCreator.cover = CONSTANTS.urlUserCover(self.scenario.teacherCreator.id);
			self.scenarioServer.teacherCreator.cover = CONSTANTS.urlUserCover(self.scenario.teacherCreator.id);
			self.map = CONSTANTS.urlMedia(self.scenario.history.mapId);
		}
		
		
		
		var updateAssociated = function(){
			var teacherPlay=false;
			var attendees= new Array();
			
			if(self.scenario.attendees){
				attendees = angular.copy(self.scenario.attendees);
			}
			if(self.scenario.collaborators){
				
				attendees = attendees.concat(self.scenario.collaborators);
			}

			

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
						if(attendees){
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
			}
			self.notAssociatedAttendees = attendees;


			if(!teacherPlay)
				self.notAssociatedAttendees.push(self.scenario.teacherCreator);
			
		}
		
		/*------------------------------------------------------------------------------------------------------------------------ */
		
		
		self.showPopUpDeleteScenario = function (){
			if(self.scenario!=null)
				modalService.showModalDeleteScen(self.scenario);
		};
		
		self.showPopUpDeleteAttendee = function (a){
			modalService.showModalDeleteAttendee(a).then(
					function(response){
						if(response.firstname)
							self.deleteAttendee(response);
						else
							self.deleteInvited(response);
						alertingGeneric.addSuccess("Partecipante rimosso");
						
					}, function(reason){
						console.log("Errore - Rimozione partecipante annullata");
					});
		};
		
		self.showPopUpDeleteCollaborator = function (c){
			modalService.showModalDeleteCollaborator(c).then(
					function(response){
						
						self.deleteCollaborator(response);	
						alertingGeneric.addSuccess("Collaboratore rimosso");
						
					}, function(reason){
						console.log("Rimozione collaboratore annullata");
					});
		};
		
		self.showPopUpDeleteCharacter = function (c){
			modalService.showModalDeleteCharacter(c).then(
					function(response){
						self.deleteCharacter(c);
						alertingGeneric.addSuccess("Personaggio rimosso");
						
					}, function(reason){
						console.log("Rimozione personaggio annullata");
					});
		};
		
		var reInsertInSelectable = function(s){
			
			self.selectableStudents.push(s);
			
		}
//		var reInsertInSelectableCollaborators = function(c){
//			console.log("reInsertInSelectableCollaborators");
//			self.selectableCollaborators.push(c);
//		}
		
		var updateSelectableAttendees = function(){
			
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
		
		self.getPagedTeacherByRegex = function(regex){
			return apiService.getPagedTeacherByRegex(0, 10, regex).then(
						function(data){
							return filterListSelectableCollaborators(data.content);
							
						},
						function(reason){
							console.log("failed to get paged teacher by regex");
							console.log(reason);
						}
				
			);
			
			
		}
		
		self.selectNewJournalist = function(){
			return apiService.updateUserJournalist(self.scenario.id, self.selectedJournalist.id).then(
					function(data){
						if(self.actualJournalist!=null && self.actualJournalist!=""){
							var oldJournalist = angular.copy(self.actualJournalist);
							self.allPeopleInScenario.push(oldJournalist);
						}
						self.actualJournalist=angular.copy(self.selectedJournalist);
						self.selectedJournalist="";
						for(var i=0; i<self.allPeopleInScenario.length; i++){
							if(self.allPeopleInScenario[i].id == self.actualJournalist.id)
								self.allPeopleInScenario.splice(i,1);
						}
						
					},
					function(reason){
						console.log("failed to select new journalist");
						self.selectedJournalist="";
						console.log(reason);
					}
			
		);
			
		}
		
		var filterListSelectableCollaborators = function(l){
			
			var found=false;
			if(l){
				for(var i=0; i< l.length; i++){
					found=false;
					if(l[i].id == self.user.id){
						
						l.splice(i, 1);
						continue;
					}
					if(self.scenario.collaborators!=null){
						for(var j=0; j< self.scenario.collaborators.length; j++){
							
							if(l[i].id == self.scenario.collaborators[j].id){
								
								l.splice(i, 1);
								found = true;
								break;
							}
						}
					}
					if(found)
						continue;
						
				}
			}
			
			return l;
		}
		
//		var updateSelectableCollaborators = function(){
//			
//			if(self.scenarioServer && self.scenarioServer.collaborators && self.selectableCollaborators){
//			
//				for(var i=0; i<self.scenarioServer.collaborators.length; i++){
//			
//					for(var j=0; j<self.selectableCollaborators.length; j++){
//					
//						if(self.scenarioSever.collaborators[i].id==self.selectableCollaborators[j].id){
//							self.selectableCollaborators.splice(j,1);
//						}
//					}
//				}
//			}
//		}
		
		
		self.exitWizard = function(){
			self.saveInfo();
			self.checkOpenAccordion();
		}


	/*Choice map updates 
	  Array of two elements to manage what kind of map user wants to Choice
	  There is a boolean value that represents this choice ("realMap"). It is false by default,
	  in order to adapt to old open scenarios.
	*/
	self.kindOfMap = [];
	var real = {"name" : "Mappa reale", "tooltip" : "Scegli la mappa selezionando un'area sul planisfero", selected: self.scenario.realMap};
	var fantasy = {"name" : "Mappa di fantasia", "tooltip" : "Carica un'immagine ed utilizzala come mappa per il tuo scenario", selected: !self.scenario.realMap};
  self.kindOfMap.push(real);
	self.kindOfMap.push(fantasy);
  var center = userService.getCenter();
  
	self.switchMapChoice = function(position){
		console.log(userService.getBounds());
		console.log(userService.getCenter());
		for(var i=0; i<self.kindOfMap.length; i++){
			if(i!=position){
				self.kindOfMap[i].selected = !self.kindOfMap[position].selected;
			}
		}
		self.scenario.realMap = self.kindOfMap[0].selected;
		console.log(self.scenario.realMap);
	}
  
  self.openRealMapModal = function(){
    //var center = self.scenario.history.center;
    
    modalService.showRealMapTeacher(center);
  }
		
		self.saveInfo = function(){
			var scenarioDTO = {};
			scenarioDTO.name = self.scenario.name;
			scenarioDTO.description = self.scenario.description;
			scenarioDTO.history = self.scenario.history;
			if(self.scenario.realMap){
				var realMap = {};
				var northEast = {};
				var bounds = userService.getBounds();
				northEast.x = bounds.northEast.lat;
				northEast.y = bounds.northEast.lng;
				realMap.northEast = northEast;
				var southWest = {};
				southWest.x = bounds.southWest.lat;
				southWest.y = bounds.southWest.lng;
				realMap.southWest = southWest;
				var center = userService.getCenter();
				var c = {};
				c.x = center.lat;
				c.y = center.lng;
				realMap.center = c;
				realMap.zoom = center.zoom;
				realMap.tileUrl = userService.getTileUrl();
				scenarioDTO.history.realMap = realMap;
			}
			scenarioDTO.showRelationsToAll = self.scenario.showRelationsToAll;
			scenarioDTO.newspaperEnabled = self.scenario.newspaperEnabled;
            scenarioDTO.realMap = self.scenario.realMap;
			
			if(id==null){
				console.log("######################ID NULL");
				scenarioDTO.showRelationsToAll = true;
				scenarioDTO.newspaperEnabled = true;
				
				if(infoValidate()){
					apiService.createScenario(scenarioDTO).then(
							function(data){
								id = data.id;
								self.showNewspaperTab=true;
							},
							function(reason){								
								console.log("Errore creazione scenario");
							}
					);
				}else{
					console.log("fail infoValidate");
				}
			}else{
				console.log("######################ID NOT NULL");
				if(!isEquivalent(self.scenario, self.scenarioServer) && infoValidate()){
					console.log(scenarioDTO.newspaperEnabled);
					apiService.updateScenario(scenarioDTO, id).then(
							function(data){
								self.scenarioServer = data;
								self.scenario = angular.copy(data);
								console.log(self.scenario);
								if(self.scenario.newspaperEnabled)
									self.showNewspaperTab=true;
								else
									self.showNewspaperTab=false;
								self.actualJournalist=self.scenario.actualJournalist;
								
								updateCover();
								alertingGeneric.addSuccess("Scenario modificato");
							},
							function(reason){
								alertingGeneric.addWarning("Modifica scenario fallita");
							}
					);
				}else{
				}
			}
		}
		
		self.inviteStudents = function(){
			var emails = extractEmails(self.emailList);
			
			var emailsDTO=[];
			if(emails){
				for(var i=0; i<emails.length; i++){
					emailsDTO.push({"email": emails[i]});
				}
			}
			
			if(emailsDTO && emailsDTO.length>0 && id!=null){
				apiService.addUsersToScenario(emailsDTO,id).then(
						function(data){
							var diff = emailsDTO.length-data.length;
							if(data.length==1){
								if(emailsDTO.length==1)
									alertingGeneric.addSuccess("Studente invitato correttamente");
								else{
									if(diff==1)
										alertingGeneric.addSuccess(data.length+" studente invitato correttamente. (Non e'" +
											"stato possibile invitare "+diff+" studente)");
									else
										alertingGeneric.addSuccess(data.length+" studente invitato correttamente. (Non e'" +
												"stato possibile invitare "+diff+" studenti)");
								}
							}else if(data.length > 1){
								if(diff==0)
									alertingGeneric.addSuccess("Tutti gli studenti sono stati invitati correttamente");
								else{
									if(diff==1)
										alertingGeneric.addSuccess(data.length+" studenti invitati correttamente. (Non e'" +
											"stato possibile invitare "+diff+" studente)");
									else
										alertingGeneric.addSuccess(data.length+" studenti invitati correttamente. (Non e'" +
												"stato possibile invitare "+diff+" studenti)");
								}
									
							}
							for(var i=0; i<data.length; i++){
								if(data[i].firstname!=null){
									data[i].cover = CONSTANTS.urlUserCover(data[i].id);
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
							if(data.length>0)
								updateSelectableAttendees();
							else{
								if(emailsDTO.length==1)
									alertingGeneric.addWarning("Non e' stato possibile invitare l'utente associato alla mail inserita");
								else
									alertingGeneric.addWarning("Non e' stato possibile invitare nessuno degli utenti associati alle mail inserite");

							}
						},
						function(reason){
							console.log(reason);
						}
				);
			}else{
				alertingGeneric.addWarning("Inserire almeno una email valida");
				self.emailList=null;
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
//		        })
		        .success(function (data, status, headers, config) {
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
//		        })
		        .success(function (data, status, headers, config) {
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
							var name = angular.copy(self.newCharacter.name);
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
							self.newCharacter.bornDate = {};
							self.newCharacter.bornDate.afterChrist = true;
							self.newCharacter.deadDate = {};
							self.newCharacter.deadDate.afterChrist = true;
							self.charactersServer.push(angular.copy(self.newCharacter));
							self.currentCharacters.push(angular.copy(self.newCharacter));
							self.notAssociatedCharacters.push(angular.copy(self.newCharacter));
							self.newCharacter.cover = null;
							self.newCharacter.name = "";
							self.newCharacter.id = null;
							alertingGeneric.addSuccess("Il personaggio " + name +" e' stato creato correttamente");
							
						},
						function(reason){
							alertingGeneric.addWarning("Non è stato possibile creare il personaggio " + self.newCharacter.name);
						}
				);
			}
		}
		
		var getCharacter = function(i){
			var c = $q.defer();
			if(!self.charactersServer[i].isSync){
				apiService.getCharacter(id, self.charactersServer[i].id).then(
						function(data){
							var oldIsOpen = self.charactersServer[i].isOpen;
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

			self.currentCharacters[i].name = current.name;
			self.currentCharacters[i].nickname = current.nickname;
			self.currentCharacters[i].bornDate = current.bornDate;
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
			
			if(currentCharacterIndex!=-1){
				
				if(isUpdatedCharacter(self.currentCharacters[currentCharacterIndex], self.charactersServer[currentCharacterIndex])){
					if(isCurrentCharacterValid(self.currentCharacters[currentCharacterIndex])){
						//va fatta la put delle nuove informazioni ed alla fine va gestito l'aggiornamento del currentCharacter
						
						if(i!=currentCharacterIndex){
							syncCurrentCharacter(i, self.charactersServer[i]);
						}
						var charDTO = angular.copy(self.currentCharacters[currentCharacterIndex]);
						checkHistoricalDate(charDTO);
						apiService.updateCharacter(id, charDTO , self.charactersServer[currentCharacterIndex].id).then(
								function(data){
									self.charactersServer[currentCharacterIndex] = data;
									var cover = angular.copy(self.scenario.characters[currentCharacterIndex].cover);
									self.scenario.characters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
									self.scenario.characters[currentCharacterIndex].cover = cover;
									if(!data.bornDate){
										self.scenario.characters[currentCharacterIndex].bornDate = {};
										self.scenario.characters[currentCharacterIndex].bornDate.afterChrist = true;
									}
									if(!data.deadDate){
										self.scenario.characters[currentCharacterIndex].deadDate = {};
										self.scenario.characters[currentCharacterIndex].deadDate.afterChrist = true;
									}
									
									if(self.scenario.characters[currentCharacterIndex].userId!=null){
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
									alertingGeneric.addSuccess("Il personaggio " + data.name + " e' stato modificato correttamente");
									
								}
							,function(reason){
								alertingGeneric.addWarning("Non e' stato possibile modificare il personaggio ");
								var cover = angular.copy(self.currentCharacters[currentCharacterIndex].cover);
								var date = 
								self.currentCharacters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
								self.currentCharacters[currentCharacterIndex].cover = cover;
							}
						);
					}else{ //la validazione delle info digitate è fallita
						//TODO
						alertingGeneric.addWarning("Non e' stato possibile modificare il personaggio");
						var cover = angular.copy(self.currentCharacters[currentCharacterIndex].cover);
						self.currentCharacters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
						self.currentCharacters[currentCharacterIndex].cover = cover;
						
						if(currentCharacterIndex!=i)
							currentCharacterIndex=i;
						else
							currentCharacterIndex=-1;
					}
				}else{ 
					//TODO il current character non differisce rispetto alle info che sono sul server quindi non è necessario fare la put sul server
					/*TO CONTINUE*/
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
		
		var checkHistoricalDate = function(charDTO){
			
			if(charDTO.bornDate && !charDTO.bornDate.year && !charDTO.bornDate.month && !charDTO.bornDate.day)
				charDTO.bornDate = null;
			if(charDTO.deadDate && !charDTO.deadDate.year && !charDTO.deadDate.month && !charDTO.deadDate.day)
				charDTO.deadDate = null;
		}
		
		self.addCollaborator = function(){
			
			
			apiService.addCollaboratorToScenario(self.selectedCollaborator.id, id).then(
					function(data){
							if(self.scenarioServer.collaborators==null)
								self.scenarioServer.collaborators = new Array();
							self.scenarioServer.collaborators.push(data);
							self.selectedCollaborator="";
							if(self.scenario.collaborators==null)
								self.scenario.collaborators = new Array();
							self.scenario.collaborators.push(angular.copy(data));
							if(self.notAssociatedAttendees==null)
								self.notAssociatedAttendees = new Array();
							var newCollaborator = angular.copy(data);
							alertingGeneric.addSuccess(newCollaborator.firstname + " "+ newCollaborator.lastname +" aggiunto correttamente");
							newCollaborator.cover = CONSTANTS.urlUserCover(data.id);
							self.notAssociatedAttendees.push(newCollaborator);
						}, 
					function(reason){
							alertingGeneric.addWarning("Errore nell'aggiunta del collaboratore. Operazione consentita solo al creatore dello scenario.");
					});
		}
		
		self.addAttendee = function(attendee){
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
						alertingGeneric.addSuccess(attendee.firstname + " "+ attendee.lastname +" aggiunto correttamente");
						for(var j=0; j<self.selectableStudents.length; j++){
							if(self.selectableStudents[j].id==attendee.id){
								self.selectableStudents.splice(j,1);
							}
								
						}
					},
					function(reason){
						if(emailsDTO.length==1)
							alertingGeneric.addWarning("Errore nell'aggiunta del partecipante");
						
						
					}
			);
			
		}
		
		self.enterInScenario = function(){
			self.exitWizard();
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
						alertingGeneric.addWarning("Errore nella rimozione del partecipante.");
						console.log("Delete attendee failed: "+reason);
					}
			)
		}
		
		self.removeJournalist = function(){
			apiService.removeUserFromJournalist(self.scenario.id).then(
					function(data){
						
						self.allPeopleInScenario.push(self.actualJournalist);
						self.actualJournalist=null;
					},
					function(reason){
						alertingGeneric.addWarning("Errore nella rimozione del giornalista.");
						console.log("Delete journalist failed: "+reason);
					}
			)
		}
		
		
		self.deleteCollaborator = function(c){
			apiService.removeCollaboratorFromScenario(id, c.id, false).then(
					function(data){
						for(var i=0; i<self.scenarioServer.collaborators.length; i++){
							if(self.scenarioServer.collaborators[i].id==c.id)
								self.scenarioServer.collaborators.splice(i,1);
							if(self.scenario.collaborators[i].id==c.id)
								self.scenario.collaborators.splice(i,1);
						}
						manageAssociationOnAttendeeDeletion(c);
						//reInsertInSelectableCollaborators(c);
					},
					function(reason){
						alertingGeneric.addWarning("Errore nella rimozione del collaboratore. Operazione consentita solo al creatore dello scenario.");
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
								currentCharacterIndex = -1;
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
		
		self.createAssociationWithoutDrag = function(){
			var association = {};
			association.attendee = self.lastUserClicked;
			association.character = self.lastCharacterClicked;
			
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						/*TODO allineare charactersServer*/
						self.associations.push(angular.copy(association));
						
						if(self.notAssociatedAttendees){
							for(var i=0; i<self.notAssociatedAttendees.length; i++){
								if(self.notAssociatedAttendees[i].id == association.attendee.id){
									self.notAssociatedAttendees.splice(i,1);
									break;
								}
							}
						}
						if(self.notAssociatedCharacters){
							for(var i=0; i<self.notAssociatedCharacters.length; i++){
								if(self.notAssociatedCharacters[i].id == association.character.id){
									self.notAssociatedCharacters.splice(i,1);
									break;
								}
							}
						}
						
						
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		self.dropSuccessHandlerCharacter =function($event, indexAttendee){

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
			self.exitWizard();
			var scenarioDTO = {"status": "ACTIVE"};
			scenarioDTO.showRelationsToAll = self.scenario.showRelationsToAll;
			scenarioDTO.newspaperEnabled = self.scenario.newspaperEnabled;
			apiService.updateScenario(scenarioDTO, id).then(
					function(data){
						self.scenarioServer=data;
						$state.go("logged.scenario.posts", {id : id});
					},
					function(reason){
						console.log("C'è stato un problema, impossibile attivare lo scenario");
					}
			);
		}
		
		self.closeScenario = function(){
			self.exitWizard();
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
		            self.scenario.history.mapId = data.id;
		            var scenarioDTO = {};
		            scenarioDTO.history = {};
		            scenarioDTO.history.mapId = data.id;
		            apiService.updateScenario(scenarioDTO, self.scenario.id).then(
		            		function(data){
		            			self.scenarioServer = data;
		            		},
		            		function(reason){
		            			console.log("ERROR UPLOAD MAP");
		            		}
		            );
		            var date = new Date();
		            self.map = CONSTANTS.urlMedia(data.id)+"?"+date.toString() ;
		        });
			}
		}
		
		self.showDeadDatePicker = false;
		self.switchShowDeadDate = function(){
			if(!self.showDeadDatePicker && self.showBornDatePicker){
				self.showBornDatePicker = false;
			}
			self.showDeadDatePicker = !self.showDeadDatePicker;
		}
		
		self.showBornDatePicker = false;
		self.switchShowBornDate = function(){
			if(!self.showBornDatePicker && self.showDeadDatePicker){
				self.showDeadDatePicker = false;
			}
			self.showBornDatePicker = !self.showBornDatePicker;
		}
		
		self.hideDatePicker = function(){
			self.showDeadDatePicker = false;
			self.showBornDatePicker = false;
		}
		
		
/*--------------------------------------UTILITY----------------------------------------------------*/
		
		var onStartup = function(){
			var path = $location.path();
			var tabString = path.substr(path.lastIndexOf('/') + 1);
			if(tabString=="info"){
				tab=0;
			}else if(tabString=="partecipanti"){
				tab=1;
			}else if(tabString=="personaggi"){
				tab=2;
			}else if(tabString=="associazioni"){
				tab=3;
			}else if(tabString=="collaboratori"){
				tab=4;
			}else if(tabString=="giornale"){
				tab=5;
			}
		}
		
		self.checkOpenAccordion = function(){
			if(self.scenario.characters){
				for(var i=0; i<self.scenario.characters.length; i++){
					if(self.scenario.characters[i].isOpen){
						self.openAccordion(i);
						break;
					}
				}
			}
		}
		
		var updateAllPeopleInScenario = function(){
			self.allPeopleInScenario=[];
			self.allPeopleInScenario = self.allPeopleInScenario.concat(self.notAssociatedAttendees);
			if(self.associations!=null){
				for(var i=0; i<self.associations.length; i++){
					self.allPeopleInScenario.push(self.associations[i].attendee);
				}
			}
		}
		
		self.changeStateTab = function(newDestination){
			if(newDestination==5)
				updateAllPeopleInScenario();
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
				case 5: {
					tab = newDestination;
					break;
				}
			}
		}
		
		var isEquivalent =  function(a, b) {
	
			if(a.name != b.name){
				return false;
			}
			if( a.description != b.description){
				return false;
			}
				
			r = angular.equals(a.history.startDate, b.history.startDate);
			
			if (r == false){
				return false;
			}
			r = angular.equals(a.history.endDate, b.history.endDate);
			if (r == false){
				return false;
			}
			
			if( a.showRelationsToAll != b.showRelationsToAll){
				return false;
			}
			if( a.newspaperEnabled != b.newspaperEnabled){
				return false;
			}
			

			return true;

		}
		var dateValidate = function(){
			
			//controllo se data inizio è valida
			if(self.scenario.history && self.scenario.history.startDate.year && !checkDate(self.scenario.history.startDate.year) ){
				alertingGeneric.addWarning("Data non valida");
				self.scenario = angular.copy(self.scenarioServer);
				
				return false;
			}
			//controllo se la data fine è valida
			if(self.scenario.history && self.scenario.history.endDate.year && !checkDate(self.scenario.history.endDate.year)){
				alertingGeneric.addWarning("Data non valida");
				self.scenario = angular.copy(self.scenarioServer);
				
				return false;
			}
			
			//controllo che data fine non preceda data inizio
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate ){
				

				if (!checkIfEndIsAfterStart(self.scenario.history.startDate , self.scenario.history.endDate )){
					self.scenario = angular.copy(self.scenarioServer);
					
					return false;
				}
					
			}
			return true;
		}
		
		
		var infoValidate = function(){
			
			//valido le date 
			if (!dateValidate())
				return false;
			
			var ret=true;
			
			if(!self.scenario.name || self.scenario.name.length<2){
				
				alertingGeneric.addWarning("Il nome dello scenario deve essere di almeno 2 caratteri");
				ret=false;
				self.scenario= angular.copy(self.scenarioServer);
				
			}
//			if(!self.scenario.description){
//				if(self.scenarioServer.description){
//					self.scenario.description=angular.copy(self.scenarioServer.description);
//				}else{
//					self.scenario.description="";
//				}
//			}
			
			if(self.scenario.history && self.scenario.history.startDate){
				if(!self.scenario.history.startDate.afterChrist && (parseInt(self.scenario.history.startDate.year)>4712)){   
					alertingGeneric.addWarning("La minima data rappresentabile e': 1 gennaio 4712 AC");
					return false;
				}
			}
			
			if(!self.scenario.history || !self.scenario.history.startDate){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.startDate){
					self.scenario.history.startDate=angular.copy(self.scenarioServer.history.startDate);
				}else{
					self.scenario.history.startDate="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.endDate){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.endDate){
					self.scenario.history.endDate=angular.copy(self.scenarioServer.history.endDate);
				}else{
					self.scenario.history.endDate="";
				}
			}
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate){
				if(self.scenario.history.startDate>self.scenario.history.endDate){
					ret=false;
					if(self.scenarioServer.history && self.scenarioServer.history.endDate){
						self.scenario.history.endDate=angular.copy(self.scenarioServer.history.endDate);
					}else{
						self.scenario.history.endDate="";
					}
					if(self.scenarioServer.history && self.scenarioServer.history.startDate){
						self.scenario.history.startDate=angular.copy(self.scenarioServer.history.startDate);
					}else{
						self.scenario.history.startDate="";
					}
				}
			}
				
			
			return ret;
		}
		
		
		var checkIfEndIsAfterStart = function(startDate, endDate){
			if(startDate.afterChrist && endDate.afterChrist){  //entrambe dopo cristo
				if(startDate.year > endDate.year){  //startDate.year > endDate.year ERR
					alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
					return false;
				}else if (startDate.year < endDate.year){ //startDate.year < endDate.year GOOD
					return true;
				}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
					if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
						alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
						return false;
					}else if(
						startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
						return true;
					}
					else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
						if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
							alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
							return false;
						}
						else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
							return true;
						}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
							return true;
						}
					}
				}
					
			}
			else if(!startDate.afterChrist && !endDate.afterChrist){  //entrambe avanti cristo
				if(startDate.year < endDate.year){  //startDate.year < endDate.year ERR
					alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
					return false;
				}else if (startDate.year > endDate.year){ //startDate.year > endDate.year GOOD
					return true;
				}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
					if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
						alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
						return false;
					}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
						return true;
					}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
						if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
							alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
							return false;
						}
						else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
							return true;
						}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
							return true;
						}
					}
				}
			}
			else if(!startDate.afterChrist && endDate.afterChrist){   //inizio a.c. e fine d.c.  SICURAMENTE BUONO
				return true;
			}
			else{																				//inizio d.c. e fine a.c. SICURAMENTE ERRATO
				alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
				return false;
			}
		}

		var extractEmails = function(text){
		    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		}	
		
		var isUpdatedCharacter = function(newChar, oldChar){
			
			if(newChar.name!=oldChar.name)
				return true;
			if(newChar.nickname!=oldChar.nickname)
				return true;
			
			if(newChar.bornDate && oldChar.bornDate){
				if(newChar.bornDate.day!=oldChar.bornDate.day)
					return true;
				if(newChar.bornDate.month!=oldChar.bornDate.month)
					return true;
				if(newChar.bornDate.year!=oldChar.bornDate.year)
					return true;
				if(newChar.bornDate.afterChrist!=oldChar.bornDate.afterChrist)
					return true;
				
			}if(newChar.deadDate && oldChar.deadDate){
				if(newChar.deadDate.day!=oldChar.deadDate.day)
					return true;
				if(newChar.deadDate.month!=oldChar.deadDate.month)
					return true;
				if(newChar.deadDate.year!=oldChar.deadDate.year)
					return true;
				if(newChar.deadDate.afterChrist!=oldChar.deadDate.afterChrist)
					return true;
			}
			
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
			
			if(char.deadDate.year && !checkDate(char.deadDate.year))
				return false;
			if(char.bornDate.year && !checkDate(char.bornDate.year))
				return false;
			if(char.deadDate && char.bornDate && char.deadDate.year && char.bornDate.year){
				if(!checkIfEndIsAfterStart(char.bornDate, char.deadDate)){
					return false;
				}
			}
			return true;
		}
		
		var checkDate = function(year){
			if(isNaN(year)){
				return false;
			}else{
				return true;
			}  
		}

		onStartup();

}]);
	

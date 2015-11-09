angular.module("smiled.application").directive("insertStatus", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService', 'alertingGeneric',
                                     function(CONSTANTS, apiService, Upload, $q, modalService, alertingGeneric){
	return {
		templateUrl: "assets/private/partials/insert-status-template.html",
		scope : {
			character: "=",
			posts: "=",
			scenario: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.startDate = angular.copy(self.scenario.history.startDate);
			if(!self.startDate.afterChrist)
				self.startDate.year*=-1;
			self.endDate = angular.copy(self.scenario.history.endDate);
			if(!self.endDate.afterChrist)
				self.endDate.year*=-1;
			/*Initialize newPost variable*/
			self.newPost = {};
			self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
			self.newPost.julianDayNumber="";
			self.newPost.timeNumber="";
			self.newPost.image = new Array();
			self.newPost.file  = new Array();
			self.newPost.tags = new Array();
			self.sendPostEnable = true;
			
			/*--------------------------*/
			
			
			/*Check character presence. If absent don't show template*/
			if(self.character && self.character.id){
				self.showInsertStatus = true;
				console.log(self.character);
			}else{
				self.showInsertStatus = false;
				console.log(self.character);
			}
			/*--------------------------------------------------------*/
			
			/*Variable and function to switch open/closed historicalDatePicker*/
			self.showDatePicker = false;
			self.setDateNewPost = function(){
//				self.showDatePicker = !self.showDatePicker;
				modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.newPost);
			}
			/*----------------------------------------------------------------*/
			
			var validateDate = function(){
				
				if(self.newPost.julianDayNumber && self.newPost.timeNumber)
					return true;
				else 
					return false;
//				var outStart=true;
//				var outEnd=true;
//				
//				if(self.newPost.date.year==self.scenario.history.startDate.year){
//					if(self.newPost.date.month==self.scenario.history.startDate.month){
//						if(self.newPost.date.day>=self.scenario.history.startDate.day){
//							outStart=false;
//						}
//					}else if(self.newPost.date.month>self.scenario.history.startDate.month){
//						outStart=false;
//					}
//				}else if(self.newPost.date.year>self.scenario.history.startDate.year){
//					outStart=false;
//				}else{
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}
//				
//				if(self.newPost.date.year==self.scenario.history.endDate.year){
//					if(self.newPost.date.month==self.scenario.history.endDate.month){
//						if(self.newPost.date.day<=self.scenario.history.endDate.day){
//							outEnd=false;
//						}
//					}else if(self.newPost.date.month<self.scenario.history.endDate.month){
//						outEnd=false;
//					}
//				}else if(self.newPost.date.year<self.scenario.history.endDate.year){
//					outEnd=false;
//				}
//				
//				if(outStart || outEnd){
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}else
//					return true;
			}
			
			/*Create new Status*/
			self.savePost = function(){
				if(!validateDate())
					self.setDateNewPost();
				else{
					if(self.sendPostEnable && self.newPost.content){
						self.sendPostEnable=false;
						var toSendPost = {};
						toSendPost.text = self.newPost.content;
						toSendPost.julianDayNumber = self.newPost.julianDayNumber;
						toSendPost.timeNumber = self.newPost.timeNumber;
						toSendPost.status = "PUBLISHED";
						toSendPost.place = self.newPost.place;
						toSendPost.imageMetaId = new Array();
						toSendPost.fileMetaId = new Array();
						toSendPost.tags = new Array();
						
						for(var i=0; i<self.newPost.image.length; i++){
							toSendPost.imageMetaId.push(self.newPost.image[i].id);
						}
							
						for(var i=0; i<self.newPost.file.length; i++){
							toSendPost.fileMetaId.push(self.newPost.file[i].id);
						}
						
						for(var i=0; i<self.newPost.tags.length; i++){
							toSendPost.tags.push(self.newPost.tags[i].id);
						}
						
						apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
								function(data){
									console.log("sended: "+data);
									self.newPost.content="";
									self.newPost.image=[];
									self.newPost.file=[];
									self.newPost.julianDayNumber="";
									self.newPost.timeNumber="";
									self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
									self.sendPostEnable= true;
									self.newPost.place = null;
									self.newPost.tags = [];
									apiService.getSingleStatus(self.scenario.id, data.id).then(
											function(data){
												self.posts.unshift(data);
												if(self.posts[0].imageMetaId){
													self.posts[0].imagesUrl = new Array();
													for(var i=0; i<self.posts[0].imageMetaId.length; i++){
														self.posts[0].imagesUrl[i].push(CONSTANTS.urlMedia(self.posts[0].imageMetaId[i]));
													}
												}
												self.posts[0].character.cover = CONSTANTS.urlCharacterCover(self.scenario.id,self.posts[0].character.id);
											},
											function(reason){
												console.log("error in insert new post in array"+reason);
											}
									);
								},
								function(reason){
									self.sendPostEnable=true;
									console.log("error in send status: "+reason);
								}
						);
					}else{
						angular.element(document.querySelector('#textContentStatus')).focus();
					}
				}
			}
			/*--------------Create new post end------------------------------------------*/
			
			/*--------------Create draft post start------------------------------------------*/
			
			/*AGGIUNGERE CONTROLLO DATE - guarda validateDAte()*/
			self.draftNewPost = function(){
				if(self.sendPostEnable && self.newPost.content){
					self.sendPostEnable=false;
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.julianDayNumber = self.newPost.julianDayNumber;
					toSendPost.timeNumber = self.newPost.timeNumber;
					toSendPost.status = "DRAFT";
					toSendPost.place = self.newPost.place;
					toSendPost.imageMetaId = new Array();
					toSendPost.fileMetaId = new Array();
					toSendPost.tags = new Array();
					
					for(var i=0; i<self.newPost.image.length; i++){
						toSendPost.imageMetaId.push(self.newPost.image[i].id);
					}
						
					for(var i=0; i<self.newPost.file.length; i++){
						toSendPost.fileMetaId.push(self.newPost.file[i].id);
					}
					
					for(var i=0; i<self.newPost.tags.length; i++){
						toSendPost.tags.push(self.newPost.tags[i].id);
					}
					apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
							function(data){
								console.log("sended draft: "+data);
								self.newPost.content="";
								self.newPost.image=[];
								self.newPost.file=[];
								self.newPost.julianDayNumber="";
								self.newPost.timeNumber="";
								self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
								self.sendPostEnable= true;
								self.newPost.place = null;
								self.newPost.tags = [];
								
								alertingGeneric.addSuccess("Bozza salvata con successo.");
					},
							function(reason){
								self.sendPostEnable=true;
								console.log("error in send status: "+reason);
								alertingGeneric.addWarning("Impossibile salvare la bozza. Riprova per favore.");
							}
					);
				}else{
					angular.element(document.querySelector('#textContentStatus')).focus();
				}	
			}
			/*--------------Create draft post end------------------------------------------*/
			
			/*Public function to add/remove new image to status*/
			self.addImageToNewPost = function(file){
				uploadMediaToPost(file,true);
			}
			
			self.removeImage =function(image){
				for(var i=0; i<self.newPost.image.length; i++){
					if(self.newPost.image[i].id==image.id){
						self.newPost.image.splice(i,1);
					}
				}
			}
			self.getMedia = function(id){
				console.log("id dell'img:" + id);
				return CONSTANTS.urlMedia(id);
			}
			/*------------------------------------------*/
			
			/*Public function to add/remove new file to status*/
			self.addFileToNewPost = function(file){
				console.log("add File");
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				for(var i=0; i<self.newPost.file.length; i++){
					if(self.newPost.file[i].id==file.id){
						self.newPost.file.splice(i,1);
					}
				}
			}
			/*------------------------------------------*/
			
			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				if(file && file.length){
					Upload.upload({
			            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
			            headers : {
			                'Content-Type': file.type
			            },
			            file: file
			        })
//			            .progress(function (evt) {
//			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//			            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//			        })
			        .success(function (data, status, headers, config) {
			           console.log("SUCCESS UPLOAD");
			           console.log(data);
			           if(isImage){
				           var uploadedFile = {};
			        	   uploadedFile.id = data.id;
			        	   uploadedFile.name = config.file[0].name;
			        	   self.newPost.image.push(uploadedFile);
			           }else{
				           var uploadedFile = {};
				           uploadedFile.id = data.id;
				           uploadedFile.name = config.file[0].name;
			        	   var split = uploadedFile.name.split(".");
			        	   var type = split[split.length-1];
			        	   uploadedFile.fileType =  null;
			        	   if(type == 'jpg' || type == 'png' || type=='gif'){
			        		   uploadedFile.fileType = 'img';
			        	   }else if(type == 'pdf'){
			        		   uploadedFile.fileType = 'pdf';
			        	   }else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
			        		   uploadedFile.fileType = 'doc';
			        	   }else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
			        		   uploadedFile.fileType = 'ppt';
			        	   }else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
			        		   uploadedFile.fileType = 'excel';
			        	   }
			        	   self.newPost.file.push(uploadedFile);
			           }
			        });
				}
			}
			/*-----------------------------------------------------*/
			
			
			/*Function to pass to autocomplete of tag-input-directive*/
			self.search = function($query,isChar){
				console.log("SEARCH");
				var selectable;
				self.suggestions = new Array();
				if(isChar)
					selectable=self.scenario.characters;
				else{
					if(self.scenario.attendees)
						selectable=self.scenario.attendees;
					if(self.scenario.collaborators)
						selectable.push.apply(self.scenario.collaborators);
					selectable.push(self.scenario.teacherCreator);
				}
				var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
				if(selectable){
					if(!isChar){
						for(var i=0; i<selectable.length; i++){
							if(regex.test(selectable[i].firstname) || regex.test(selectable[i].lastname)){
								var suggestion = {};
								suggestion.name=selectable[i].lastname+" "+selectable[i].firstname;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlUserCover(selectable[i].id);
								self.suggestions.push(suggestion);
							}
						}
					}else if(isChar){
						console.log("search->character");
						console.log(regex.source);

						if(!self.scenario.id){
							throw new Error("Unsupported type");
						}
						for(var i=0; i<selectable.length; i++){
						
							if(regex.test(selectable[i].name)){
								var suggestion = {};
								suggestion.name=selectable[i].name;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlCharacterCover(self.scenario.id,selectable[i].id);
								self.suggestions.push(suggestion);
								console.log("search->addSuggestion "+i);
							}

						}
					}else
						throw new Error("Unsupported type");
				}
				var result = $q.defer();
				result.resolve(self.suggestions);
				return result.promise;
			}
			/*-------------------------------------------------------*/
			
			/*Function to show/hide tag box*/
			self.colorTagsMarker = {};
			self.stringTags="";
			self.tagIsSet = false;
			self.showTagBox=false;
			self.switchShowTagBox =function(){
				self.showTagBox=!self.showTagBox;
			}
			self.hideTagBox =function(){
				self.showTagBox=false;
			}
			
			/*-----------------------------*/
			
			/*Function to open map*/
			self.colorMapMarker = {};
			self.setPositionNewPost = function(){
				var map;
				if(self.scenario.history.mapId) 
					map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)+".jpg"};
				else
					map = null;
				
				modalService.showModalOpenMap(self.newPost,map);

			}
			/*--------------------*/


		}],
		controllerAs: "insertStatus",
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('insertStatus.newPost.image.length', function(val){
				if(val>0){
					ctrl.colorImageMarker = {'color': '#89b151'};
				}else{
					ctrl.colorImageMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertStatus.newPost.file.length', function(val){
				if(val>0){
					ctrl.colorFileMarker = {'color': '#89b151'};
				}else{
					ctrl.colorFileMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertStatus.newPost.place', function(newVal, oldVal){
				if(newVal && newVal.x && newVal.y){
					ctrl.colorMapMarker = {'color': '#89b151'};
				}else{
					ctrl.colorMapMarker = {'color': 'dark grey'};
				}
			});
			
			scope.$watch('insertStatus.newPost.tags.length', function(val){
				if(val>0){
					ctrl.tagIsSet=true;
					ctrl.colorTagsMarker = {'color': '#89b151'};						
					ctrl.stringTags="";
					for(var i=0;i<val;i++){
						if(i>=2){						
							ctrl.stringTags+=" e altri personaggi";
							break;
						}else{
							if(i<val-1)
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name+", ";
							else
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name;
						}
						
					}
				}else{
					ctrl.colorTagsMarker = {'color': 'dark grey'};
					ctrl.stringTags="";
					ctrl.tagIsSet=false;
				}
			});
			
		}
	}
}]);


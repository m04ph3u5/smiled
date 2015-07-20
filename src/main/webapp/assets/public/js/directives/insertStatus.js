angular.module("smiled.application").directive("insertStatus", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'Lightbox',
                                     function(CONSTANTS, apiService, Upload, $q, Lightbox){
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
			/*Initialize newPost variable*/
			self.newPost = {};
			self.newPost.date = {};
			self.newPost.date.afterChrist = true;
			self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;

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
				self.showDatePicker = !self.showDatePicker;
			}
			/*----------------------------------------------------------------*/
			
			
			/*Create new Status*/
			self.savePost = function(){
				self.setDateNewPost();
				if(self.sendPostEnable && self.newPost.content && (self.newPost.date.formatted!=CONSTANTS.insertHistoricalDate)){
					self.sendPostEnable=false;
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.historicalDate = self.newPost.date;
					toSendPost.status = "PUBLISHED";
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
								self.newPost.date={afterChrist : true};
								self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
								self.sendPostEnable= true;
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
					//TODO gestione alert errore
				}
			
			}
			/*--------------Create new post end------------------------------------------*/
			
			/*--------------Create draft post start------------------------------------------*/
			self.draftNewPost = function(){
				if(self.sendPostEnable && self.newPost.content){
					self.sendPostEnable = false;
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.historicalDate = self.newPost.date;
					toSendPost.status = "DRAFT";
					apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
							
							function(data){
								
								console.log("drafted: "+data);
								self.newPost.content="";
								self.newPost.image=[];
								self.newPost.file=[];
								self.newPost.date={afterChrist : true};
								self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
								self.sendPostEnable = true;
							},
							function(reason){
								self.sendPostEnable = true;
								console.log("error in send status: "+reason);
							}
					);
				}else{
					//TODO gestione alert errore
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
			self.showTagBox=false;
			self.switchShowTagBox =function(){
				self.showTagBox=!self.showTagBox;
			}
			
			/*-----------------------------*/
			
			/*Function to open map*/
			self.setPositionNewPost = function(){
				console.log("setPositionNewMap");
				var mapsArray = [];
				console.log(CONSTANTS.urlMedia(self.scenario.history.mapId));
				var map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)+".jpg"};
				mapsArray.push(map);
				Lightbox.openModal(mapsArray,0);
			}
			/*--------------------*/

		}],
		controllerAs: "insertStatus"
	}
}]);


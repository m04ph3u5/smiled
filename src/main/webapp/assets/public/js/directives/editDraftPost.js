angular.module("smiled.application").directive('editDraftPost',[ 'apiService', 'CONSTANTS', 'modalService', 'Upload', '$state', '$q',
    function(apiService, CONSTANTS, modalService, Upload, $state, $q){
		return {
			templateUrl: "assets/private/partials/edit-draft-post-directive.html",
			scope : {
				posts : "=",
				postId : "@",
				user : "=",
			},
			controller : ['$scope' , function($scope){
				var self = this;
				self.scenario = {};
				self.date={};		
				self.colorMapMarker = {};
				self.colorImageMarker = {};
				self.colorFileMarker = {};
				self.realDateFormat = CONSTANTS.realDateFormatWithHour;
				self.sendPostEnable = true;
				self.post = {};
				if(self.postId && self.posts){
					for(var i=0;i<self.posts.length; i++){
						if(self.posts[i].id==self.postId){
							self.post = self.posts[i];
							break;
						}
					}
				}
				self.newPost = angular.copy(self.post);
				self.newPost.image = new Array();
				self.newPost.file  = new Array();
				self.newPost.tags = new Array();
				self.newPost.toDeleteImage = new Array();
				self.newPost.toDeleteFile = new Array();
				
				var calculateType = function(uploadedFile){
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
				}

				var updateMediaAndTagOnStart = function(){
					if(self.post.imagesMetadata){
						for(var i=0; i<self.post.imagesMetadata.length; i++){
							var s = {};
							s.id = self.post.imagesMetadata[i].id;
							s.name = self.post.imagesMetadata[i].originalName;
							self.newPost.image.push(angular.copy(s));
						}
					}
					
					if(self.post.filesMetadata){
						for(var i=0; i<self.post.filesMetadata.length; i++){
							var s = {};
							s.id = self.post.filesMetadata[i].id;
							s.name = self.post.filesMetadata[i].originalName;
							calculateType(s);
							self.newPost.file.push(angular.copy(s));
						}
					}
					
					if(self.post.tags){
						for(var i=0; i<self.post.tags.length; i++){
							var s = {};
							s.id = self.post.tags[i].id;
							s.name = self.post.tags[i].firstname;
							if(self.post.tags[i].lastname){
								s.name+=" "+self.post.tags[i].lastname;
							}
							self.newPost.tags.push(angular.copy(s));
						}
					}
				}
				
				updateMediaAndTagOnStart();
				apiService.getScenario(self.post.scenarioId).then(
						function(data){
							self.scenario = data;
							self.startDate = angular.copy(self.scenario.history.startDate);
							if(!self.startDate.afterChrist)
								self.startDate.year*=-1;
							self.endDate = angular.copy(self.scenario.history.endDate);
							if(!self.endDate.afterChrist)
								self.endDate.year*=-1;
						},
						function(reason){
							console.log("Impossibile recuperare lo scenario");
							console.log(reason);
						}
				);
				
				/*Variable and function to switch open/closed historicalDatePicker*/
				self.showDatePicker = false;
				self.setDateNewPost = function(){
//					self.showDatePicker = !self.showDatePicker;
					modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.newPost);
				}
				
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
							
				var getMonthString = function(month){
					return CONSTANTS.monthString(month);
				} 

				var julianNumberToDate = function(jd, date){
					var l = jd + 68569;
					var n = parseInt(( 4 * l ) / 146097);
					l = l - parseInt(( 146097 * n + 3 ) / 4);
					var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
					l = l - parseInt(( 1461 * i ) / 4) + 31;
					var j = parseInt(( 80 * l ) / 2447);
					date.day = l - parseInt(( 2447 * j ) / 80);
					l = parseInt(j / 11);
					date.month = j + 2 - ( 12 * l );
					date.year = 100 * ( n - 49 ) + i + l;
					date.dow = jd%7;
				}
				
				
				var getTimeToSeconds=function(timeNumber,t){
	        		t.hours=parseInt(timeNumber/3600);
	        		timeNumber=timeNumber%3600;
	        		t.minutes=parseInt(timeNumber/60);
	        		timeNumber=timeNumber%60;
	        		t.seconds=timeNumber;
	        	}
				
				self.formatDate = function(jd, timeNumber){
					julianNumberToDate(jd, self.date);
					var era = self.date.year > 0 ? "" : " a.C.";
					var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
					var f = self.date.day+" "+s;
					if(timeNumber){
						var t = {};
						getTimeToSeconds(timeNumber, t);
						f+=" "+t.hours+":";
						if(t.minutes<10)
		        			f+="0"+t.minutes;
		        		else
		        			f+=t.minutes;
					}
					return f;
				}
				
				if(self.newPost.julianDayNumber)
					self.newPost.formattedDate = self.formatDate(self.newPost.julianDayNumber, self.newPost.timeNumber);
				else
					self.newPost.formattedDate = CONSTANTS.insertHistoricalDate;
				
				
				self.updatePositionPost = function(){
					var map=null;
					if(self.scenario.history.mapId)
						map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
					
					modalService.showModalOpenMap(self.newPost,map);
				}
				
				
				
				/*Public function to add/remove new image to status*/
				self.addImageToNewPost = function(file){
					uploadMediaToPost(file,true);
				}
				
				self.removeImage =function(image){
					var id = angular.copy(image.id)
					modalService.showModalDeleteResource(image).then(
							function(data){
								apiService.deleteMedia(id, self.post.id).then(
										function(data){
											for(var i=0; i<self.newPost.image.length; i++){
												if(self.newPost.image[i].id==id){
													self.newPost.image.splice(i,1);
													console.log("Immagine eliminato")
												}
											}
										},
										function(reason){
											console.log("Impossibile eliminare immagine");
										}
								);
							},
							function(reason){
								console.log("Eliminazione annullata");
							}
					);
				}
				self.getMedia = function(id){
					console.log("id dell'img:" + id);
					return CONSTANTS.urlMediaThumb(id);
				}
				/*------------------------------------------*/
				
				/*Public function to add/remove new file to status*/
				self.addFileToNewPost = function(file){
					console.log("add File");
					uploadMediaToPost(file,false);
				}
				self.removeFile =function(file){
					var id = angular.copy(file.id);
					modalService.showModalDeleteResource(file).then(
							function(data){
								apiService.deleteMedia(id, self.post.id).then(
										function(data){
											for(var i=0; i<self.newPost.file.length; i++){
												if(self.newPost.file[i].id==id){
													self.newPost.file.splice(i,1);
													console.log("File eliminato")
												}
											}
										},
										function(reason){
											console.log("Impossibile eliminare file");
										}
								);
							},
							function(reason){
								console.log("Eliminazione annullata");
							}
					);
				
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
//				            .progress(function (evt) {
//				            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//				            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//				        })
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
				        	   calculateType(uploadedFile);
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
				
				
				
				var validateDate = function(){
					
					if(self.newPost.julianDayNumber && self.newPost.timeNumber)
						return true;
					else 
						return false;
				}
				
				
				/*--------------Create draft post start------------------------------------------*/
				
				/*AGGIUNGERE CONTROLLO DATE - guarda validateDAte()*/
				self.draftNewPost = function(publish){
					if(self.sendPostEnable && self.newPost.text){
						self.sendPostEnable=false;
						var toSendPost = {};
						toSendPost.text = self.newPost.text;
						toSendPost.julianDayNumber = self.newPost.julianDayNumber;
						toSendPost.timeNumber = self.newPost.timeNumber;
						toSendPost.place = self.newPost.place;
						toSendPost.imageMetaId = new Array();
						toSendPost.fileMetaId = new Array();
						toSendPost.tags = new Array();
						
						if(publish)
							toSendPost.status = "PUBLISHED";
						else
							toSendPost.status = "DRAFT";

						
						for(var i=0; i<self.newPost.image.length; i++){
							toSendPost.imageMetaId.push(self.newPost.image[i].id);
						}
							
						for(var i=0; i<self.newPost.file.length; i++){
							toSendPost.fileMetaId.push(self.newPost.file[i].id);
						}
						
						for(var i=0; i<self.newPost.tags.length; i++){
							toSendPost.tags.push(self.newPost.tags[i].id);
						}
						
						
						apiService.updateStatus(self.scenario.id, self.post.id, toSendPost).then(
								function(data){
									console.log("sended draft: "+data);
									self.sendPostEnable= true;
									self.post = data;
									for(var i=0; i<self.posts.length; i++){
										if(self.posts[i].id==self.post.id){
											self.posts[i] = self.post;
											self.posts[i].character.cover = CONSTANTS.urlCharacterCover(self.posts[i].scenarioId, self.posts[i].character.id);
											break;
										}
									}
									self.newPost.toDeleteImage = [];
									self.newPost.toDeleteFile = [];
									if(publish){
										$state.go("logged.scenario.posts", {"id" : self.scenario.id});
									}
								},
								function(reason){
									self.sendPostEnable=true;
									console.log("error in send status: "+reason);
								}
						);
						
					}else{
						angular.element(document.querySelector('#textContentStatus')).focus();
						console.log("NO SAVE");
					}	
				}
				/*--------------Create draft post end------------------------------------------*/
				
				self.deletePost = function(){
					modalService.showModalDeletePost().then(
							function(data){
								apiService.deletePost(self.scenario.id, self.post.id).then(
										function(data){
											for(var i=0; i<self.posts.length; i++){
												if(self.posts[i].id==self.post.id){
													self.posts.splice(i,1);
													break;
												}
											}
											$state.go("logged.dashboard.draft");
										}
								);
							},
							function(reason){
								console.log("DELETE CANCELED");
							}
					);
				}
				
				
			}],
			controllerAs: "editDraftPost",
			bindToController: true,
			link : function(scope, elem, attrs, ctrl){
				scope.$watch('editDraftPost.newPost.image.length', function(val){
					if(val>0){
						ctrl.colorImageMarker = {'color': '#89b151'};
					}else{
						ctrl.colorImageMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('editDraftPost.newPost.file.length', function(val){
					if(val>0){
						ctrl.colorFileMarker = {'color': '#89b151'};
					}else{
						ctrl.colorFileMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('editDraftPost.newPost.place', function(newVal, oldVal){
					if(newVal && newVal.x && newVal.y){
						ctrl.colorMapMarker = {'color': '#89b151'};
					}else{
						ctrl.colorMapMarker = {'color': 'dark grey'};
					}
				});
				
				scope.$watch('editDraftPost.newPost.tags.length', function(val){
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
		};
}]);
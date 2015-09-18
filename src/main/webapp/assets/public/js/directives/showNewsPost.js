angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService', 'Lightbox', 'modalService', '$q',
                                                                 
	function(CONSTANTS, apiService, Lightbox, modalService, $q){
		return {
			templateUrl: "assets/private/partials/show-news-post-template.html",
			scope : {
				post: "=",
				scenarioId : "@",
				mapId : "@",
				currentCharacter : "=",
				loggedUser : "="
			},
			controller : function(){
				var self = this;
				self.isOwner = false;
				self.showTagBox=false;
				self.scenario = apiService.getScenario(self.scenarioId);
				
				if(self.post.imagesMetadata.length >0){
					console.log(self.post.imagesMetadata.length);
					self.colorImageMarker = {'color': '#89b151'};
				}

				if(self.post.place != null){
					self.colorMapMarker = {'color': '#89b151'};
				}
				
				
				if(self.post.user.id == self.loggedUser.id){
					self.isOwner = true;
					//console.log("SEI IL PROPRIETARIO DI QUESTO POST");
				}
					
				self.getMediaUrl = function(id){
					var t = CONSTANTS.urlMedia(id);
					console.log("FILE URL--------> "+t)
					return t;
				}
				
				self.realDateFormat = CONSTANTS.realDateFormatWithHour;
				self.formatDate = function(date){
					if(date.afterChrist)
						era="D.C.";
					else
						era="A.C.";
					
					return date.day+" / "+date.month+" / "+date.year+" "+era;
				}
				if(!self.currentCharacter || !self.currentCharacter.id)
					self.classCommentButton="disabled-div";		
				
				self.showComment=false;
				self.showMetaComment=false;
//				self.switchShowGeneralComment = function(){
//					if(!self.currentCharacter || !self.currentCharacter.id){
//						self.switchShowMetaComment();
//						return;
//					}
//					self.showComment = !self.showComment;
//					if(self.showComment)
//						self.showMetaComment = false;
//				}
				self.switchShowMetaComment = function(){
					self.showMetaComment = !self.showMetaComment;
					if(self.showMetaComment)
						self.showComment = false;
				}
				self.switchShowComment = function(){
						self.showComment = !self.showComment;
						if(self.showComment)
							self.showMetaComment = false;
				}
				
				var numMediaPerRow = 3;
				if(self.post.imagesMetadata){
					self.post.media = new Array();
					self.post.media[0] = new Array();
					var col = -1;
					var row = 0;
					for(var j=0; j<self.post.imagesMetadata.length;j++){
						if(j!=0 && j%numMediaPerRow==0){
							col=0;
							row++;
							self.post.media[row] = new Array();
						}else{
							col++;
						}
						self.post.media[row][col] = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
						self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
					}
				}
				
				self.openPostGallery =function(row, col){
					var index = (row*numMediaPerRow)+col;
					if(self.post.media){
						Lightbox.openModal(self.post.imagesMetadata, index);
					}
				}
				
				self.post.comments.reverse();
				self.post.metaComments.reverse();
				
				self.viewMap = function(){
					var map = {'url': CONSTANTS.urlMedia(self.mapId)+".jpg"};
					modalService.showModalOpenMapForPost(self.post,map);
				}
				self.hideTagBox =function(){
					self.showTagBox=false;
				}
				self.switchShowTagBox =function(){
					self.showTagBox=!self.showTagBox;
				}
				self.addImageToPost = function(file){
					uploadMediaToPost(file,true);
				}
				self.removeImage =function(image){
					for(var i=0; i<self.post.imagesMetadata.length; i++){
						if(self.post.imagesMetadata[i].id==image.id){
							self.post.imagesMetadata.splice(i,1);
						}
					}
				}
				self.addFileToPost = function(file){
					console.log("add File");
					uploadMediaToPost(file,false);
				}
				self.removeFile =function(file){
					for(var i=0; i<self.post.filesMetadata.length; i++){
						if(self.post.filesMetadata[i].id==file.id){
							self.post.filesMetadata.splice(i,1);
						}
					}
				}
				self.setPositionPost = function(){
					console.log(self.post);
					self.placeIsSet = false;
					self.placeName = "";
					var map = {'url': CONSTANTS.urlMedia(self.mapId)+".jpg"};
					modalService.showModalOpenMap(self.post,map);
				}
				self.getMedia = function(id){
					console.log("id dell'img:" + id);
					return CONSTANTS.urlMedia(id);
				}

				
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
				        	   self.newPost.file.push(uploadedFile);
				           }
				        });
					}
				}
				/*-------------------------------------------------------*/
			
			},
			controllerAs: "showNewsPost",
			bindToController : true,
			link : function(scope,elem,attrs,ctrl){
				scope.$watch('showNewsPost.post.imageMetadata.length', function(val){
					//capire su quale valore fare il watch
					if(val>0){
						ctrl.colorImageMarker = {'color': '#89b151'};
					}else{
						//ctrl.colorImageMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('showNewsPost.post.filesMetadata.length', function(val){
					//capire su quale valore fare il watch
					if(val>0){
						ctrl.colorFileMarker = {'color': '#89b151'};
					}else{
						ctrl.colorFileMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('showNewsPost.post.place', function(newVal, oldVal){
					if(newVal && newVal.x && newVal.y){
						ctrl.colorMapMarker = {'color': '#89b151'};
					}else{
						ctrl.colorMapMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('showNewsPost.post.tags.length', function(val){
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
									ctrl.stringTags+=""+ctrl.post.tags[i].name+", ";
								else
									ctrl.stringTags+=""+ctrl.post.tags[i].name;
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
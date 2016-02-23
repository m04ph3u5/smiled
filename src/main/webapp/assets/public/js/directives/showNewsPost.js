angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService', 'Lightbox', 'modalService', '$q', 'Upload', 'modalService',

                                                                 function(CONSTANTS, apiService, Lightbox, modalService, $q, Upload, modalService){
	return {
		templateUrl: "assets/private/partials/show-news-post-template.html",
		scope : {
			post: "=",
			scenario : "=",
			mapId : "@",
			currentCharacter : "=",
			loggedUser : "="
		},
		controller : function(){
			var self = this;
			var numMediaPerRow = 5;
			self.showTagBox=false;
			self.editPost=false;
			self.deleted=false;
			self.postDTO = {};
			self.postDTO.text = self.post.text;
			self.date={};				
			self.files = new Array();
			self.originalPost = angular.copy(self.post);
			
			self.editButton = false;
			
			var checkPermissionEdit = function(){
				if(self.scenario.teacherCreator.id == self.loggedUser.id){
					self.editButton = true;
					return;
				}
				if(self.scenario.collaborators){
					for (var i = 0; i< self.scenario.collaborators.length; i++){
						if(self.scenario.collaborators[i].id == self.loggedUser.id){
							self.editButton = true;
							return;
						}
					}
				}
				
				if(self.post.character && self.post.user.id == self.loggedUser.id){
					if(self.currentCharacter.id == self.post.character.id){
						self.editButton = true;
						return;
					}
				}
				
			}
			
			checkPermissionEdit();
			
			
			
			
			self.startDate = angular.copy(self.scenario.history.startDate);
			if(!self.startDate.afterChrist)
				self.startDate.year*=-1;
			self.endDate = angular.copy(self.scenario.history.endDate);
			if(!self.endDate.afterChrist)
				self.endDate.year*=-1;

			self.originalTagsList = angular.copy(self.post.tags);  //la uso per riaggiornare la lista di tag nel caso annullo la modifica al post
			self.originalJulianDayNumber = angular.copy(self.post.julianDayNumber);
			
			self.newCharactersToTags = new Array();

			self.switchEditPost = function(){
				self.editPost = !self.editPost;
			}
			self.closeEditPost = function(){
//				self.post.tags = angular.copy(self.originalTagsList);
				self.postDTO = {};
				self.postDTO.text = self.post.text;
				self.editPost = !self.editPost;
				self.newCharactersToTags = [];
//				self.post.julianDayNumber = self.originalJulianDayNumber;
				self.post = angular.copy(self.originalPost);
				self.recalculateMatrix();
				//TODO modificare label per date dopo annullamento
			}

			if(self.post.imagesMetadata.length >0){
				self.colorImageMarker = {'color': '#89b151'};
			}

			if(self.post.place != null){
				self.colorMapMarker = {'color': '#89b151'};
			}


			
			if(!self.currentCharacter || !self.currentCharacter.id)
				self.classCommentButton="disabled-div";	

			self.getMediaUrl = function(id){
				var t = CONSTANTS.urlMedia(id);
				return t;
			}

			self.realDateFormat = CONSTANTS.realDateFormatWithHour;

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



			self.showComment=false;
			self.showMetaComment=false;


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
					self.post.media[row][col] = CONSTANTS.urlMediaThumb(self.post.imagesMetadata[j].id);
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
			self.recalculateMatrix =  function(){
				if(self.post.imagesMetadata.length >0){
					self.colorImageMarker = {'color': '#89b151'};
				}

				if(self.post.place != null){
					self.colorMapMarker = {'color': '#89b151'};
				}


				if(!self.currentCharacter || !self.currentCharacter.id)
					self.classCommentButton="disabled-div";	

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
						self.post.media[row][col] = CONSTANTS.urlMediaThumb(self.post.imagesMetadata[j].id);
						self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
					}
				}

			}

			self.removeImage =function(row, col){
				var index = (row*numMediaPerRow)+col;
				modalService.showModalDeleteResource(self.post.imagesMetadata[index]).then(
					function(data){
						var id = angular.copy(self.post.imagesMetadata[index].id);
						apiService.deleteMedia(id, self.post.id).then(
							function(data){
								self.post.imagesMetadata.splice(index,1);
								self.recalculateMatrix();
								for(var i=0; i<self.originalPost.imagesMetadata.length; i++){
									if(self.originalPost.imagesMetadata[i].id==id){
										self.originalPost.imagesMetadata.splice(i,1);
									}
								}
							},
							function(reason){
								console.log("Impossibile eliminare immagine");
							}
						);
					}
				);
			}
			
			var assignFileType = function (){
				self.files.splice(0,self.files.length);
				for (var i=0; i<self.post.filesMetadata.length; i++){
					var myFile = {};
					myFile.id = self.post.filesMetadata[i].id;
					myFile.originalName = self.post.filesMetadata[i].originalName;
					var split = myFile.originalName.split(".");
					var type = split[split.length-1];
					if(type == 'jpg' || type=="jpeg" || type == 'png' || type == 'gif'){
						myFile.fileType = 'img';
					}else if(type == 'pdf'){
						myFile.fileType = 'pdf';
					}else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
						myFile.fileType = 'doc';
					}else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
						myFile.fileType = 'ppt';
					}else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
						myFile.fileType = 'excel';
					}
					self.files.push(myFile);					
				}				
			}
			assignFileType();
			
			self.addFileToPost = function(file){
				console.log("add File");
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				modalService.showModalDeleteResource(file).then(
						function(data){
							apiService.deleteMedia(file.id, self.post.id).then(
								function(data){
									for(var i=0; i<self.post.filesMetadata.length; i++){
										if(self.post.filesMetadata[i].id==file.id){
											self.post.filesMetadata.splice(i,1);
										}
									}
									for(var i=0; i<self.files.length; i++){
										if(self.files[i].id==file.id){
											self.files.splice(i,1);
										}
									}
									for(var i=0; i<self.originalPost.filesMetadata.length; i++){
										if(self.originalPost.filesMetadata[i].id==file.id){
											self.originalPost.filesMetadata.splice(i,1);
										}
									}
								}
							);
						}
				);
			}
			
			self.updatePositionPost = function(){
				var map = null;
				if(self.mapId)
					map = {'url': CONSTANTS.urlMedia(self.mapId)};
				modalService.showModalOpenMap(self.post,map);
			}
			
			self.getMedia = function(id){
				console.log("id dell'img:" + id);
				return CONSTANTS.urlMedia(id);
			}

			self.deletePost = function(){
				apiService.deletePost(self.scenario.id, self.post.id).then(
						function(data){
							console.log("DELETE POST OK");
							self.deleted=true;
							self.post = {};
						},
						function(reason){
							console.log("DELETE POST FAILED");
						});
			}

			self.updateStatus = function(){

				self.postDTO.id = self.post.id;
				self.postDTO.julianDayNumber = self.post.julianDayNumber;
				self.postDTO.timeNumber = self.post.timeNumber;
				self.postDTO.place = self.post.place;
				var newTags = new Array();
				for(var i=0; i< self.newCharactersToTags.length; i++){
					newTags.push(self.newCharactersToTags[i].id);
				}

				var oldTags = new Array();
				if(self.post.tags){		
					for(var i=0; i< self.post.tags.length; i++){
						oldTags.push(self.post.tags[i].id);
					}
				}


				self.postDTO.tags = newTags;
				self.postDTO.tags = self.postDTO.tags.concat(oldTags);

				apiService.updateStatus(self.scenario.id, self.post.id, self.postDTO).then(
						function(data){
							console.log("UPDATE STATUS OK");
							self.post = data;
							self.originalTagsList = angular.copy(self.post.tags);
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
							self.recalculateMatrix();
							self.post.character.cover = CONSTANTS.urlCharacterCover(self.scenario.id,self.post.character.id);
							self.originalPost = angular.copy(self.post);

						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.post.tags = angular.copy(self.originalTagsList);
							self.postDTO = {};
							self.postDTO.text = self.post.text;
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
							modalService.showModalOldCharacterChangeOnComment(self.post.character.name);
						});


			}

			self.updateEvent = function(){

				self.postDTO.id = self.post.id;
				self.postDTO.julianDayNumber = self.post.julianDayNumber;
				self.postDTO.timeNumber = self.post.timeNumber;
				self.postDTO.place = self.post.place;

				var newTags = new Array();
				for(var i=0; i< self.newCharactersToTags.length; i++){
					newTags.push(self.newCharactersToTags[i].id);
				}

				var oldTags = new Array();
				if(self.post.tags){		
					for(var i=0; i< self.post.tags.length; i++){
						oldTags.push(self.post.tags[i].id);
					}
				}

				console.log("vecchi tag");
				console.log(oldTags);
				console.log("nuovi tag");
				console.log(newTags);

				self.postDTO.tags = newTags;
				self.postDTO.tags = self.postDTO.tags.concat(oldTags);

				apiService.updateEvent(self.scenario.id, self.post.id, self.postDTO).then(
						function(data){
							console.log("UPDATE STATUS OK");
							self.post = data;
							self.originalTagsList = angular.copy(self.post.tags);
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
							self.recalculateMatrix();
							self.postDTO = {};
							self.originalPost = angular.copy(self.post);
						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.editPost = !self.editPost;
						});


			}
			
			
			self.updateDate = function(){
				modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.post);
			}
			
			

			self.removeTag=function(index){
				self.post.tags.splice(index,1);
			}

			/*Function to pass to autocomplete of tag-input-directive*/
			self.search = function($query){

				//Inserisco nella lista di selectable solamente i personaggi che non sono già presenti nella lista di tags del post
				var selectable = new Array();
				self.suggestions = new Array();

				var founded=false;
				for(var i=0; i<self.scenario.characters.length; i++){
					founded=false;
					if(self.post.tags!=null){		
						for(var j=0; j<self.post.tags.length; j++){	

							if(self.scenario.characters[i].id == self.post.tags[j].id){
								founded=true;
								break;
							}
						}
						if(!founded)
							selectable.push(self.scenario.characters[i]);
					}
				}
				console.log("i selezionabili sono: ");
				console.log(selectable);	

				var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
				if(selectable){



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
						}
					}

				}

				var result = $q.defer();
				result.resolve(self.suggestions);
				return result.promise;
			}
			/*-------------------------------------------------------*/
			
			var calculateType = function(uploadedFile){
				var split = uploadedFile.name.split(".");
				var type = split[split.length-1];
				uploadedFile.fileType =  null;
				if(type == 'jpg' || type == 'jpeg' || type == 'png' || type=='gif'){
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
			        .then(function (response) {
			           console.log("SUCCESS UPLOAD");
			           if(isImage){
				           var uploadedFile = {};
			        	   uploadedFile.id = response.data.id;
			        	   uploadedFile.name = response.config.file[0].name;
			        	   self.post.imagesMetadata.push(uploadedFile);
			        	   self.recalculateMatrix();
			        	   if(!self.postDTO.imageMetaId)
			        		   self.postDTO.imageMetaId = new Array();
			        	   self.postDTO.imageMetaId.push(uploadedFile.id);
			           }else{
				           var uploadedFile = {};
				           uploadedFile.id = response.data.id;
				           uploadedFile.originalName = response.config.file[0].name;
			        	   self.post.filesMetadata.push(uploadedFile);
			        	   if(!self.postDTO.fileMetaId)
			        		   self.postDTO.fileMetaId = new Array();
			        	   self.postDTO.fileMetaId.push(uploadedFile.id);
			        	   assignFileType();
			           }
			        }, function(reason){
			        	console.log("Impossibile effettuare l'upload");
			        	//TODO aggiungere alert
			        });
				}
			}
			
			self.setPositionPost = function(){
				var map=null;
				if(self.scenario.history.mapId)
					map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
				modalService.showModalOpenMap(self.post,map);
			}
			
			
			/*-------------------------------------------------------*/

		},
		controllerAs: "showNewsPost",
		bindToController : true,
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('showNewsPost.currentCharacter.id', function(newVal, oldVal){
				//capire su quale valore fare il watch
				if(!newVal){
					ctrl.classCommentButton="disabled-div";
				}
				else if(newVal != oldVal){
					ctrl.classCommentButton="";
				}
			});
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

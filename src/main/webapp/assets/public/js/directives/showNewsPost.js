angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService', 'Lightbox', 'modalService', '$q', 'Upload',

                                                                 function(CONSTANTS, apiService, Lightbox, modalService, $q, Upload){
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
			var numMediaPerRow = 3;
			self.isOwner = false;
			self.showTagBox=false;
			self.editPost=false;
			self.deleted=false;
			self.postDTO = {};
			self.postDTO.text = self.post.text;
			self.date={};


			self.originalTagsList = angular.copy(self.post.tags);  //la uso per riaggiornare la lista di tag nel caso annullo la modifica al post

			self.newCharactersToTags = new Array();

			self.switchEditPost = function(){
				self.editPost = !self.editPost;
			}
			self.closeEditPost = function(){
				self.post.tags = angular.copy(self.originalTagsList);
				self.postDTO = {};
				self.postDTO.text = self.post.text;
				self.editPost = !self.editPost;
				self.newCharactersToTags = [];
			}

			if(self.post.imagesMetadata.length >0){
				self.colorImageMarker = {'color': '#89b151'};
			}

			if(self.post.place != null){
				self.colorMapMarker = {'color': '#89b151'};
			}


			if(self.post.user.id == self.loggedUser.id){
				self.isOwner = true;
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

			self.formatDate = function(jd){
//				if(date.afterChrist)
//	era="D.C.";
//else
//	era="A.C.";

//return date.day+" / "+date.month+" / "+date.year+" "+era;
julianNumberToDate(jd, self.date);
var era = self.date.year > 0 ? "" : " A.C.";
var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
return self.date.day+" "+s;
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
			self.recalculateMatrix =  function(){
				if(self.post.imagesMetadata.length >0){
					self.colorImageMarker = {'color': '#89b151'};
				}

				if(self.post.place != null){
					self.colorMapMarker = {'color': '#89b151'};
				}


				if(self.post.user.id == self.loggedUser.id){
					self.isOwner = true;
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
						self.post.media[row][col] = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
						self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
					}
				}

			}
//			self.removeImage =function(image){
//			for(var i=0; i<self.post.imagesMetadata.length; i++){
//			if(self.post.imagesMetadata[i].id==image.id){
//			self.post.imagesMetadata.splice(i,1);
//			}
//			}
//			}
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

				apiService.updateStatus(self.scenario.id, self.post.id, self.postDTO).then(
						function(data){
							console.log("UPDATE STATUS OK");
							self.post = data;
							self.originalTagsList = angular.copy(self.post.tags);
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
							self.recalculateMatrix();
						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.post.tags = angular.copy(self.originalTagsList);
							self.postDTO = {};
							self.postDTO.text = self.post.text;
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
						});


			}

			self.updateEvent = function(){

				self.postDTO.id = self.post.id;

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
						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.editPost = !self.editPost;
						});


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

			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				console.log("SCENARIO ID" + self.scenarioId);
				if(file && file.length){
					Upload.upload({
						url: CONSTANTS.urlMediaScenarioPost(self.scenarioId),
						headers : {
							'Content-Type': file.type
						},
						file: file
					})
//					.progress(function (evt) {
//					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//					console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//					})
					.success(function (data, status, headers, config) {
						console.log("SUCCESS UPLOAD");
						console.log(data);
						if(isImage){
							var uploadedFile = {};
							uploadedFile.id = data.id;
							uploadedFile.name = config.file[0].name;
							self.post.image.push(uploadedFile);
						}else{
							var uploadedFile = {};
							uploadedFile.id = data.id;
							uploadedFile.name = config.file[0].name;
							self.post.file.push(uploadedFile);
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
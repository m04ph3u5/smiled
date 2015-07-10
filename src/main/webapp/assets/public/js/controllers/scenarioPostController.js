angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService,Upload){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.posts = [];
	self.newPost = {};
	self.newPost.date = {
			afterChrist : true
	};
	self.newPost.image = {};
	self.newPost.file  = {};
	self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
	self.showDatePicker=false;
	self.commentTab=true;
	
	self.realDateFormat = CONSTANTS.realDateFormatWithHour;
	
	self.addImageToNewPost = function(file){
		uploadMediaToPost(file,true);
	}
	
	self.removeImage = function(){
		self.newPost.image.name = "";
		
	}
	
	self.addFileToNewPost = function(){
		console.log("addFileToNewPost");
		self.newPost.file="";
	}
	
	self.setPositionNewPost = function(){
		console.log("setPositionNewPost");
	}
	
	self.setDateNewPost = function(){
		console.log("setDateNewPost");
		self.showDatePicker = !self.showDatePicker;
	}
	
	self.tagToNewPost = function(){
		console.log("tagToNewPost");
	}
	
	self.addSourceToNewPost = function(){
		console.log("addSourceToNewPost");
	}
	
	self.saveNewPost = function(){
		if(self.newPost.content && (self.newPost.date.formatted!=CONSTANTS.insertHistoricalDate)){
			console.log("saveNewPost");
			var toSendPost = {};
			toSendPost.text = self.newPost.content;
			toSendPost.historicalDate = self.newPost.date;
			toSendPost.status = "PUBLISHED";
			if(self.newPost.image.id)
				toSendPost.imageId = self.newPost.image.id;
			if(self.newPost.file.id)
				toSendPost.imageId = self.newPost.file.id;
			apiService.sendStatus($scope.scenario.scen.id, $scope.scenario.currentCharacter.id, toSendPost).then(
					function(data){
						console.log("sended: "+data);
						self.newPost.content="";
						self.newPost.image={};
						self.newPost.file={};
						self.newPost.date={afterChrist : true};
						self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
						apiService.getSingleStatus(self.scen.id, data.id).then(
								function(data){
									self.posts.unshift(data);
									if(self.posts[0].imageId)
										self.posts[0].imageUrl = CONSTANTS.urlMedia(self.posts[0].imageId);
									self.posts[0].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,self.posts[0].character.id);
								},
								function(reason){
									console.log("error in insert new post in array");
								}
						);
					},
					function(reason){
						console.log("error in send status: "+reason);
					}
			);
		}else{
			//TODO gestione alert errore
		}
	
	}
	
	self.draftNewPost = function(){
		if(self.newPost.content){
			var toSendPost = {};
			toSendPost.text = self.newPost.content;
			toSendPost.historicalDate = self.newPost.date;
			toSendPost.status = "DRAFT";
			apiService.sendStatus($scope.scenario.scen.id, $scope.scenario.currentCharacter.id, toSendPost).then(
					function(data){
						console.log("drafted: "+data);
					},
					function(reason){
						console.log("error in send status: "+reason);
					}
			);
		}	
	}
	
	var uploadMediaToPost = function(file,isImage){
		if(file && file.length){
			Upload.upload({
	            url: CONSTANTS.urlMediaScenarioPost(self.scen.id),
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	           console.log("SUCCESS UPLOAD");
	           console.log(data);
	           if(isImage){
	        	   self.newPost.image.id = data.id;
	        	   self.newPost.image.name = config.file[0].name;
	        	   console.log(self.newPost.image.name);
	           }else{
	        	   self.newPost.file.id = data.id;
	        	   self.newPost.file.name = config.file.name;
	           }
	        });
		}
	}
	
	self.getUrlCoverCharacter = function(id){
		return CONSTANTS.urlCharacterCover(self.scen.id,id);
	}
	
	self.getUrlMedia = function(id){
		console.log(CONSTANTS.urlMedia(id));
		return CONSTANTS.urlMedia(id);
	}
	
	self.formatDate = function(date){
		if(date.afterChrist)
			era="D.C.";
		else
			era="A.C.";
		
		return date.day+" / "+date.month+" / "+date.year+" "+era;
	}
	
	apiService.getPagedPosts(self.scen.id, 0, 30, false).then(
			function(data){
				self.posts = data.content;
				for(var i=0; i<self.posts.length;i++){
					if(self.posts[i].imageId){
						self.posts[i].imageUrl = CONSTANTS.urlMedia(self.posts[i].imageId);
					}
					self.posts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,self.posts[i].character.id);
					for(var j=0; j<self.posts[i].likes.length; j++){
						if(self.posts[i].likes[j].id==self.posts[i].character.id){
							self.posts[i].youLike=true;
							break;
						}
					}
				}
			}, function(reason){
				console.log("errore");
			}
	);
	
	self.likePost = function(s){
		apiService.addLikeToPost(self.scen.id, s.id).then(
				function(data){
					for(var i=0; i<self.posts.length; i++){
						if(self.posts[i].id=s.id){
							for(var j=0; j<self.posts[i].likes.length; j++){
								if(!s.youLike)
									self.posts[i].likes.push(self.currentCharacter);
								else
									self.posts[i].likes.splice(j,1);
							}
						}
					}
					s.youLike = !s.youLike;
				},
				function(reason){
					console.log("Error in like");
				}
		);
	}
	
	self.switchCommentTab = function(c){
		self.commentTab = c;
	}
	
	self.addCommentToPost = function(s){
		console.log(s.newComment);
		if(s.newComment){
			var comment = {};
			comment.text=s.newComment;
			apiService.sendCommentToPost(self.scen.id, s.id, comment).then(
					function(data){
						apiService.getSingleStatus(self.scen.id, s.id).then(
								function(data){
									for(var i=0; i<self.posts.length; i++){
										if(self.posts[i].id==data.id){
											data.newComment="";
											if(data.imageId)
												data.imageUrl = CONSTANTS.urlMedia(data.imageId);
											data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
											self.posts.splice(i,1,data);
										}
									}
									
								},
								function(reason){
									console.log("error in insert new post in array");
								}
						);
					},
					function(reason){
						console.log("fail to send comment: "+reason);
					}
			);
		}
	}
	
	self.addMetaCommentToPost = function(s){
		console.log(s.newMetaComment);
		if(s.newMetaComment){
			var comment = {};
			comment.text=s.newMetaComment;
			apiService.sendMetaCommentToPost(self.scen.id, s.id, comment).then(
					function(data){
						apiService.getSingleStatus(self.scen.id, s.id).then(
								function(data){
									s.newMetaComment="";
									for(var i=0; i<self.posts.length; i++){
										if(self.posts[i].id==data.id){
											data.newComment="";
											if(data.imageId)
												data.imageUrl = CONSTANTS.urlMedia(data.imageId);
											data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
											self.posts.splice(i,1,data);
										}
									}
								},
								function(reason){
									console.log("error in insert new post in array");
								}
						);
					},
					function(reason){
						console.log("fail to send comment: "+reason);
					}
			);
		}
	}
}]);
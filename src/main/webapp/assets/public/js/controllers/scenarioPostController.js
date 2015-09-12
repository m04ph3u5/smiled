angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','$interval',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService,Upload,$interval){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.posts = [];
	
	
//	self.newPost = {};
//	self.newPost.date = {
//			afterChrist : true
//	};
//	self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
	
	self.newEvent = {};
	self.newEvent.date = {
			afterChrist : true
	};
	self.newEvent.date.formatted=CONSTANTS.insertHistoricalDateEvent;
	
	
//	self.newPost.image = {};
//	self.newPost.file  = {};
	self.showDatePicker=false;
	self.showDatePickerEvent=false;

	if($scope.scenario.hasCharacter)
		self.commentTab=true;
	else
		self.commentTab=false;
	
	self.realDateFormat = CONSTANTS.realDateFormatWithHour;
	
	
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
	
	var getPost = function(){
		apiService.getPagedPosts(self.scen.id, 0, 30, false).then(
	
			function(data){
				self.posts = data.content;
				for(var i=0; i<self.posts.length;i++){
//					if(self.posts[i].imageId){
//						self.posts[i].imageUrl = CONSTANTS.urlMedia(self.posts[i].imageId);
//					}
					if(self.posts[i].character){
						self.posts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,self.posts[i].character.id);
					
						for(var j=0; j<self.posts[i].likes.length; j++){
							if(self.posts[i].likes[j].id==self.currentCharacter.id){
								self.posts[i].youLike=true;
								break;
							}
						}
					}
				}
				
				
			}, function(reason){
				console.log("errore");
			}
	);
	}
	getPost();
	var interval;
	var intervalSet = false;
	self.startUpdatePost = function(){
		if(!intervalSet){
			interval = $interval(getPost,1000);
			intervalSet=true;
		}
	}
	
	self.stopUpdatePost = function(){
		if(intervalSet){
			$interval.cancel(interval);
			intervalSet=false;
		}
	}
	
	
	self.switchCommentTab = function(c){
		if($scope.scenario.hasCharacter)
			self.commentTab = c;
		else
			self.commentTab = false;
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
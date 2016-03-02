angular.module('smiled.application').controller('singlePostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function singlePostCtrl(CONSTANTS,$scope, apiService,Upload,$interval, notifyService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.posts = [];
	
	

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
	
	
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
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
	
	var postAlreadyPresent = function(postId){
		for(var i = 0; i<self.posts.length; i++){
			if(self.posts[i].id == postId)
				return true;
		}
		return false;
	}
	
	self.switchCommentTab = function(c){
		if($scope.scenario.hasCharacter)
			self.commentTab = c;
		else
			self.commentTab = false;
	}
	
	/*-----------------------------------UTILIY------------------------------------------------*/
//	
//	self.getPost = function(n){
//		
//		apiService.getPagedPosts(self.scen.id, 0, n, false).then(
//	
//			function(data){
//				self.posts = data.content;
//				for(var i=0; i<self.posts.length;i++){
//
//					if(self.posts[i].character){
//						self.posts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,self.posts[i].character.id);
//					
//						for(var j=0; j<self.posts[i].likes.length; j++){
//							if(self.posts[i].likes[j].id==self.currentCharacter.id){
//								self.posts[i].youLike=true;
//								break;
//							}
//						}
//					}
//				}
//				
//				
//			}, function(reason){
//				console.log("errore");
//			}
//	);
//	}
//	
	//listOfNewPosts è la lista di id di post da scaricare
	var updateScenarioWithNewPosts = function(listOfNewPosts){
				
		apiService.getListOfNewPosts(self.scen.id, listOfNewPosts).then(
				
				function(data){
					var newPosts = data.content;
					for(var i=0; i<newPosts.length;i++){
//						if(self.posts[i].imageId){
//							self.posts[i].imageUrl = CONSTANTS.urlMedia(self.posts[i].imageId);
//						}
						if(newPosts[i].character){
							newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
						
							for(var j=0; j<newPosts[i].likes.length; j++){
								if(newPosts[i].likes[j].id==self.currentCharacter.id){
									newPosts[i].youLike=true;
									break;
								}
							}
						}
					}
					
					for(var i=0; i<self.posts.length; i++){
						newPosts.push(self.posts[i]);
					}
					self.posts=newPosts;
					
					
				}, function(reason){
					console.log("errore");
				}
		);
		
	}
	
	var updateScenarioWithModPosts = function(listOfUpdPosts){
		if(listOfUpdPosts!=null && listOfUpdPosts.length>0){
			for(var i = 0; i<listOfUpdPosts.length; i++){
				if(!postAlreadyPresent(listOfUpdPosts[i])){
					listOfUpPosts.splice(i,1);  //sto scremando i post che ho gia scaricato
				}
			}
			if(listOfUpdPosts.length>0){
				apiService.getListOfNewPosts(self.scen.id, listOfUpdPosts).then(
						
						function(data){
							if(data.content){
								for(var i=0; i<data.content.length; i++){
									for(var j=0; j<self.posts; j++){
										if(self.posts[j].id== data.content[i].id){
											self.posts[j]=angular.copy(data.content[i]);
										}
									}
								}
							}

						}, function(reason){
							console.log("errore");
						}
				);
			}
		}
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
	
	
	notifyService.setActualScenarioId(self.scen.id);
	notifyService.registerObserverReloadList(updateScenarioWithNewPosts);
	notifyService.registerObserverUpdPost(updateScenarioWithModPosts, self.scen.id);
	self.getPost(300);
	
	$scope.$on("$destroy", function() {
        
        notifyService.resetActualScenarioId();
        notifyService.resetObserverReloadList();
    });
	

}]);
angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService,Upload,$interval, notifyService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.posts = [];
	$scope.scenario.labelNewPosts = true;
	var scrollable = CONSTANTS.numberOfPostForScroll;
	
	
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
	var stopScroll=false;
	self.nextPost = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
		console.log("NEXT POST");
		if(self.posts.length==0){
			self.getPost("",scrollable);
		}else{
			self.getPost(self.posts[self.posts.length-1].id,scrollable);
		}
	}
	
	self.busy=false;
	
	self.getPost = function(lastId, n){
//		apiService.getPagedPosts(self.scen.id, 0, n, false).then(
		apiService.getLastPosts(self.scen.id, lastId, n).then(

			function(data){
//				self.posts = data.content;
				var newPosts = [];
				newPosts = data;
				if(data.length==0)
					stopScroll=true;

				for(var i=0; newPosts && i<newPosts.length;i++){
					if(newPosts[i].character){
						newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
					
						for(var j=0; j<newPosts[i].likes.length; j++){
							if(newPosts[i].likes[j].id==self.currentCharacter.id){
								newPosts[i].youLike=true;
								break;
							}
						}
					}
					self.posts.push(angular.copy(newPosts[i]));
				}
				self.busy=false;
				
			}, function(reason){
				console.log("errore");
				self.busy=false;
			}
		);
	}
	
	//listOfNewPosts è la lista di id di post da scaricare
	var updateScenarioWithNewPosts = function(listOfNewPosts){
		
//      Operazione di scrematura molto probabilmente NON NECESSARIA!!!
//		if(listOfNewPosts!=null && listOfNewPosts.length>0){
//			for(var i = 0; i<listOfNewPosts.length; i++){
//				if(postAlreadyPresent(listOfNewPosts[i])){
//					listOfNewPosts.splice(i,1);  //sto scremando i post che ho gia scaricato
//				}
//			}
//		}
		
		
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
				console.log("get list of new posts!!!!!!!!!!!!!!");
				apiService.getListOfNewPosts(self.scen.id, listOfUpdPosts).then(
						
						function(data){
							console.log(data);
							if(data.content){
								for(var i=0; i<data.content.length; i++){
									for(var j=0; j<self.posts.length; j++){

										if(self.posts[j].id == data.content[i].id){
											console.log("il nuovo post è cosi': ");
											console.log(data.content[i]);
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
	
	var updPostEvent = $scope.$on("notification.updPostEvent", function (event, data){
		console.log("notification.updPostEvent");
		var listOfUpdPost = [];
		listOfUpdPost.push(data.id);
		updateScenarioWithModPosts(listOfUpdPost);
	});
	
	var updNewCommentEvent = $scope.$on("notification.updNewComment", function (event, data){
		var n = data.notification;
		var founded = false;
		for(var i=0; i<self.posts.length; i++){
			if(self.posts[i].id==n.objectId){
				for(var j=0; self.posts[i].comments && j<self.posts[i].comments.length; j++){
					if(self.posts[i].comments[j].id == n.comment.id){
						self.posts[i].comments[j] = angular.copy(n.comment);
						founded=true;
						break;
					}
				}
				if(!founded){
					self.posts[i].comments.splice(0,0,angular.copy(n.comment));
				}
				break;
			}
		}
	});
	
	var updNewMetaCommentEvent = $scope.$on("notification.updNewMetaComment", function (event, data){
		var n = data.notification;
		var founded = false;
		for(var i=0; i<self.posts.length; i++){
			if(self.posts[i].id==n.objectId){
				for(var j=0; self.posts[i].metaComments && j<self.posts[i].metaComments.length; j++){
					if(self.posts[i].metaComments[j].id == n.metaComment.id){
						self.posts[i].metaComments[j] = angular.copy(n.metaComment);
						founded=true;
						break;
					}
				}
				if(!founded){
					self.posts[i].metaComments.splice(0,0,angular.copy(n.metaComment));
				}
				break;
			}
		}
	});
	
	
//	self.getPost("",2);
	
	$scope.$on("$destroy", function() {
		updNewMetaCommentEvent();
		updNewCommentEvent();
        updPostEvent();
        notifyService.resetActualScenarioId();
        notifyService.resetObserverReloadList();
        $scope.scenario.labelNewPosts = false;
        self.post=[];
        $scope.scenario.numNewPost = 0;
    });
	

}]);
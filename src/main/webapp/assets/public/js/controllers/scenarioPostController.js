angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService,Upload,$interval, notifyService){
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
	
	self.getPost = function(n){
		apiService.getPagedPosts(self.scen.id, 0, n, false).then(
	
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
	self.getPost(300);
	
	//function to determine whether an array contains a value
//	var contains = function(needle) {
//	    // Per spec, the way to identify NaN is that it is not equal to itself
//	    var findNaN = needle !== needle;
//	    var indexOf;
//
//	    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
//	        indexOf = Array.prototype.indexOf;
//	    } else {
//	        indexOf = function(needle) {
//	            var i = -1, index = -1;
//
//	            for(i = 0; i < this.length; i++) {
//	                var item = this[i];
//
//	                if((findNaN && item !== item) || item === needle) {
//	                    index = i;
//	                    break;
//	                }
//	            }
//
//	            return index;
//	        };
//	    }
//
//	    return indexOf.call(this, needle) > -1;
//	};
	//listOfNewPosts è la lista di id di post da scaricare
	var updateScenarioPosts = function(listOfNewPosts){
		
		console.log(listOfNewPosts);
		
		
		
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
	
	notifyService.registerObserverReloadList(updateScenarioPosts);
	
	
	
	
	
	var interval;
	var intervalSet = false;
	self.startUpdatePost = function(){
		if(!intervalSet){
			console.log("START INTERVAL");			
			interval = $interval(self.getPost(300),15000);
			intervalSet=true;
		}
	}
	
	self.stopUpdatePost = function(){
		if(intervalSet){
			console.log("STOP INTERVAL");
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
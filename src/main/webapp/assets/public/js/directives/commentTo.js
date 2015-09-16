angular.module("smiled.application").directive('commentTo',[ 'apiService', 'CONSTANTS', 'modalService',
    function(apiService, CONSTANTS, modalService){
		return {
			templateUrl: "assets/private/partials/comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				currentCharacter : "=",
				scenarioId : "@" 
			},
			controller : ['$scope' , function($scope){
				
				var numVisibleComment = CONSTANTS.visibleComment;
				var self = this;
				
				var charId = self.currentCharacter.id;
				var charName = self.currentCharacter.name;
				
				self.showViewOthers = false;
				self.showInsert = true;
				self.atLeastOneCommentWasSended = false;
				if(!self.currentCharacter || !self.currentCharacter.id)
					self.showInsert = false;
				
				self.visibleComments = new Array();
//				self.post.comments.reverse();
				console.log("COMMENT TO!!!");
				console.log(self.post.comments);
				var i=0;
				while(i<self.post.comments.length && i<numVisibleComment){
					self.visibleComments.unshift(self.post.comments[i]);
					i++;
				}
				
				if(self.post.comments.length>numVisibleComment)
					self.showViewOthers = true;
				
				self.openViewOthers = function(){
					
					self.visibleComments = angular.copy(self.post.comments);
					self.visibleComments.reverse();
//					for(var j=i; j<self.post.comments.length; j++){
//						self.visibleComments.unshift(self.post.comments[i]);
//					}
					self.showViewOthers = false;
				}
				var onDestroy = function(){
					console.log("onDestroy commentTo directive");
					if(self.atLeastOneCommentWasSended)
						self.post.comments.reverse();
				}
				$scope.$on("$destroy", function(){
					onDestroy();
				});
				
				
				
				self.addCommentToPost = function(){
					console.log(self.post.newComment);
					if(self.post.newComment){
						var comment = {};
						comment.text=self.post.newComment;
						comment.characterId = charId;
						//aggiungo commento al post
						apiService.sendCommentToPost(self.scenarioId, self.post.id, comment).then(
								function(data){
									//prendo dal server nuovamente il post a cui ho aggiunto il commento
									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
											function(data){
												self.post = data;
												self.post.newComment="";
												var numVisible = self.visibleComments.length;
												
												self.visibleComments = self.post.comments;
												
												self.showViewOthers = false;
												self.atLeastOneCommentWasSended = true;
//												for(var i=0; i<self.posts.length; i++){
//													if(self.posts[i].id==data.id){
//														data.newComment="";
//														if(data.imageId)
//															data.imageUrl = CONSTANTS.urlMedia(data.imageId);
//														data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
//														//self.posts.splice(i,1,data);
//														self.posts[i] = data;
//														
//													}
//												}
												
											},
											function(reason){
												console.log("error in insert new post in array");
											}
									);
								},
								function(reason){
									console.log("fail to send comment: "+reason);
									if(reason.status=="403"){
									modalService.showModalOldCharacterChangeOnComment(charName);	
									}
								}
						);
					}
				}
			}],
			controllerAs: "commentTo",
			bindToController: true
		};
}]);
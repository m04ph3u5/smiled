angular.module("smiled.application").directive('commentTo',[ 'apiService', 'CONSTANTS', 'modalService', 'notifyService',
    function(apiService, CONSTANTS, modalService, notifyService){
		return {
			templateUrl: "assets/private/partials/comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				currentCharacter : "=",
				scenarioId : "@",
				loggedUser : "="
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
//				var onDestroy = function(){
////					if(self.atLeastOneCommentWasSended)
////						self.post.comments.reverse();
//				}
//				$scope.$on("$destroy", function(){
//					onDestroy();
//				});
//				
				
				
				self.addCommentToPost = function(){
					if(self.post.newComment){
						var comment = {};
						comment.text=self.post.newComment;
						comment.characterId = charId;
						//aggiungo commento al post
						apiService.sendCommentToPost(self.scenarioId, self.post.id, comment).then(
								function(data){
									comment.creationDate = new Date();
									comment.character = {};
									comment.character.id = self.currentCharacter.id;
									comment.character.firstname = self.currentCharacter.name;
									comment.user = {};
									comment.user.id = self.loggedUser.id;
									comment.user.firstname = self.loggedUser.firstName;
									comment.user.lastname = self.loggedUser.lastName;
									self.post.comments.splice(0,0,comment);
									self.post.newComment="";

									//prendo dal server nuovamente il post a cui ho aggiunto il commento
//									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
//											function(data){
//												self.post = data;
//												self.post.newComment="";
//												var numVisible = self.visibleComments.length;
//												
//												self.visibleComments = self.post.comments;
//												
//												self.showViewOthers = false;
//												self.atLeastOneCommentWasSended = true;
////												for(var i=0; i<self.posts.length; i++){
////													if(self.posts[i].id==data.id){
////														data.newComment="";
////														if(data.imageId)
////															data.imageUrl = CONSTANTS.urlMedia(data.imageId);
////														data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
////														//self.posts.splice(i,1,data);
////														self.posts[i] = data;
////														
////													}
////												}
//												
//											},
//											function(reason){
//												console.log("error in insert new post in array");
//											}
//									);
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
			bindToController: true,
			link : function(scope,elem,attrs,ctrl){
				scope.$watch('commentTo.post.comments.length', function(newVal, oldVal){
					if(newVal!=oldVal && newVal>0){
						if(ctrl.showViewOthers){
							ctrl.visibleComments.push(ctrl.post.comments[0]);
						}else
							ctrl.openViewOthers();

//						ctrl.visibleComments.reverse();
//						ctrl.atLeastOneCommentWasSended = true;
					}
				});
				
				scope.$watch('commentTo.post.newComment.length', function(newVal, oldVal){
					if(newVal>0 && (oldVal==0 || oldVal==undefined)){
						notifyService.addToInEditPost(ctrl.post.id);
					}else if((newVal==0 || newVal==undefined) && oldVal>0){
						notifyService.removeToInEditPost(ctrl.post.id);
					}
				});
				
				scope.$on('$destroy', function(){
					ctrl.post.newComment="";
					notifyService.removeToInEditPost(ctrl.post.id);
				});
			}
		};
}]);
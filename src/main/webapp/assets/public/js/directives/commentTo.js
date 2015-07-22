angular.module("smiled.application").directive('commentTo',[ 'apiService',

	function(apiService){
		return {
			templateUrl: "assets/private/partials/comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				currentCharacter : "=",
				scenarioId : "@" 
			},
			controller : function(){
				var self = this;
				
				self.addCommentToPost = function(){
					console.log(self.post.newComment);
					if(self.post.newComment){
						var comment = {};
						comment.text=self.post.newComment;
						//aggiungo commento al post
						apiService.sendCommentToPost(self.scenarioId, self.post.id, comment).then(
								function(data){
									//prendo dal server nuovamente il post a cui ho aggiunto il commento
									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
											function(data){
												self.post = data;
												self.post.newComment="";
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
								}
						);
					}
				}
			},
			controllerAs: "commentTo",
			bindToController: true
		};
}]);
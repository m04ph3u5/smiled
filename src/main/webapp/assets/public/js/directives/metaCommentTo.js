angular.module("smiled.application").directive('metaCommentTo', [ 'apiService',
	function(apiService){
		return {
			templateUrl : "assets/private/partials/meta-comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				scenarioId : "@"
			},
			controller : function(){
				var self = this;
				
				self.addMetaCommentToPost = function(){
					if(self.post.newMetaComment){
						var metaComment = {};
						metaComment.text=self.post.newMetaComment;
						//aggiungo commento al post
						apiService.sendMetaCommentToPost(self.scenarioId, self.post.id, metaComment).then(
								function(data){
									//prendo dal server nuovamente il post a cui ho aggiunto il commento
									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
											function(data){
												self.post = data;
												self.post.newComment="";											
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
			controllerAs: "metaCommentTo",
			bindToController : true
		};
}]);
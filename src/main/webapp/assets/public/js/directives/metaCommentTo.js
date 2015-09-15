angular.module("smiled.application").directive('metaCommentTo', [ 'apiService', 'CONSTANTS',
	function(apiService, CONSTANTS){
		return {
			templateUrl : "assets/private/partials/meta-comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				scenarioId : "@"
			},
			controller : ['$scope' , function($scope){
				var self = this;
				var numVisibleComment = CONSTANTS.visibleComment;
				var self = this;
				self.showViewOthers = false;
				self.atLeastOneCommentWasSended = false;
				self.visibleComments = new Array();
//				self.post.metaComments.reverse();
				var i=0;
				while(i<self.post.metaComments.length && i<numVisibleComment){
					self.visibleComments.unshift(self.post.metaComments[i]);
					i++;
				}
				if(self.post.metaComments.length>numVisibleComment)
					self.showViewOthers = true;
				
				self.openViewOthers = function(){
					self.visibleComments = angular.copy(self.post.metaComments);
					self.visibleComments.reverse();
					self.showViewOthers = false;
				}
				
				var onDestroy = function(){
					console.log("onDestroy metaCommentTo directive");
					if(self.atLeastOneCommentWasSended)
						self.post.metaComments.reverse();
				}
				$scope.$on("$destroy", function(){
					onDestroy();
				});
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
												var numVisible = self.visibleComments.length;
												
												self.visibleComments = self.post.metaComments;
												self.showViewOthers = false;
												self.atLeastOneCommentWasSended = true;
												
												
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
			}],
			controllerAs: "metaCommentTo",
			bindToController : true
		};
}]);
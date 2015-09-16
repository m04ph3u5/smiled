angular.module("smiled.application").directive('likeTo', [ 'apiService',

	function(apiService){
		return{
			templateUrl : "assets/private/partials/like-to-template.html",
			scope : {
				liker : "=",
				post : "=",
				scenarioId : "@"
			},
			controller : function(){
				console.log("LIKE TO CONTROLLER");
				var self = this;
				self.numLike = self.post.likes.length;
				self.likePost = function(s){
					console.log("LIKE POST");
					apiService.addLikeToPost(self.scenarioId, self.post.id).then(
							function(data){
								if(!s.youLike){
									s.likes.push(self.liker);
									self.numLike++;
								}else{
									for(var i=0; i<s.likes.length; i++){
										if(s.likes[i].id==self.liker.id){
											s.likes.splice(i,1);
											self.numLike--;
											break;
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
			},
			controllerAs: "likeTo",
			bindToController: true
		}
}]);
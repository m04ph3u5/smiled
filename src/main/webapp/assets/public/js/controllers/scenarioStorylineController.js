angular.module("smiled.application").controller('scenarioStorylineCtrl', [ 'apiService', '$scope', 'CONSTANTS',
        function scenarioStorylineCtrl(apiService, $scope, CONSTANTS){
        	
        	var self = this;
        	self.posts = [];
        	
        	apiService.getPagedPosts($scope.scenario.scen.id, 0, 30, true).then(
        			function(data){
        				console.log(data);
        				self.posts = data.content;
        				for(var i=0; i<self.posts.length;i++){
        					if(self.posts[i].imageId){
        						self.posts[i].imageUrl = CONSTANTS.urlMedia(self.posts[i].imageId);
        					}
        					if(self.posts[i].character){
        						self.posts[i].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,self.posts[i].character.id);
        					
        						for(var j=0; j<self.posts[i].likes.length; j++){
        							if(self.posts[i].likes[j].id==self.posts[i].character.id){
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
        	
        	self.formatDate = function(date){
        		if(date.afterChrist)
        			era="D.C.";
        		else
        			era="A.C.";
        		
        		return date.day+" / "+date.month+" / "+date.year+" "+era;
        	}
}]);
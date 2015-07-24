angular.module("smiled.application").controller('scenarioStorylineCtrl', [ 'apiService', '$scope', 'CONSTANTS', 'Lightbox',
        function scenarioStorylineCtrl(apiService, $scope, CONSTANTS, Lightbox){
        	
        	var self = this;
        	self.posts = [];
        	var numMediaPerRow = 3;
        	apiService.getPagedPosts($scope.scenario.scen.id, 0, 30, true).then(
        			function(data){
        				console.log(data);
        				self.posts = data.content;
        				console.log("----------------------->POST");
        				for(var i=0; i<self.posts.length;i++){
      					
        					if(self.posts[i].character && self.posts[i].character.id){
        						self.posts[i].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,self.posts[i].character.id);
        						console.log(self.posts[i].character.cover);
        						for(var j=0; j<self.posts[i].likes.length; j++){
        							if(self.posts[i].likes[j].id==self.posts[i].character.id){
        								self.posts[i].youLike=true;
        								break;
        							}
        						}
        					}else{
        						self.posts[i].character = {};
        						self.posts[i].character.name="Narratore";
        						self.posts[i].isEvent = true;
        					}
        					if(self.posts[i].comments){
        						for(var j=0; j<self.posts[i].comments.length; j++){
        							self.posts[i].comments[j].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,self.posts[i].comments[j].character.id);
        						}
        					}
        					if(self.posts[i].imagesMetadata){
        						self.posts[i].media = new Array();
        						self.posts[i].media[0] = new Array();
        						var col = -1;
        						var row = 0;
        						for(var j=0; j<self.posts[i].imagesMetadata.length;j++){
    								console.log("IN: "+1%numMediaPerRow);
        							if(j!=0 && j%numMediaPerRow==0){
        								col=0;
        								row++;
        								self.posts[i].media[row] = new Array();
        							}else{
        								col++;
        							}
        							console.log("Row/col: "+row+" "+col);
        							self.posts[i].media[row][col] = CONSTANTS.urlMedia(self.posts[i].imagesMetadata[j].id);
        							self.posts[i].imagesMetadata[j].url = CONSTANTS.urlMedia(self.posts[i].imagesMetadata[j].id);
        						}
        					}
        					console.log(self.posts[i]);
        				}
        			}, function(reason){
        				console.log("errore");
        			}
        	);
        	
        	self.getPosition = function(index){
        		if(index%2==0)
        			return "timeline-inverted";
        		else
        			return "";
        	}
        	
        	self.formatDate = function(date){
        		var era="";
        		if(!date.afterChrist)
          			era="A.C.";
        		
        		return date.day+" "+CONSTANTS.monthString(date.month)+" "+date.year+" "+era;
        	}
        	
        	self.realDateFormatWithHour = CONSTANTS.realDateFormatWithHour;
        	
        	self.getMediaUrl = function(id){
        		return CONSNTANTS.urlMedia(id);
        	}
        	
        	self.openPostGallery = function(post){
        		Lightbox.openModal(post.imagesMetadata,0);
        	}
}]);
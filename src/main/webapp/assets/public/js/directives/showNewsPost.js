angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService', 'Lightbox',
                                                                 
	function(CONSTANTS, apiService, Lightbox){
		return {
			templateUrl: "assets/private/partials/show-news-post-template.html",
			scope : {
				post: "=",
				scenarioId : "@",
				currentCharacter : "=",
				loggedUser : "="
			},
			controller : function(){
				var self = this;
				self.isOwner = false;
				if(self.post.user.id == self.loggedUser.id){
					self.isOwner = true;
					//console.log("SEI IL PROPRIETARIO DI QUESTO POST");
				}
					
				
				self.realDateFormat = CONSTANTS.realDateFormatWithHour;
				self.formatDate = function(date){
					if(date.afterChrist)
						era="D.C.";
					else
						era="A.C.";
					
					return date.day+" / "+date.month+" / "+date.year+" "+era;
				}
				if(!self.currentCharacter || !self.currentCharacter.id)
					self.classCommentButton="disabled-div";		
				
				self.showComment=false;
				self.showMetaComment=false;
//				self.switchShowGeneralComment = function(){
//					if(!self.currentCharacter || !self.currentCharacter.id){
//						self.switchShowMetaComment();
//						return;
//					}
//					self.showComment = !self.showComment;
//					if(self.showComment)
//						self.showMetaComment = false;
//				}
				self.switchShowMetaComment = function(){
					self.showMetaComment = !self.showMetaComment;
					if(self.showMetaComment)
						self.showComment = false;
				}
				self.switchShowComment = function(){
						self.showComment = !self.showComment;
						if(self.showComment)
							self.showMetaComment = false;
				}
				
				var numMediaPerRow = 3;
				if(self.post.imagesMetadata){
					self.post.media = new Array();
					self.post.media[0] = new Array();
					var col = -1;
					var row = 0;
					for(var j=0; j<self.post.imagesMetadata.length;j++){
						if(j!=0 && j%numMediaPerRow==0){
							col=0;
							row++;
							self.post.media[row] = new Array();
						}else{
							col++;
						}
						self.post.media[row][col] = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
						self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
					}
				}
				
				self.openPostGallery =function(row, col){
					var index = (row*numMediaPerRow)+col;
					if(self.post.media){
						Lightbox.openModal(self.post.imagesMetadata, index);
					}
				}
				
				self.post.comments.reverse();
				self.post.metaComments.reverse();
				
			
			},
			controllerAs: "showNewsPost",
			bindToController : true
		}	 
}]);
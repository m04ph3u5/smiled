angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService',
                                                                 
	function(CONSTANTS, apiService){
		return {
			templateUrl: "assets/private/partials/show-news-post-template.html",
			scope : {
				post: "=",
				scenarioId : "@",
				currentCharacter : "="
			},
			controller : function(){
				var self = this;
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
				self.switchShowGeneralComment = function(){
					if(!self.currentCharacter || !self.currentCharacter.id){
						self.switchShowMetaComment();
						return;
					}
					self.showComment = !self.showComment;
					if(self.showComment)
						self.showMetaComment = false;
				}
				self.switchShowMetaComment = function(){
					self.showMetaComment = !self.showMetaComment;
					if(self.showMetaComment)
						self.showComment = false;
				}
				self.switchShowComment = function(){
					if(self.currentCharacter && self.currentCharacter.id){
						self.showComment = !self.showComment;
						if(self.showComment)
							self.showMetaComment = false;
					}
				}
				
			},
			controllerAs: "showNewsPost",
			bindToController : true
		}	 
}]);
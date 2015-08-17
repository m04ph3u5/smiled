angular.module("smiled.application").directive('summarizeInfoPost', [ 'CONSTANTS',
	function(CONSTANTS){
		return{
			templateUrl : "assets/private/partials/summarize-info-post-template.html",
			scope : {
				post : "=",
				currentCharacter : "=",
				showComment : "=",
				showMetaComment : "="
			},
			controller: function(){
				var self = this;
				self.likesLabel = "";
				self.commentsLabel = "";
				self.metaCommentsLabel = "";
				
				self.switchShowComments = function(){
					self.showMetaComment = false;
					self.showComment = !self.showComment;
				}
				
				self.switchShowMetaComments = function(){
					self.showComment = false;
					self.showMetaComment = !self.showMetaComment;
				}
				
				self.tooltipLikes = "";
				var i=0;
				var l = CONSTANTS.lengthOfTooltipLikesList;
				while(i<l && i<self.post.likes.length){
					if(self.post.likes[i].id!=self.currentCharacter.id)
						self.tooltipLikes+=self.post.likes[i].name+"&#013";
					else
						self.post.youLike = true;
					i++;
				}
				if(self.post.likes.length==(l+1)){
					self.tooltipLikes+="e ad un&#39altra persona";
				}else if(self.post.likes.length>(l+1)){
					self.tooltipLikes+="e ad altre"+(self.post.likes.length-i)+" persone";
				}

			},
			controllerAs: "summarizeInfoPost",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				scope.$watch('summarizeInfoPost.post.likes.length', function(val){
					if(ctrl.post.likes.length==1 && !ctrl.post.youLike){
						ctrl.likesLabel = "Piace a <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>1 persona</span>";
					}
					else if(ctrl.post.likes.length>1 && !ctrl.post.youLike){
						ctrl.likesLabel = "Piace a <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>"+ctrl.post.likes.length+" persone</span>";
					}
					else if(ctrl.post.likes.length==1 && ctrl.post.youLike){
						ctrl.likesLabel = "Ti piace";
					}
					else if(ctrl.post.likes.length==2 && ctrl.post.youLike){
						ctrl.likesLabel = "Piace a te e ad <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>un altra persona</span>";
					}
					else if(ctrl.post.likes.length>2 && ctrl.post.youLike){
						ctrl.likesLabel = "Piace a te e ad <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>altre "+(ctrl.post.likes.length-1)+" persone</span>";
					}
					else if(ctrl.post.likes.length==0)
						ctrl.likesLabel = "";
				});
				scope.$watch('summarizeInfoPost.post.comments.length', function(val){
					if(ctrl.post.comments.length==1)
						ctrl.commentsLabel = "1 commento";
					else if(ctrl.post.comments.length>1)
						ctrl.commentsLabel = ctrl.post.comments.length+" commenti";
				});
				scope.$watch('summarizeInfoPost.post.metaComments.length', function(val){
					if(ctrl.post.metaComments.length==1)
						ctrl.metaCommentsLabel = "1 suggerimento";
					else if(ctrl.post.metaComments.length>1)
						ctrl.metaCommentsLabel = ctrl.post.metaComments.length+" suggerimenti";
				});
			}
		}
}]);
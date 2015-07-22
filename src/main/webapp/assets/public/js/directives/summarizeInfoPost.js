angular.module("smiled.application").directive('summarizeInfoPost', [ 'CONSTANTS',
	function(CONSTANTS){
		return{
			templateUrl : "assets/private/partials/summarize-info-post-template.html",
			scope : {
				post : "=",
				currentCharacter : "="
			},
			controller: function(){
				var self = this;
				self.likesLabel = "";
				self.commentsLabel = "";
				self.metaCommentsLabel = "";
				
				self.tooltipLikes = "";
				var i=0;
				var l = CONSTANTS.lengthOfTooltipLikesList;
				while(i<l && i<self.post.likes.length){
					if(self.post.likes[i].id!=self.currentCharacter.id)
						self.tooltipLikes+=self.post.likes[i].name+"&#013";
					i++;
				}
				if(self.post.likes.length==(l+1)){
					self.tooltipLikes+="e ad un&#39altra persona";
				}else if(self.post.likes.length>(l+1)){
					self.tooltipLikes+="e ad altre"+(self.post.likes.length-i)+" persone";
				}
					
				
				
				if(self.post.likes.length==1 && !self.post.youLike)
					self.likesLabel = "Piace a <span class='tooltips' title='"+self.tooltipLikes+"'>1 persona</span>";
				else if(self.post.likes.length>1 && !self.post.youLike)
					self.likesLabel = "Piace a <span class='tooltips' title='"+self.tooltipLikes+"'>"+self.post.likes.length+" persone</span>";
				else if(self.post.likes.length==1 && self.post.youLike)
					self.likesLabel = "Ti piace";
				else if(self.post.likes.length==2 && self.post.youLike)
					self.likesLabel = "Piace a te e ad <span class='tooltips' title='"+self.tooltipLikes+"' href='&#35'>un altra persona</span>";
				else if(self.post.likes.length>2 && self.post.youLike)
					self.likesLabel = "Piace a te e ad <span class='tooltips' title='"+self.tooltipLikes+"' href='&#35'>altre "+(self.post.likes.length-1)+" persone</span>";
				
				if(self.post.comments.length==1)
					self.commentsLabel = "1 commento";
				else if(self.post.comments.length>1)
					self.commentsLabel = self.post.comments.length+" commenti";
				
				if(self.post.metaComments.length==1)
					self.metaCommentsLabel = "1 suggerimento";
				else if(self.post.metaComments.length>1)
					self.metaCommentsLabel = self.post.metaComments.length+" suggerimenti";

			},
			controllerAs: "summarizeInfoPost",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				scope.$watch('summarizeInfoPost.post.likes.length', function(val){
					if(ctrl.post.likes.length==1 && !ctrl.post.youLike)
						ctrl.likesLabel = "Piace a <a class='tooltips' title='"+ctrl.tooltipLikes+"' href=''>1 persona</a>";
					else if(ctrl.post.likes.length>1 && !ctrl.post.youLike)
						ctrl.likesLabel = "Piace a <a class='tooltips' title='"+ctrl.tooltipLikes+"' href=''>"+ctrl.post.likes.length+" persone</a>";
					else if(ctrl.post.likes.length==1 && ctrl.post.youLike)
						ctrl.likesLabel = "Ti piace";
					else if(ctrl.post.likes.length==2 && ctrl.post.youLike)
						ctrl.likesLabel = "Piace a te e ad <a class='tooltips' title='"+ctrl.tooltipLikes+"' href=''>un altra persona</a>";
					else if(ctrl.post.likes.length>2 && ctrl.post.youLike)
						ctrl.likesLabel = "Piace a te e ad <a class='tooltips' title='"+ctrl.tooltipLikes+"' href=''>altre "+(ctrl.post.likes.length-1)+" persone</a>";
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
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
				
			},
			controllerAs: "showNewsPost",
			bindToController : true
		}	 
}]);
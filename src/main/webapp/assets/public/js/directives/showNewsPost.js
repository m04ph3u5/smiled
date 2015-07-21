angular.module("smiled.application").directive('showNewsPost', [ 
                                                                 
	function showNewsPost(){
		return {
			templateUrl: "assets/private/partials/show-news-post-template.html",
			scope : {
				post: "=",
				scenarioId : "@"
			},
			controller : function(){
				
			},
			controllerAs: "showNewsPost",
			bindToController : true
		}	 
}]);
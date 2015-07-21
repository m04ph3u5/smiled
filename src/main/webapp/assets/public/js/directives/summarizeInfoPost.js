angular.module("smiled.application").directive('summarizeInfoPost', [ 
	function(){
		return{
			templateUrl : "assets/private/partials/summarize-info-post-template.html",
			scope : {
				post : "="
			},
			controller: function(){},
			controllerAs: "summarizeInfoPost",
			bindToController : true
		}
}]);
angular.module("smiled.application").directive('commentTo',[ 

	function(){
		return {
			templateUrl: "assets/private/partials/comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				currentCharacter : "=",
				scenarioId : "@" 
			},
			controller : function(){
				
			},
			controllerAs: "commentTo",
			bindToController: true
		};
}]);
angular.module("smiled.application").directive("insertPost", [
                                     function(){
	return {
		templateUrl: "assets/private/partials/insert-post-template.html",
		scope : {
			character: "=",
			posts: "=",
			scenario: "=",
			hasCharacter: "=",
			isModerator: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.showBoxEvent = true;
			
		}],
		
		controllerAs: "insertPost"
		
	}
}]);


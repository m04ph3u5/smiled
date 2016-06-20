angular.module("smiled.application").directive("newspaperPreview", [
                                     function(){
	return {
		restrict: "AE",
		templateUrl: "assets/private/partials/newspaperPreview.html",
		scope : {
			newspaper: '=?'
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			
		}],
		
		controllerAs: "newspaperPreview"
		
	}
}]);
angular.module("smiled.application").directive('updatePostOnScrool',[ '$window', 'CONSTANTS',
    function($window, CONSTANTS){
		return {
			scope : {
				
			},
			controller : function(){
				
			},
			controllerAs: "updatePostOnScrool",
			bindToController: true,
			link : function(scope, elem, attrs, ctrl){
				angular.elem($window).bind("scroll", function() {
		             if (this.pageYOffset >= 150) {
		                 scope.stopUpdatePost();
		             } else {
		                 scope.startUpdatePost;
		             }
		            scope.$apply();
		        });
			}
		};
}]);
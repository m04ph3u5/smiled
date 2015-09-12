angular.module("smiled.application").directive('updatePostOnScrool',[ '$window', 
    function($window){
		return {
			scope : {
				stop : '&',
				start : '&'
			},
//			controller : function($scope) {
//				var self = this;
//				self.start = $scope.start;
//				self.stop = $scope.stop;
//			},
//			controllerAs: "updatePostOnScrollCtrl",
//			bindToController : true,
			link : function(scope, element, attrs){
				angular.element($window).bind("scroll", function() {
		             if (this.pageYOffset <= 450) {
		                 scope.start();
		             } else {
		                 scope.stop();
		             }
		             scope.$apply();
		             scope.$on('$destroy', function() {
		                 scope.stop();
		                 cleanup();
		               });
		        });
			}
		};
}]);
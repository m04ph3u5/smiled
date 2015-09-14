angular.module("smiled.application").directive('updatePostOnScrool',[ '$window', 
    function($window){
		return {
			scope : {
				stop : '&',
				start : '&'
			},
			controller : function($scope) {
				var self = this;
				self.control = function() {
		             if (this.pageYOffset <= 800) {
		                 self.start();
		             } else {
		                 self.stop();
		             }
				};
			
			},
			controllerAs: "updatePostOnScrollCtrl",
			bindToController : true,
			link : function(scope, element, attrs, ctrl){
				angular.element($window).on("scroll", ctrl.control);
		          
				scope.$on('$destroy', function() {
		           	 console.log("LOCATION CHANGE");
		             ctrl.stop();
		             angular.element($window).off('scroll', ctrl.control);
		        });
			}
		};
}]);
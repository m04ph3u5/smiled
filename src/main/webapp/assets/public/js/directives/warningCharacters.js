angular.module("smiled.application").directive('warningCharacters', ['article','$state','$log',
                                     function(article, $state, $log){
	
	return {
		restrict: 'E',
		templateUrl: "assets/private/partials/warning-characters.html",
		scope: {
			notifyWarning: '&edit',
			notifyClose: '&close',
			stylebox: '@'
		},
		controller: ['$scope', function($scope){
			var self = this;
			
			self.modifyNow = function(){
				$scope.notifyWarning(); 
			},
			
			self.close = function(){
				$scope.notifyClose();
			}
			 
			
		}],
		
		controllerAs: "warningCharacters", 
		
		link: function(scope,elem,attrs,ctrl) {
	
			
		}
		
	}
	
}]);
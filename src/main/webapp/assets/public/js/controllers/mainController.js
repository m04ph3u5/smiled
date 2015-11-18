angular.module('smiled.application').controller('mainCtrl', ['$state', '$rootScope', '$scope', '$timeout', '$q',
         function loggedCtrl($state, $rootScope, $scope, $timeout){
	
	 $rootScope.$on('unauthorized', function() {
        $state.go('notLogged.login');
	 });
	 
}]);
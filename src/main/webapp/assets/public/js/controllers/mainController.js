angular.module('smiled.application').controller('mainCtrl', ['$state', '$rootScope',
         function loggedCtrl($state, $rootScope){
	
	 $rootScope.$on('unauthorized', function() {
        $state.go('notLogged.login');
	 });
	 
}]);
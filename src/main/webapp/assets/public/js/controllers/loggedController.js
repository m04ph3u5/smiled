angular.module('smiled.application').controller('loggedCtrl', ['loggedUser', '$state',
         function loggedCtrl(loggedUser,$state){
	
		
		
		if(loggedUser.role.authority=="ROLE_ADMIN"){
			$state.go('logged.dashboard.admin.users');
		}
		else if(loggedUser.role.authority=="ROLE_TEACHER"){
			$state.go('logged.dashboard.teacher');
		}
		else if(loggedUser.role.authority=="ROLE_USER"){
			$state.go('logged.dashboard.student');
		}
		
}]);



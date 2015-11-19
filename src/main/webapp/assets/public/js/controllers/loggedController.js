angular.module('smiled.application').controller('loggedCtrl', ['loggedUser', '$state',
         function loggedCtrl(loggedUser,$state){
	
		console.log("loggedCtrl");
		console.log(loggedUser);
		console.log(loggedUser.role.authority);
		
		
		if(loggedUser.role.authority=="ROLE_ADMIN"){
			console.log("ADMIN");
			$state.go('logged.dashboard.admin.users');
		}
		else if(loggedUser.role.authority=="ROLE_TEACHER"){
			console.log("TEACHER");
			$state.go('logged.dashboard.teacher');
		}
		else if(loggedUser.role.authority=="ROLE_USER"){
			console.log("USER");	
			$state.go('logged.dashboard.student');
		}
		
}]);



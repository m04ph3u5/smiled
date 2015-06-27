angular.module('smiled.application').controller('loggedCtrl', ['userService', '$state',
         function loggedCtrl(userService,$state){
	
	userService.getUser().then(
		function(data){
			if(data.role.authority=="ROLE_USER")
				$state.go('logged.dashboard.student');
			else if(data.role.authority=="ROLE_TEACHER")
				$state.go('logged.dashboard.teacher');
			else if(data.role.authority=="ROLE_ADMIN")
				$state.go('logged.dashboard.admin');
		},
		function(reason){
			console.log("loggedCtrl failure: "+reason);
			$state.go('login');
		}
	);
}]);



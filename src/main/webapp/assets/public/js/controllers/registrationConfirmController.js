angular.module('smiled.application').controller('registrationConfirmCtrl', ['$state',
            function($state){
				$state.go('login');
			}
]);
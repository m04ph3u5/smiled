angular.module('smiled.application').controller('loginCtrl', ['$scope', 'userService', 'apiService', 
                                                              function loginCtrl($scope, userService, apiService){
	
	$scope.login = login;
	$scope.logout = logout;
	$scope.postRegister = postRegister;

	
	console.log("LoginCtrl");
	
	function login(){
		console.log("-----------> User: "+$scope.user.email+" - Password: "+$scope.user.password);
		userService.login($scope.user.email, $scope.user.password);
	}
	
	function logout(){
		userService.logout();
	}
	
	$scope.error=false;
	$scope.register = {};
	
	function postRegister(){
		if(validateRegister()){
			apiService.postRegister($scope.register).then(
					function(data){
						$scope.error=false;
						alert("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					},
					function(reason){
						$scope.error=true;
//						$scope.register.email="";
//						$scope.register.firstName="";
//						$scope.register.lastName="";
//						$scope.register.password="";
//						$scope.register.bornDate="";
					}
			);
		}
	}
	
	function validateRegister(){
		if($scope.register.password!=$scope.confirmPassword)
			return false;
		
		return true;
	}
	
	/*Opzioni per datepicker*/
	$scope.dateOptions = {
			dateFormat: 'dd/mm/yy'
			//autosize: true
	};
}]);
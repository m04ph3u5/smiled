angular.module('smiled.application').controller('registerCtrl', ['$scope', 'apiService', '$state', 
                                                                 function registerCtrl($scope, apiService, $state){

	$scope.error=false;
	$scope.postRegister = postRegister;
	$scope.register = {};
	
	function postRegister(){
		apiService.postRegister($scope.register).then(
				function(data){
					$scope.error=false;
					alert("La tua richiesta è stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					$state.go("login");
				},
				function(reason){
					$scope.error=true;
					$scope.register.email="";
					$scope.register.firstName="";
					$scope.register.lastName="";
					$scope.register.gender="";
					$scope.register.password="";
					$scope.register.matter="";
				}
		);
	}

}]);
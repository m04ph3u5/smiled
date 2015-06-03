angular.module('smiled.application').controller('registerCtrl', ['$scope', 'userService', function loginCtrl($scope, apiService){
	
	$scope.register = register;
	
	console.log("---------->registerCTRL");
	
	function register(){
		apiService.register($scope.register);
	}
}]);

private String email;

@Size(min=8, max=128)
private String password;

@Size(min=2, max=30)
private String firstName;

@Size(min=2, max=30)
private String lastName;

@NotNull
@Size(min=1, max=1)
private String gender;

@NotNull
@NotEmpty
private String matter;
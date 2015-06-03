angular.module('smiled.application').controller('dashboardCtrl', ['$scope', '$http', function loginCtrl($scope, $http){
	
	$scope.updateName = updateName;
	console.log("---------->dashboardCtrl");
	function updateName(){
		$http.put("https://localhost:8443/ThesisProject/api/v1/me", {"firstName" : "GIGI"})
		.success(function(data){
			console.log(data);
		})
		.error(
		function(reason){
			console.log(reason);
		});
	}
}]);
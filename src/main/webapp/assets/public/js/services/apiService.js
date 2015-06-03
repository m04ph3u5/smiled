angular.module('smiled.application').factory('apiService', [ '$resource', 
              function apiService($resource){
	

	var baseUrl = "https://localhost:8443/ThesisProject/api/v1";
	
	var meApi = $resource(baseUrl+"/me",{},{
		getMe: {method: "GET"},
		updateMe: {method: "PUT", params: {}}
	});
	
	var registerApi = $resource(baseUrl+"/register",{},{
		register : {method: "POST", params: {}}
	});
	
	var getMe = function(){
		return meApi.getMe().$promise;
	}
	
	var updateMe = function(me){
		return meApi.updateMe(me).$promise;
	}
	
	var register = function(){
		return registerApi.register().$promise;
	}
		
	return{
		getMe : getMe,
		updateMe: updateMe
	}
	
	
}]);
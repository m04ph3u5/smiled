angular.module("smiled.application").service('unauthorizedInterceptor', ['$rootScope', '$q',                                                                        
 function($rootScope,$q,$state) {
	
	return{
	  // optional method
	    'response': function(response) {
	      return response;
	    },
	
	    // optional method
	   'responseError': function(rejection) {
	      
		  if(rejection.status === 401) {
			  console.log("UNAUTHORIZED");
	          $rootScope.$broadcast('unauthorized');		  
	      }
	      return $q.reject(rejection);
	     
	    }
	}
}]);


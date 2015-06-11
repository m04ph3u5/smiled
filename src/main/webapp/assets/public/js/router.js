angular.module('smiled.application')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', 
	         function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider){
	
		var notFoundPath;
		$stateProvider
		.state('login',{
			url: "/",
			templateUrl: 'assets/public/partials/login.html',
			controller: "loginCtrl",
			data: {
				permissions:{
					only: ['anonymous'],
					redirectTo: 'logged'
				}
			}
		})
		.state('logout',{
			url: "/login",
			templateUrl: 'assets/public/partials/login.html',
			controller: "loginCtrl",
			data: {
				permissions:{
					except: ['anonymous'],
					redirectTo: 'login'
				}
			}
		})
		.state('logged',{
			url: "/",
			template: "",
			controller: "dashboardCtrl",	
			data: {
				permissions:{
					except: ['anonymous'],
					redirectTo: 'login'
				}
			}
		})
		.state('student',{
			url: "/",
			templateUrl: "assets/private/partials/dashboardStudent.html",
			controller: "dashboardCtrl",
			data: {
				permissions:{
					only: ['user'],
					redirectTo: 'login'
				}
			}
		})
		.state('teacher',{
			url: "/",
			templateUrl: "assets/private/partials/dashboardTeacher.html",
			controller: "dashboardCtrl",
			data: {
				permissions:{
					only: ['teacher'],
					redirectTo: 'login'
				}
			}
		})
		.state('admin',{
			url: "/",
			templateUrl: "assets/private/partials/dashboardAdmin.html",
			controller: "dashboardCtrl",
			data: {
				permissions:{
					only: ['admin'],
					redirectTo: 'login'
				}
			}
		})
		.state('updateScenario',{
			url: "/updateScenario",
			params : {
				id : null
			},
			templateUrl: "assets/private/partials/updateScenario.html",
			controller: "updateScenarioCtrl",
			data: {
				permissions: {
					only: ['teacher'],
					redirectTo: 'logged'
				}
			}
		})
		.state('personalProfile',{
			url: "/profile",
			params : {
				id : null
			},
			templateUrl: "assets/private/partials/personalProfile.html",
			controller: "personalProfileCtrl",
			data: {
				permissions: {
					except: ['anonymous'],
					redirectTo: 'login'
				}
			}
		})
		.state('createScenario',{
			url: "/createScenario",
			templateUrl: "assets/private/partials/createScenario.html",
			controller: "createScenarioCtrl",
			data: {
				permissions: {
					except: ['anonymous'],
					redirectTo: 'login'
				}
			}
		})
		.state('notFound',{
			url: '/404',
			templateUrl: "assets/public/partials/404.html"
		});
	
		$locationProvider.html5Mode(true);
	
		$urlRouterProvider
		.otherwise('/');
	
		RestangularProvider.setBaseUrl('/ThesisProject/api/v1');
		RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
	}])
	.run(function (Permission,userService, $q) {
    	  console.log("Run application");
    	  Permission.defineRole('anonymous',function(stateParams){
    		  console.log("define anonymous");

    		  if(userService.isLogged())
    			  return false;
    		  else
    			  return true;

    	  });
    	  Permission.defineRole('user',function(stateParams){
    		  console.log("define user");
    		  var deferred = $q.defer();
    		  userService.getUser().then(
    				  function(data){
    					  if(data.role.authority=="ROLE_USER")
    						  deferred.resolve();
    					  else
    						  deferred.reject();
    				  },
    				  function(reason){
    					  deferred.reject();
    				  }
    		  );
    		  return deferred.promise;    			
    	  });
    	  Permission.defineRole('teacher',function(stateParams){
    		  console.log("define teacher");
    		  var deferred = $q.defer();
    		  userService.getUser().then(
    				  function(data){
    					  if(data.role.authority=="ROLE_TEACHER")
    						  deferred.resolve();
    					  else
    						  deferred.reject();
    				  },
    				  function(reason){
    					  deferred.reject();
    				  }
    		  );
    		  return deferred.promise; 
    	  });
    	  Permission.defineRole('admin',function(stateParams){
    		  console.log("define admin");
    		  var deferred = $q.defer();
    		  userService.getUser().then(
    				  function(data){
    					  if(data.role.authority=="ROLE_ADMIN")
    						  deferred.resolve();
    					  else
    						  deferred.reject();
    				  },
    				  function(reason){
    					  deferred.reject();
    				  }
    		  );
    		  return deferred.promise; 
    	  });		
    	 
      });                                

	

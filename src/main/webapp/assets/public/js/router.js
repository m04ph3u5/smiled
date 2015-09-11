angular.module('smiled.application')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
	         function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider){
	
		var notFoundPath;
		$stateProvider
		.state('notLogged',{
			templateUrl: 'assets/public/partials/template-notLogged.html',
			abstract : true,
			data: {
				permissions: {
					only: ['anonymous'],
					redirectTo: 'logged.dashboard'
				}
			}
			
		})
		.state('notLogged.welcome',{
			url: "/",
			views: {
				'content': {
					templateUrl: 'assets/public/partials/showcase.html',
				}
			}
		})
		.state('notLogged.login',{
			url: "/login",
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: 'assets/public/partials/registerPartial.html',
					controller: "registerCtrl",
					controllerAs:"register",
				}
			}
		})
		.state('notLogged.policy',{
			url: "/cookie-policy",
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: 'assets/public/partials/cookie-policy.html',
				}
			}
		})
		.state('logged',{
			templateUrl: 'assets/private/partials/template-logged.html',
			abstract: true,
			data: {
				permissions: {
					except: ['anonymous'],
					redirectTo: 'notLogged.welcome' 
				}
			}
		})
		.state('logged.dashboard',{
			url: '/dashboard',
			views: {
				'content': {
					controller: "loggedCtrl",
					controllerAs: "logged"
				}				
			},
			resolve : {
				loggedUser : function(userService){
					return userService.getMe();
				} 
			
			}
		})
		.state('logged.dashboard.teacher',{
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/dashboardTeacher.html',
					controller: "dashboardCtrl",
					controllerAs: "dashboard"
				}
			}
		})
		.state('logged.dashboard.student',{
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/dashboardTeacher.html',
					controller: "dashboardCtrl",
					controllerAs: "dashboard"
				}
			}
		})
		.state('logged.dashboard.admin',{
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/dashboardAdmin.html',
					controller: "dashboardCtrl",
					controllerAs: "dashboard"
				}
			}
		})
		.state('logged.dashboard.scenariosList',{
			url: "scenari",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/scenariosList.html",
					controller: 'scenariosListCtrl',
					controllerAs: 'scenariosList'
				}
			}
		})
		.state('logged.dashboard.studentsList',{
			url: "studenti",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/studentsList.html",
					controller: 'studentsListCtrl',
					controllerAs: 'studentsList'
				}
			}
		})
		.state('logged.dashboard.colleaguesList',{
			url: "colleghi",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/colleaguesList.html",
					controller: 'colleaguesListCtrl',
					controllerAs: 'colleaguesList'
				}
			}
		})
		.state('logged.dashboard.filesList',{
			url: "/materiale",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/filesList.html",
					controller: 'filesListCtrl',
					controllerAs: 'filesList'
				}
			}
		})
		.state('logged.userProfile',{
			url: "/utente/{id}",
			params: {
				id : null
			},
			views: {
				'content': {
					templateUrl: "assets/private/partials/personalProfile.html",
					controller: 'personalProfileCtrl',
					controllerAs: 'personalProfile'
				}
			}
		})
		.state('logged.scenario',{
			url: "/scenario/{id}",
			abstract: true,
			/*params id necessario per accedere allo stato attraverso state.go*/
			params : {
				id : null
			},
			views: {
				'content' : {
					templateUrl: "assets/private/partials/template-scenario.html",
					controller: "scenarioCtrl",
					controllerAs: "scenario"
				}
			},
			resolve : {
				scenario : function(apiService,$stateParams){
					var idScenario = $stateParams.id;
					return apiService.getScenario(idScenario);
				},
				loggedUser : function(userService){
					return userService.getMe();
				}
			}			
		})
		.state('logged.scenario.posts',{
			url: '/post',
			views: {
				'body': {
					templateUrl: "assets/private/partials/posts-scenario.html",
					controller: "scenarioPostCtrl",
					controllerAs: "scenarioPost"
				}
			}
		})
		.state('logged.scenario.storyline',{
			url: '/storyline',
			views: {
				'body': {
					templateUrl: "assets/private/partials/storyline-scenario.html",
					controller: "scenarioStorylineCtrl",
					controllerAs: "scenarioStoryline"
				}
			}
		})
		.state('logged.scenario.characters',{
			url: '/personaggi',
			views: {
				'body': {
					templateUrl: "assets/private/partials/characters-scenario.html",
					controller: "scenarioCharactersCtrl",
					controllerAs: "scenarioCharacters"
				}
			}
		})
		.state('logged.scenario.map',{
			url: '/mappa',
			views: {
				'body': {
					templateUrl: "assets/private/partials/map-scenario.html",
					controller: "scenarioMapCtrl",
					controllerAs: "scenarioMap"
				}
			}
		})
		.state('logged.scenario.charprofile',{
			url: '/personaggi/{idCharacter}',
			views: {
				'body': {
					templateUrl: "assets/private/partials/character-scenario-profile.html",
					controller: "characterProfileCtrl",
					controllerAs: "characterProfile"
				}
			},
			params: {
				idCharacter: null
			}
		})
		.state('logged.scenarioWizard',{
			abstract: true,
			url : "/scenarioWizard",
			params: {
				id: null
			},
			views : {
				'content' : {
					templateUrl: "assets/private/partials/template-scenario-wizard.html",
					controller: "scenarioWizardCtrl",
					controllerAs: "scenarioWizard"
				}
			}
		})
		.state('logged.scenarioWizard.info',{
			url : "/{id}/info",
			templateUrl: "assets/private/partials/info-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.attendees',{
			url : "/{id}/attendees",
			templateUrl: "assets/private/partials/attendees-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.characters',{
			url : "/{id}/characters",
			templateUrl: "assets/private/partials/characters-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.associations',{
			url : "/{id}/associations",
			templateUrl: "assets/private/partials/associations-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.collaborators',{
			url : "/{id}/collaborators",
			templateUrl: "assets/private/partials/collaborators-scenario-wizard.html",
		})
		
//		.state('logout',{
//			url: "/login",
//			templateUrl: 'assets/public/partials/login.html',
//			controller: "loginCtrl",			
//			data: {
//				permissions:{
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('logged',{
//			url: "/",
//			template: "",
//			controller: "dashboardCtrl",
//			controllerAs: "dashboard",
//			data: {
//				permissions:{
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('student',{
//			url: "/",
//			templateUrl: "assets/private/partials/dashboardStudent.html",
//			controller: "dashboardCtrl",
//			controllerAs: "dashboard",
//			data: {
//				permissions:{
//					only: ['user'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('teacher',{
//			url: "/",
//			templateUrl: "assets/private/partials/dashboardTeacher.html",
//			controller: "dashboardCtrl",
//			controllerAs: "dashboard",
//			data: {
//				permissions:{
//					only: ['teacher'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('admin',{
//			url: "/",
//			templateUrl: "assets/private/partials/dashboardAdmin.html",
//			controller: "dashboardCtrl",
//			controllerAs: "dashboard",
//			data: {
//				permissions:{
//					only: ['admin'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('scenario',{
//			url: "/scenario",
//			params : {
//				id : null
//			},
//			templateUrl: "assets/private/partials/scenario.html",
//			controller: "scenarioCtrl",			
//			data: {
//				permissions: {
//					only: ['teacher'],
//					redirectTo: 'logged'
//				}
//			}
//		})
//		.state('personalProfile',{
//			url: "/profile",
//			params : {
//				id : null
//			},
//			templateUrl: "assets/private/partials/personalProfile.html",
//			controller: "personalProfileCtrl",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('updateScenario',{
//			url: "/updateScenario",
//			templateUrl: "assets/private/partials/updateScenario.html",
//			controller: "updateScenarioCtrl",
//			controllerAs:"updateScenario",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'logged'
//				}
//			}
//		})
////		.state('createScenario.createScenarioSon',{
////			parent: "createScenario",
////			url: "/createScenarioSon",
////			templateUrl: "assets/private/partials/createScenario.createScenarioSon.html",
////			
////		})
//		.state('expandScenarios',{
//			url: "/expandScenarios",
//			templateUrl: "assets/private/partials/scenariosList.html",
//			controller: "expandCtrl",
//			controllerAs: "expand",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('viewStudents',{
//			url: "/viewStudents",
//			templateUrl: "assets/private/partials/studentsList.html",
////			controller: "dashboardCtrl",
////			controllerAs: "scenariosList",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('viewColleagues',{
//			url: "/viewColleagues",
//			templateUrl: "assets/private/partials/colleaguesList.html",
////			controller: "dashboardCtrl",
////			controllerAs: "scenariosList",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('viewFiles',{
//			url: "/viewFiles",
//			templateUrl: "assets/private/partials/filesList.html",
////			controller: "dashboardCtrl",
////			controllerAs: "scenariosList",
//			data: {
//				permissions: {
//					except: ['anonymous'],
//					redirectTo: 'login'
//				}
//			}
//		})
//		.state('notLogged.setPassword',{
//			url: '/setPassword.html',
//			views: {
//				'header': {
//					templateUrl: 'assets/public/partials/navbar-login.html',
//					controller: "loginCtrl",
//					controllerAs:"login",
//				},
//				'content': {
//					templateUrl: 'assets/public/partials/registerPartial.html',
//					controller: "registerCtrl",
//					controllerAs:"register",
//				}
//			}
//		})
		.state('notLogged.registrationConfirm',{
			url: '/registrationConfirm.html',
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: 'assets/public/partials/registerPartial.html',
					controller: "registerCtrl",
					controllerAs:"register",
				}
			}
		})
		.state('notLogged.notFound',{
			url: '/404',
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: "assets/public/partials/404.html"			
				}
			}
		});
		
		$urlRouterProvider.otherwise(function($injector,$location){
			var state = $injector.get('$state');
			state.go('notLogged.notFound');
		});
	

		$locationProvider.html5Mode(true);
		RestangularProvider.setBaseUrl('/api/v1');
		RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
	}])
	.run(function (Permission,userService, $q) {
    	  console.log("Run application");
    	  Permission.defineRole('anonymous',function(stateParams){
    		  console.log("check anonymous");
    		  var deferred = $q.defer();
    		  userService.getMe().then(
    				  function(data){
    					  deferred.reject();
    				  },
    				  function(reason){
    					  deferred.resolve();
    				  }
    		  );
    		  return deferred.promise;

    	  });
    	  Permission.defineRole('user',function(stateParams){
    		  console.log("check user");
    		  var deferred = $q.defer();
    		  userService.getMe().then(
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
    		  console.log("check teacher");
    		  var deferred = $q.defer();
    		  userService.getMe().then(
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
    		  console.log("check admin");
    		  var deferred = $q.defer();
    		  userService.getMe().then(
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

	

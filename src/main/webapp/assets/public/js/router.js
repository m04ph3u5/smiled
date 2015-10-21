angular.module('smiled.application')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$httpProvider',
	         function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $httpProvider){
	
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
		.state('notLogged.setFirstPassword',{
			url: "/setPassword",
			views: {
				'content': {
					templateUrl: 'assets/public/partials/setPassword.html',
					controller: "setPasswordCtrl",
					controllerAs:"setPassword",
				}
			},
			data : {
				pageTitle : 'setPassword - Meschola'
			}
		})
		.state('notLogged.welcome',{
			url: "/",
			views: {
				'content': {
					templateUrl: 'assets/public/partials/showcase.html',
				}
			},
			data : {
				pageTitle : 'Meschola'
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
			},
			data : {
				pageTitle : 'Login - Meschola'
			}
		})
		.state('notLogged.forgotPassword',{
			url: "/login",
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: 'assets/public/partials/forgotPartial.html',
					controller: "forgotCtrl",
					controllerAs:"forgot",
				}
			},
			data : {
				pageTitle : 'Recupera password - Meschola'
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
			},
			data : {
				pageTitle : 'Cookie policy - Meschola'
			}
		})
		.state('logged',{
			templateUrl: 'assets/private/partials/template-logged.html',
			controller : "mainCtrl",
			abstract: true,
			data: {
				permissions: {
					except: ['anonymous'],
					redirectTo: 'notLogged.welcome' 
				}
			}
		})
		.state('logged.issues',{
			url: '/anomalie',
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/issues.html',
					controller: "issuesCtrl",
					controllerAs: "issues"
				}
			},
			data : {
				pageTitle : "Segnala un problema - Meschola"
			}
		})
		.state('logged.toolMap',{
			url: '/tool-mappe',
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/toolMap.html',
					controller: "toolMapCtrl",
					controllerAs: "toolMap"
				}
			},
			data : {
				pageTitle : "Download tool generazione mappe - Meschola"
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
			
			},
			data : {
				pageTitle : 'Meschola'
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
					templateUrl: 'assets/private/partials/dashboardStudent.html',
					controller: "dashboardCtrl",
					controllerAs: "dashboard"
				}
			}
		})
		.state('logged.dashboard.admin',{
			url : "/admin",
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/dashboardAdmin.html',
					controller: "dashboardAdminCtrl",
					controllerAs: "dashboardAdmin"
				}
			},
			data: {
				permissions: {
					only: ['admin'],
					redirectTo: 'logged.dashboard' 
				},
				pageTitle : 'Amministrazione - Meschola'
			},
		})
		.state('logged.dashboard.admin.scenarios',{
			url : "/scenari",
			templateUrl: "assets/private/partials/admin-scenarios.html",
		})
		.state('logged.dashboard.admin.users',{
			url : "/utenti",
			templateUrl: "assets/private/partials/admin-users.html",
		})
		.state('logged.dashboard.admin.characters',{
			url : "/personaggi",
			templateUrl: "assets/private/partials/admin-characters.html",
		})
		.state('logged.dashboard.admin.posts',{
			url : "/post",
			templateUrl: "assets/private/partials/admin-posts.html",
		})
		.state('logged.dashboard.admin.exceptionsOnClient',{
			url : "/eccezioni",
			templateUrl: "assets/private/partials/admin-eccezioni.html",
		})
		.state('logged.dashboard.scenariosList',{
			url: "scenari",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/scenariosList.html",
					controller: 'scenariosListCtrl',
					controllerAs: 'scenariosList'
				}
			},
			data : {
				pageTitle : 'I miei scenari - Meschola'
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
			},
			data : {
				pageTitle : 'I miei studenti - Meschola'
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
			},
			data : {
				pageTitle : 'I miei colleghi - Meschola'
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
			},
			data : {
				pageTitle : 'Il mio materiale - Meschola'
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
			},
			data : {
				pageTitle : 'Profilo - Meschola'
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
			},
			data : {
				pageTitle : 'Meschola'
			}
		})
//		.state('logged.scenario.posts.post',{
//			url: '/post/{idPost}',
//			params : {
//				idPost : null
//			},
//			views: {
//				'body': {
//					templateUrl: "assets/private/partials/single-post-scenario.html",
//					controller: "singlePostCtrl",
//					controllerAs: "singlePost"
//				}
//			},
//			data : {
//				pageTitle : 'Meschola'
//			}
//		})
		.state('logged.scenario.storyline',{
			url: '/storyline',
			views: {
				'body': {
					templateUrl: "assets/private/partials/storyline-scenario.html",
					controller: "scenarioStorylineCtrl",
					controllerAs: "scenarioStoryline"
				}
			},
			data : {
				pageTitle : 'Storyline - Meschola'
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
			},
			data : {
				pageTitle : 'I personaggi - Meschola'
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
			},
			data : {
				pageTitle : 'La mappa - Meschola'
			}
		})
		.state('logged.scenario.socialGraph',{
			url: '/relazioni',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/social-graph.html",
					controller : "scenarioSocialGraphCtrl",
					controllerAs : "socialGraph"
				}
			},
			data : {
				pageTitle : "Grafo delle relazioni - Meschola"
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
			},
			data : {
				pageTitle : 'Profilo - Meschola'
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
			},
			data : {
				pageTitle : 'Gestisci scenario - Meschola'
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
			},
			data : {
				pageTitle : 'Meschola - Conferma registrazione'
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
			},
			data : {
				pageTitle : '404 - Meschola'
			}
		});
		
		$urlRouterProvider.otherwise(function($injector,$location){
			var state = $injector.get('$state');
			state.go('notLogged.notFound');
		});
	    $httpProvider.interceptors.push('unauthorizedInterceptor');
		$locationProvider.html5Mode(true);
		RestangularProvider.setBaseUrl('/api/v1');
		RestangularProvider.setDefaultHeaders({'Content-Type' : 'application/json'});
	}])
	.run(function (Permission,userService, $q, $rootScope, $stateParams, $state) {
		
		$rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        
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

	

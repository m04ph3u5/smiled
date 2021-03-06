angular.module('smiled.application', ['ui.router', 'ngCookies', 'ui.bootstrap', 
                                      'ngStorage', 'ngResource', 'permission',
                                      'ngFileUpload', 'ui.date', 'ngDialog',
                                      'ang-drag-drop','infinite-scroll', 'ngTagsInput',
                                      'bootstrapLightbox', 'ngSanitize', 'fox.scrollReveal',
                                      'ui.slider', 'FBAngular', 'angular-p5',]);
      



angular.module('smiled.application')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
	         function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	
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
//		.state('notLogged.welcome',{
//			url: "/",
//			views: {
//				'content': {
//					templateUrl: 'assets/public/partials/showcase.html',
//				}
//			},
//			data : {
//				pageTitle : 'Meschola'
//			}
//		})
		.state('notLogged.login',{
			url: "/",
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
			url: "/password-dimenticata",
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
		.state('notLogged.moreInfo',{
			url: "/informazioni-meschola",
			views: {
				'header': {
					templateUrl: 'assets/public/partials/navbar-login.html',
					controller: "loginCtrl",
					controllerAs:"login",
				},
				'content': {
					templateUrl: 'assets/public/partials/moreInfo.html',
					controller: "moreInfoCtrl",
					controllerAs:"moreInfo",
				}
			},
			data : {
				pageTitle : 'Info - Meschola'
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
					redirectTo: 'notLogged.login' 
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
		.state('logged.newFeature',{
			url: '/suggerimenti',
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/suggestions.html',
					controller: "issuesCtrl",
					controllerAs: "issues"
				}
			},
			data : {
				pageTitle : "Segnala un problema - Meschola"
			}
		})
		.state('logged.lastNews',{
			url: '/novita',
			views: {
				'content@logged': {
					templateUrl: 'assets/private/partials/lastNews.html',
				}
			},
			data : {
				pageTitle : "Novita' - Meschola"
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
		.state('logged.dashboard.admin.log',{
			url : "/log",
			templateUrl: "assets/private/partials/admin-logs.html",
		})
		.state('logged.dashboard.admin.logSpecificUser',{
			url : "/logUser/{idUser}",
			params : {
				idUser : null,
				firstName: null,
				lastName: null
			},
			templateUrl: "assets/private/partials/admin-userLogs.html",
			controller: "dashboardAdminSpecificLogCtrl",
			controllerAs: "dashboardAdminSpecificLog",
		})
		.state('logged.dashboard.admin.logSpecificScenario',{
			url : "/logScenario/{idScenario}/{idUser}",
			params : {
				idScenario: null,
				idUser : null,
				firstName: null,
				lastName: null,
				scenarioName: null
			},
			templateUrl: "assets/private/partials/admin-scenarioLogs.html",
			controller: "dashboardAdminSpecificLogCtrl",
			controllerAs: "dashboardAdminSpecificLog",
		})
		.state('logged.dashboard.admin.issueSegnalations',{
			url : "/anomalieAdmin",
			templateUrl: "assets/private/partials/admin-issues.html",
		})
		.state('logged.dashboard.admin.suggestionSegnalations',{
			url : "/suggerimentiAdmin",
			templateUrl: "assets/private/partials/admin-segnalations.html",
		})
		.state('logged.dashboard.admin.registrationRequest',{
			url : "/richiesteRegistrazione",
			templateUrl: "assets/private/partials/admin-registrationRequests.html",
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
			url: "/studenti",
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
			url: "/colleghi",
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
		.state('logged.dashboard.missionsList',{
			url: "/missioni",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/personalMissionsList.html",
					controller: 'personalMissionCtrl',
					controllerAs: 'personalMission'
				}
			},
			data : {
				pageTitle : 'I miei compiti - Meschola'
			},
			params: {
				missions: null
			},
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
		.state('logged.dashboard.draft',{
			url: "/bozze",
			views: {
				'content@logged': {
					templateUrl: "assets/private/partials/draftsList.html",
					controller: 'draftsListCtrl',
					controllerAs: 'draftsList'
				}
			},
			data : {
				pageTitle : 'Le mie bozze - Meschola'
			},
			resolve : {
				drafts : function(apiService){
					return apiService.getMyDraft(false);
				} 
			
			},
		})
		.state('logged.dashboard.draft.edit',{
			url: '/{postId}',
			views: {
				'body@logged.dashboard.draft': {
					templateUrl: "assets/private/partials/edit-draft.html",
					controller: "editDraftCtrl",
					controllerAs: "editDraft"
				}
			},
			params: {
				postId: null
			},
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
		.state('logged.myNotifications',{
			url: "/notifiche",
			views: {
				'content': {
					templateUrl: "assets/private/partials/myNotifications.html",
					controller: 'notificationCtrl',
					controllerAs: 'notification'
				}
			},
			data : {
				pageTitle : 'Notifiche - Meschola'
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
		.state('logged.scenario.post',{
			url: '/post/{idPost}',
			params : {
				idPost : null
			},
			views: {
				'body': {
					templateUrl: "assets/private/partials/single-post-scenario.html",
					controller: "singlePostCtrl",
					controllerAs: "singlePost"
				}
			},
			data : {
				pageTitle : 'Meschola'
			},
			
						
		})
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
		.state('logged.scenario.missions',{
			url: '/compiti',
			views : {
				'body' : {	
					templateUrl : "assets/private/partials/missions.html",
					controller : "scenarioMissionsCtrl",
					controllerAs : "scenarioMissions"
				}
			},
			data : {
				pageTitle : "Compiti - Meschola"
			}
		})
		.state('logged.scenario.resources',{
			url: '/materiali',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/resources-scenario.html",
					controller : "scenarioResourcesCtrl",
					controllerAs : "scenarioResources"
				}
			},
			data : {
				pageTitle : "Materiali - Meschola"
			}
		})
		.state('logged.scenario.socialGraph',{
			url: '/relazioni',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/social-graph.html",
					
				}
			},
			data : {
				pageTitle : "Grafo delle relazioni - Meschola"
			}
		})
		
		//first page redazione 
		
		.state('logged.scenario.editorial',{
			url: '/giornale-dashboard',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/dashboard-news.html",
					controller:  "dashboardNewspaperCtrl",  
					controllerAs: "dashboardNewspaper"
					 
				}
			},
			data: {
				pageTitle : "Redazione del Giornale - Meschola"
			},
			
			resolve : {
				loggedUser : function(userService){
					return userService.getMe();
				} 
			
			},
			
			
		})
		
		
		//Impaginazione 1 - INTERNA ALLO SCENARIO
		
		.state('logged.scenario.template1',{
			url: '/giornale-impaginazione',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/templates-newspaper.html",
					controller: "templateCtrl", 
					controllerAs: "template"	
				}
			},
			data: {
				pageTitle : "Redazione del Giornale - Meschola"
			},
			resolve : {
				loggedUser : function(userService){
					return userService.getMe();
				} 
			
			}
		})
		
		
		//pagina vista giornale pubblicato
		
		.state('logged.scenario.newspublished', {
		url: '/giornale-pubblicato/{number}',
		views : {
			
			'body' : {
				
				templateUrl : "assets/private/partials/published-newspaper.html",
				controller: "publishedNewspaperCtrl", 
				controllerAs: "publishedNewspaper"
			},
			data: {
				pageTitle: "Redazione del Giornale - Meschola"	
			},
			
			resolve : {
				loggedUser : function(userService){
					return userService.getMe();
				} 
			
			}
		}
			
		})
		
		
		
		//Bozza articolo - (2 colonne)
		
			.state('logged.scenario.draftArticle2col',{
			url: '/2col-dashboard-draft',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/two-columns-article-draft.html",
					controller: "draftCtrl",
					controllerAs: "draft"
				}
			},
			data: {
				pageTitle : "Redazione del Giornale - Meschola"
			}
		})
		
		
		//Bozza articolo - SIMPLE (1 colonna) 
		
			.state('logged.scenario.draftArticleSimple',{
			url: '/simple-dashboard-draft',
			views : {
				'body' : {
					templateUrl : "assets/private/partials/simple-article-draft.html",
					controller: "draftCtrl",
					controllerAs: "draft"
				}
			},
			data: {
				pageTitle : "Redazione del Giornale - Meschola"
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
				pageTitle : 'Gestisci scenario - Meschola',
				permissions: {
					only: ['teacher','admin'],
					redirectTo: 'logged.dashboard' 
				}
			}
		})
		.state('logged.scenarioWizard.info',{
			url : "/{id}/info",
			templateUrl: "assets/private/partials/info-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.attendees',{
			url : "/{id}/partecipanti",
			templateUrl: "assets/private/partials/attendees-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.characters',{
			url : "/{id}/personaggi",
			templateUrl: "assets/private/partials/characters-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.associations',{
			url : "/{id}/associazioni",
			templateUrl: "assets/private/partials/associations-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.collaborators',{
			url : "/{id}/collaboratori",
			templateUrl: "assets/private/partials/collaborators-scenario-wizard.html",
		})
		.state('logged.scenarioWizard.newspaper',{
			url : "/{id}/giornale",
			templateUrl: "assets/private/partials/newspaper-scenario-wizard.html",
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
		$httpProvider.useApplyAsync(true);
	}])
	.run(function (Permission,userService, $q, $rootScope, $stateParams, $state) {
		
		$rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        
                
    	  Permission.defineRole('anonymous',function(stateParams){
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
    		  var deferred = $q.defer();
    		  userService.getMeForPermission().then(
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
    		  var deferred = $q.defer();
    		  userService.getMeForPermission().then(
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
    		  var deferred = $q.defer();
    		  userService.getMeForPermission().then(
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

	

angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams', 'loggedUser','alertingGeneric','$rootScope',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, loggedUser, alertingGeneric, $rootScope){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	self.scen = $scope.scenario.scen;
	self.loggedUser = loggedUser;
	self.isJournalist; 
	var scenId = $stateParams.id;
	self.newspaperPut = {}; 
	self.newspaperPut.publish = false; 
	self.newspaper = {};
	self.idArticle; 
	
	self.numberJustCreated = article.getNumberJustCreated();
	
	
	if(self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
	}
	
		apiService.getMyLastNewspaper(scenId).then(
				function(data){
					/*Il giornale esiste già */
					if(data.status == "DRAFT"){
						self.newspaper = data; 	
						console.log("IL GIORNALE ESISTE GIà"); 
					} 
					
					/*La redazione ha già un giornale, prendo il nome della testata precedente*/
					
					else if (data.status == "PUBLISHED")  {
						self.newspaper.number = data.number+1;
						self.newspaper.name = CONSTANTS.insertHeadline;
						self.newspaper.font = {'font-family': 'Abril Fatface'};
						/*var n = apiService.getLastNewspaper(scenId);
						n.then(
								function(data){
									self.newspaper.number = data.number+1;
									self.newspaper.name = CONSTANTS.insertHeadline; 
								
									
								},function(reason){
			
									console.log("Errore.");	
								}
						);*/
						
					} console.log(self.newspaper); 
					
				},function(reason){
					/*Giornale del tutto nuovo, assegno variabili di default*/
					if(reason.status == "500" || reason.status == "404"){
						self.newspaper = {};
						self.newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
						self.newspaper.name = CONSTANTS.insertHeadline; 
						self.newspaper.number = 1;
						self.newspaper.font = {'font-family': 'Abril Fatface'};
					}
					
					console.log("Errore.");	
				}
				
				
		);
		
		//settaggio numero appena si sceglie il template in base a un giornale esistente o meno e NOME in base a giornale già esistente o meno
		
	/*	var n = apiService.getLastNewspaper(scenId);
		n.then(
				function(data){
					self.newspaper.number = data.number+1; 
					
				},function(reason){
					
					if(reason.status == "500" || reason.status == "404"){
						self.newspaper.number = 1;
					 
					}
				}
		);*/			

	self.goToDashboard = function(){	
		$state.go('logged.scenario.editorial');
		
	}

	//vai alle bozze per modifica 
	self.goToDraft = function(id){
		
		console.log(self.newspaper.number); 
		//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
		self.currentHeadline = article.getNameJustCreated(); 
		self.isJustDeleted = article.getIsJustDeleted();
	
		if(self.isJustDeleted == true || self.newspaper.status == undefined){
			modalService.showAlertNewspaper();
		} 

		else {
			switch (id){
				
			case 1: 
				self.idArticle = 1;
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticle2col');
				break;
			case 2: 
				self.idArticle = 2;
				console.log("PASSO DI QUI PER BOZZA ARTICOLO 2"); 
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticleSimple');
				break;	
			case 3: 
				self.idArticle = 3;
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticle2col');
				break;
			default: 
				console.log("ERROR");
				
			}
			article.setArticleId(self.idArticle);
			

		}

	}
	
	
	//cancel newspaper 
	self.showPopUpDeleteNewspaper = function (){
	
		self.numberJustCreated = article.getNumberJustCreated(); 
		 
		if(self.numberJustCreated  != 0) {
			modalService.showModalDeleteNewspaper(scenId, self.numberJustCreated);
	
		} else {
			
			modalService.showModalDeleteNewspaper(scenId, self.newspaper.number);		
		}
	}
	 
	
	//pubblicazione giornale
	self.publishNewspaper = function(){
		self.newspaperPut.publish = true; 
		
		if(self.newspaper.julianDayNumber == null) {
			
			modalService.showAlertPublicNewspaper("data");
			
		} else {
			
			var n = apiService.updateNewspaper(scenId, self.newspaper.number, self.newspaperPut); 
			n.then(function(data){
				alertingGeneric.addSuccess("Giornale pubblicato con successo!");
				article.setIsJustDeleted(true);
				article.setIsDraft(false);
				$state.go('logged.scenario.editorial');

			}, function(reason){

				modalService.showAlertPublicNewspaper("numeroArticoli");
				console.log("Impossibile pubblicare il giornale"); 

			}
			);	
			
			
		}
		
		
	
						
	}

	var listenerOnHeader = $rootScope.$on("dialogHeadlineCtrl.createNewspaper",function(event, data){
		self.newspaper = data.newspaper;
	});

	$scope.$on("$destroy", function() {
		listenerOnHeader();
    });

	
}]);
angular.module('smiled.application').controller('characterProfileCtrl', ['CONSTANTS', '$scope', '$stateParams', 'apiService', 'Upload',
              function characterProfileCtrl(CONSTANTS,$scope,$stateParams, apiService, Upload){
	
	
	var self = this;
	self.character = {};
	//due variabili identiche perché ad api service non piaceva self.idchar
	var idChar = $stateParams.idCharacter;
	self.idChar = idChar;
	var scenarioId = $scope.scenario.scen.id;
	self.scen = $scope.scenario.scen;
	self.editProfile = false;
	
	self.actualUserCover = null;
	self.newCharacter = {};
	self.genderBool = true;
	
	self.numberOfPastUsers;
	self.viewPastUsers = false;
	self.viewBiography = false;
	
	//var idUser = $scope.scenario.loggedUser.id;
	self.currentChar = $scope.scenario.currentCharacter.id;
	

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	
	self.openViewPastUsers = function(){
		self.viewPastUsers = true;
	}
	self.closeViewPastUsers = function(){
		self.viewPastUsers = false;
	}
	
	self.openViewBiography = function(){
		self.viewBiography = true;
	}
	self.closeViewBiography = function(){
		self.viewBiography = false;
	}
	
	apiService.getCharacter(scenarioId, idChar).then(
			function(data){
				
				self.character = data;
				self.newCharacter = angular.copy(data);
				if(self.character.actualUser != null && self.character.actualUser.id != null)
					self.actualUserCover = CONSTANTS.urlUserCover(self.character.actualUser.id);
				
				if(self.character.gender == "F")
					self.genderBool = false;
				else
					self.character.gender == "M";   //assumo che se manca il genere, di default è M
				
				self.numberOfPastUsers = Object.size(self.character.pastUserId);
				
			
				
			},
			function(reason){
				console.log("ERROR RETRIEVE CHARACTER: ");
				console.log(reason);
			}
	);
	self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar);
	
	self.toggleEditProfile = function(){
		self.editProfile = !self.editProfile;		
	}
	
	self.getBornMonth = function(){
		if(self.character.bornDate!=null)
			return CONSTANTS.monthString(self.character.bornDate.month);
		else return "";
	}
	
	self.getDeadMonth = function(){
		if(self.character.deadDate!=null)
			return CONSTANTS.monthString(self.character.deadDate.month);
		else return "";
	}
	self.deleteUpdateChar = function(){
		self.newCharacter = angular.copy(self.character);
	}
	
	self.updateChar = function(){	
		if(self.genderBool == false)
			self.newCharacter.gender="F";
		else
			self.newCharacter.gender="M";
		
		var isEquals = isEqualsCharacter();
		
		if(!isEquals){
			
			var charDTO = self.newCharacter;	
			
			apiService.updateCharacter(scenarioId, charDTO , idChar).then(
					
					function(data){
						self.character = data;
						self.newCharacter = angular.copy(data);
						if (self.character.gender =="F")
							self.genderBool=false;
						else 
							self.genderBool=true;
						
						
					},
					function(reason){
						self.newCharacter = angular.copy(self.character);
						if (self.character.gender =="F")
							self.genderBool=false;
						else 
							self.genderBool=true;
					}
			);
		}
		else{
			//NESSUN CAMBIAMENTO - NO PUT!;
		}
		
		
	}
	self.uploadCharacterCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: CONSTANTS.urlCharacterCover(scenarioId,idChar),
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	        })
	        .success(function (data, status, headers, config) {
	            
	            var d = new Date();

	            self.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar)+"?"+d.toString();
	            $scope.scenario.currentCharacter.cover = self.cover;
	            for(var i=0; i<self.posts.length; i++){
					self.posts[i].character.cover = CONSTANTS.urlCharacterCover(scenarioId, idChar)+"?"+d.toString();;
	            }
//	            for(var i=0; i<self.scenario.characters.length; i++){
//	            	if(self.scenario.characters[i].id==idCharacter){
//	            		var d = new Date();
//	            		self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, idCharacter)+"?"+d.toString();
//	            	}
//	            }
	        });
		}
	}
	self.showDeadDatePicker = false;
	self.switchShowDeadDate = function(){
		if(!self.showDeadDatePicker && self.showBornDatePicker){
			self.showBornDatePicker = false;
		}
		self.showDeadDatePicker = !self.showDeadDatePicker;
	}
	
	self.showBornDatePicker = false;
	self.switchShowBornDate = function(){
		if(!self.showBornDatePicker && self.showDeadDatePicker){
			self.showDeadDatePicker = false;
		}
		self.showBornDatePicker = !self.showBornDatePicker;
	}
	
	self.hideDatePicker = function(){
		self.showDeadDatePicker = false;
		self.showBornDatePicker = false;
	}
	
	var isEqualsCharacter = function (){
		
		
		if(self.character.nickname != self.newCharacter.nickname)
			return false;
		if(self.character.quote != self.newCharacter.quote)
			return false;
		if(self.character.description != self.newCharacter.description)
			return false;
		if(self.character.gender != self.newCharacter.gender)
			return false;
		if(self.character.role != self.newCharacter.role)
			return false;
		if(self.genderBool == true && self.character.gender=="F")
			return false;
		if(self.genderBool==false && self.character.gender=="M")
			return false;
		if(self.character.gender==false && self.genderBool==false)
			return false;
		
		if(self.character.bornDate && self.newCharacter.bornDate){
			if(self.character.bornDate.day != self.newCharacter.bornDate.day)
				return false;
			if(self.character.bornDate.month!=self.newCharacter.bornDate.month)
				return false;
			if(self.character.bornDate.year!=self.newCharacter.bornDate.year)
				return false;
			if(self.character.bornDate.afterChrist!=self.newCharacter.bornDate.afterChrist)
				return false;
			
		}else{
			if(self.character.bornDate || self.newCharacter.bornDate) //significa che uno dei due c'è e l'altro no
				return false;
		}
		if(self.character.deadDate && self.newCharacter.deadDate){
			if(self.character.deadDate.day!=self.newCharacter.deadDate.day)
				return false;
			if(self.character.deadDate.month!=self.newCharacter.deadDate.month)
				return false;
			if(self.character.deadDate.year!=self.newCharacter.deadDate.year)
				return false;
			if(self.character.deadDate.afterChrist!=self.newCharacter.deadDate.afterChrist)
				return false;
		}else{
			if(self.character.deadDate || self.newCharacter.deadDate)
				return false;
		}
		
		if(self.character.bornTown != self.newCharacter.bornTown)
			return false;
		if(self.character.deadTown != self.newCharacter.deadTown)
			return false;
		
		return true;
		
	}

	var getPost =function(date, time){
		console.log("GET POST");
		apiService.getLastCharacterPosts(self.scen.id, idChar, scrollable, date, time).then(
				function(data){
					console.log(data);
					var newPosts = [];
					newPosts = data;
					if(data.length==0)
						stopScroll=true;

					for(var i=0; newPosts && i<newPosts.length;i++){
						if(newPosts[i].character){
							newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
						
							for(var j=0; j<newPosts[i].likes.length; j++){
								if(newPosts[i].likes[j].id==idChar){
									newPosts[i].youLike=true;
									break;
								}
							}
						}
						self.posts.push(angular.copy(newPosts[i]));
					}
					self.busy=false;
					
				}, function(reason){
					console.log("errore");
					self.busy=false;
				}
			);
	}
	
	self.posts = [];
	self.busy = false;
	var scrollable = CONSTANTS.numberOfPostForScroll;
	var stopScroll = false;
	
	self.nextPost = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
		if(self.posts.length==0){
			getPost();
		}else{
			getPost(self.posts[self.posts.length-1].julianDayNumber,self.posts[self.posts.length-1].timeNumber);
		}
	}
	
	
//	self.getUserCover = function(){
//		self.userCover = CONSTANTS.urlUserCover(id);				
//	}

}]);
angular.module('smiled.application').controller('colleaguesListCtrl', ['loggedUser', function colleaguesListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
angular.module('smiled.application').controller('customDatePickerNewspaperCtrl', ['startDate', 'endDate', 'newspaper', 'modalService', 'apiService', '$stateParams', 'article',
              function customDatePickerNewspaperCtrl(startDate, endDate, newspaper, modalService, apiService, $stateParams, article){
	
	
	var self = this;
	var scenId = $stateParams.id;
	self.startDate = startDate;
	self.endDate = endDate;
	
	var oldDateString = angular.copy(newspaper.historicalDate);
	var oldDateNumber = angular.copy(newspaper.julianDayNumber);
	
	self.dateNumber = newspaper.julianDayNumber;
	self.dateString = newspaper.historicalDate;
	self.timeNumber = newspaper.timeNumber;
	
	 
	
	
	self.updateDate = function(){

		newspaper.julianDayNumber = self.dateNumber;
		newspaper.historicalDate = self.dateString;
		newspaper.timeNumber = self.timeNumber;
		self.updateNewspaper(newspaper); 
		console.log(newspaper); 
		modalService.closeModalSetHistoryDateNewspaper();
	}
	
	self.cancel = function(){
		self.dateNumber = oldDateNumber;
		self.dateString = oldDateString;
		modalService.closeModalSetHistoryDateNewspaper();
	}
	
	
	self.updateNewspaper = function(toUpdateNewspaper){
		console.log(scenId + " " + toUpdateNewspaper.number + " " + toUpdateNewspaper.historicalDate); 
		var s = apiService.updateNewspaper(scenId, toUpdateNewspaper.number, toUpdateNewspaper); 
		console.log("UPDATE DATE OK!"); 
	}
	
	
}]);

angular.module('smiled.application').controller('customDatePickerTemplateCtrl', ['startDate', 'endDate', 'post', 'modalService',
              function customDatePickerTemplateCtrl(startDate, endDate, post, modalService){
	
	var self = this;
	self.startDate = startDate;
	self.endDate = endDate;

	var oldDateNumber = angular.copy(post.julianDayNumber);
	var oldDateString = angular.copy(post.formattedDate);
	
	self.dateNumber = post.julianDayNumber;
	self.dateString = post.formattedDate;
	self.timeNumber = post.timeNumber;
	
	self.updateDate = function(){
		post.julianDayNumber = self.dateNumber;
		post.formattedDate = self.dateString;
		post.timeNumber = self.timeNumber;
		modalService.closeModalSetHistoryDate();
	}
	
	self.cancel = function(){
		self.dateNumber = oldDateNumber;
		self.dateString = oldDateString;
		modalService.closeModalSetHistoryDate();
	}

}]);
angular.module('smiled.application').controller('dashboardAdminCtrl', ['loggedUser','modalService','apiService','CONSTANTS', '$location','userService','alertingGeneric','$anchorScroll', '$q',
   function dashboardCtrl(loggedUser,modalService,apiService, CONSTANTS, $location, userService, alertingGeneric, $anchorScroll, $q){
	
	var self = this;
	var order=true;
	self.typeOrder="creationDate";
	
	self.user = loggedUser;
	var nItemDefault=20;
	var nPagDefault=0;
	var maxItemDefault=20;
	
	
	self.showClose=true;
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	self.dateFormatBornDate = CONSTANTS.realDateFormatWithoutHour;
	
	self.nItemStudents=nItemDefault;
	self.nItemTeachers=nItemDefault;
	self.nItemExceptions=nItemDefault;
	self.nItemScenarios=nItemDefault;
	self.nItemLogs=nItemDefault;
	self.nItemRegistrationRequests=nItemDefault;
	self.nItemIssues=nItemDefault;
	self.nItemSuggestions=nItemDefault;
	
	self.nPagStudents=nPagDefault;
	self.nPagTeachers=nPagDefault;
	self.nPagExceptions=nPagDefault;
	self.nPagScenarios=nPagDefault;
	self.nPagLogs=nPagDefault;
	self.nPagRegistrationRequests=nPagDefault;
	self.nPagIssues=nPagDefault;
	self.nPagSuggestions=nPagDefault;
	
	
	self.myListOfTeachers = [];
	self.myListOfStudents = [];
	self.myListOfExceptions = [];
	self.myListOfLogs = [];
	self.myListOfScenarios = [];
	self.myListOfUsers = [];
	self.myListOfRegistrationRequests = [];
	self.myListOfSuggestions = [];
	self.myListOfIssues = [];
	
	self.numExceptionsFounded=0;
	self.numLogsFounded=0;
	self.numTeachersFounded=0;
	self.numStudentsFounded=0;
	self.numScenariosFounded=0;
	self.numUsersFounded=0;
	self.numRegistrationRequestsFounded=0;
	self.numIssuesFounded=0;
	self.numSuggestionsFounded=0;
	
	self.showErrorSearchBy = false;
	
	self.noMoreStudents = "";
	self.noMoreTeachers = "";
	self.noMoreScenarios = "";
	self.noMoreUsers = "";
	self.noMoreExceptions = "";
	self.noMoreLogs = "";
	self.noMoreRegistrationRequests = "";
	self.noMoreSuggestions = "";
	self.noMoreissues = "";
	
	
	
	var mapOfUsersInLog = {};
	var mapOfScenariosInLog = {};
	
	/*
	 * INIZIO-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.showTwoCal=false;
	var today = new Date();
	self.dateStartOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
		    "numberOfMonths": 1
	};
	self.dateEndOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
            "numberOfMonths": 1
	};
	
	var weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate()-7);
	self.dateEnd=today;
	self.dateStart=weekAgo;
	/*
	 * FINE-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.typeOfLog="ALL";
	var count = 0;

	self.getCodedName = function(name){
		if(name)
			return encodeURIComponent(name);
		else
			return "";
	}
	
	self.whoIsUser = function(l){
		
		
		if(l.userId in mapOfUsersInLog){
	
			l.firstName = mapOfUsersInLog[l.userId].firstName;
			l.lastName = mapOfUsersInLog[l.userId].lastName;
			l.email = mapOfUsersInLog[l.userId].email;
			
		}
		else{
			userService.getUser(l.userId).then(
					function(data){
						var ref = {};
						ref.firstName = data.firstName;
						ref.lastName = data.lastName;
						ref.email = data.email;
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = data.firstName;
						l.lastName = data.lastName;
						l.email = data.email;
						
						
					}, function(reason){
						var ref = {};
						ref.firstName = "nome non disponibile";
						ref.lastName = "cognome non disponibile";
						ref.email = "email non disponibile";
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = "nome non disponibile";
						l.lastName = "cognome non disponibile";
						l.email = "email non disponibile";
						
						
					}
			);
		}
	}
	self.whoIsScenario = function(l){
		
		
		if(l.scenarioId in mapOfScenariosInLog){
			
			l.nameScenario = mapOfScenariosInLog[l.scenarioId].nameScenario;
			l.creator = mapOfScenariosInLog[l.scenarioId].creator;
			
		}
		else{
			apiService.getScenario(l.scenarioId).then(
					function(data){
						var ref = {};
						ref.nameScenario = data.name;
						ref.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
						
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = data.name;
						l.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
	
					}, function(reason){
						
						var ref = {};
						ref.nameScenario = "nome non disponibile";
						ref.creator = "creatore non disponibile";
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = "nome non disponibile";
						l.creator = "creatore non disponibile";
						
						
					}
			);
		}
	}
	
	self.toggleShowClose = function(){
		self.showClose = !self.showClose;
	}
	self.calculateCover = function (id){
		return CONSTANTS.urlScenarioCover(id);
	}
	self.changeScenariosToPrev = function(){
		self.nPagScenarios--;
		self.searchScenarios();
	}
	self.changeScenariosToNext = function(){
		
		self.nPagScenarios++;
		
		self.searchScenarios();
	}
	
	self.changeRegistrationRequestsToPrev = function(){
		self.nPagRegistrationRequests--;
		self.searchRegistrationRequests();
	}
	self.changeRegistrationRequestsToNext = function(){
		self.nPagRegistrationRequests++;
		self.searchRegistrationRequests();
	}
	
	self.changeIssuesToPrev = function(){
		self.nPagIssues--;
		self.searchIssues();
	}
	self.changeIssuesToNext = function(){
		self.nPagIssues++;
		self.searchIssues();
	}
	
	self.changeSuggestionsToPrev = function(){
		self.nPagSuggestions--;
		self.searchSuggestions();
	}
	self.changeSuggestionsToNext = function(){
		self.nPagSuggestions++;
		self.searchSuggestions();
	}
	
	self.switchTypeOrder = function(){
		self.searchScenarios();
	}
	self.searchScenarios = function(){
		if(self.nItemScenarios>maxItemDefault)
			self.nItemScenarios=maxItemDefault;
		
		if(self.typeOrder=="creationDate"){
			order = true;
		}else{
			order = false;
		}
		apiService.getPagedScenarios(self.nPagScenarios, self.nItemScenarios, order).then(
    			function(data){
    				self.numScenariosFounded= data.totalElements;
    				self.myListOfScenarios = data.content;
    				if(self.myListOfScenarios.length==0)
    					self.noMoreScenarios = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreScenarios = "";
    			}, function(reason){
    				console.log("errore");
    				self.numScenariosFounded= 0;
    			}
    	);
	}
	
	self.searchIssues = function(){
		if(self.nItemIssues>maxItemDefault)
			self.nItemIssues=maxItemDefault;
		
		
		apiService.getPagedIssues(self.nPagIssues, self.nItemIssues).then(
    			function(data){
    				self.numIssuesFounded= data.totalElements;
    				self.myListOfIssues = data.content;
    				if(self.myListOfIssues.length==0)
    					self.noMoreIssues = "Nessuna segnalazione di errore trovata in questa pagina";
    				else
    					self.noMoreIssues = "";
    			}, function(reason){
    				console.log("errore");
    				self.numIssuesFounded= 0;
    			}
    	);
	}
	
	self.searchSuggestions = function(){
		if(self.nItemSuggestions>maxItemDefault)
			self.nItemSuggestions=maxItemDefault;
		
		
		apiService.getPagedSuggestions(self.nPagSuggestions, self.nItemSuggestions).then(
    			function(data){
    				self.numSuggestionsFounded= data.totalElements;
    				self.myListOfSuggestions = data.content;
    				if(self.myListOfSuggestions.length==0)
    					self.noMoreSuggestions = "Nessuna segnalazione di errore trovata in questa pagina";
    				else
    					self.noMoreSuggestions = "";
    			}, function(reason){
    				console.log("errore");
    				self.numSuggestionsFounded= 0;
    			}
    	);
	}
	
	self.searchRegistrationRequests = function(){
		if(self.nItemRegistrationRequests>maxItemDefault)
			self.nItemRegistrationRequests=maxItemDefault;
		
		apiService.getPagedRegistrationRequests(self.nPagRegistrationRequests, self.nItemRegistrationRequests).then(
    			function(data){
    				self.numRegistrationRequestsFounded= data.totalElements;
    				self.myListOfRegistrationRequests = data.content;
    				if(self.myListOfRegistrationRequests.length==0)
    					self.noMoreRegistrationRequests = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreRegistrationRequests = "";
    			}, function(reason){
    				console.log("errore");
    				self.numRegistrationRequestsFounded= 0;
    			}
    	);
	}
	
	self.changeTeachersToPrev = function(){
		self.nPagTeachers--;
		self.searchTeachers();
	}
	self.changeTeachersToNext = function(){
		self.nPagTeachers++;
		self.searchTeachers();
	}
	
	self.searchTeachers = function(){
		if(self.nItemTeachers>maxItemDefault)
			self.nItemTeachers=maxItemDefault;
		apiService.getPagedTeachers(self.nPagTeachers, self.nItemTeachers).then(
    			function(data){
    				self.numTeachersFounded= data.totalElements;
    				self.myListOfTeachers = data.content;
    				if(self.myListOfTeachers.length==0)
    					self.noMoreTeachers = "Nessun utente trovato in questa pagina";
    				else
    					self.noMoreTeachers = "";
    			}, function(reason){
    				console.log("errore");
    				self.numTeachersFounded= 0;
    			}
    	);
	}
	
	
	
	self.searchUsersByFirstNameAndLastName = function(){
		
		if( ( self.firstName==null || self.firstName=="" ) &&
				( self.lastName==null  || self.lastName=="") ) {
			self.showErrorSearchBy = true;
			self.numUsersFounded=0;
			self.myListOfUsers = [];
		}else{
			self.showErrorSearchBy = false;
			apiService.getUsersByFirstNameAndLastName(self.firstName, self.lastName).then(
	    			function(data){
	    				if(data.length>0){
	    					self.numUsersFounded = data.length;
	    					self.myListOfUsers = data;
	    					self.noMoreUsers = "";
	    				}
	    				else{
	    					self.numUsersFounded=0;
		    				self.myListOfUsers = [];
	    					self.noMoreUsers = "Nessun utente trovato";	
	    				}

	    			}, function(reason){
	    				console.log("errore");
	    				self.numUsersFounded=0;
	    				self.myListOfUsers = [];
	    				self.noMoreUsers = "Nessun utente trovato";
	    			
	    			}
	    	);
		}
			
		
	}
	
	self.changeStudentsToPrev = function(){
		self.nPagStudents--;
		self.searchStudents();
	}
	self.changeStudentsToNext = function(){
		self.nPagStudents++;
		self.searchStudents();
	}
	self.searchStudents = function(){
		if(self.nItemStudents>maxItemDefault)
			self.nItemStudents=maxItemDefault;
		apiService.getPagedStudents(self.nPagStudents, self.nItemStudents).then(
    			function(data){
    				self.numStudentsFounded= data.totalElements;
    				self.myListOfStudents = data.content;
    				if(self.myListOfStudents.length==0)
    					self.noMoreStudents = "Nessun utente trovato";	
    				else
    					self.noMoreStudents = "";
    			}, function(reason){
    				console.log("errore");
    				self.numStudentsFounded= 0;
    			}
    	);
	}
	
	
	self.changeExceptionsToPrev = function(){
		self.nPagExceptions--;
		self.searchExceptions();
	}
	self.changeExceptionsToNext = function(){
		self.nPagExceptions++;
		self.searchExceptions();
	}
	self.changeLogsToPrev = function(){
		self.nPagLogs--;
		self.searchLogs();
	}
	self.changeLogsToNext = function(){
		self.nPagLogs++;
		self.searchLogs();
	}
	
	self.searchExceptions = function(){
		if(self.nItemExceptions>maxItemDefault)
			self.nItemExceptions=maxItemDefault;
		apiService.getPagedExceptions(self.nPagExceptions, self.nItemExceptions).then(
    			function(data){
    				self.numExceptionsFounded= data.totalElements;
    				self.myListOfExceptions = data.content;
    				if(self.myListOfExceptions.length==0)
    					self.noMoreExceptions = "Nessuna eccezione trovata in questa pagina";
    				else{
    					self.noMoreExceptions = "";
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numExceptionsFounded= 0;
    			}
    	);
	}
	
	self.searchLogs = function(){
		if(self.nItemLogs>maxItemDefault)
			self.nItemLogs=maxItemDefault;
		var start=null;
		var end = null;
		var type=null;
		console.log("searchLogs");
		console.log(self.typeOfLog);
		type=self.typeOfLog;
		if(type=="ALL")
			type=null;
		if(self.showTwoCal){
			start = self.dateStart;
			end = self.dateEnd;
		}
		apiService.getPagedLogs(start, end, type, self.nPagLogs, self.nItemLogs, null, null).then(
    			function(data){
    				self.numLogsFounded= data.totalElements;
    				self.myListOfLogs = data.content;
    				if(self.myListOfLogs.length==0)
    					self.noMoreLogs = "Nessun log trovato in questa pagina";
    				else{
    					self.noMoreLogs = "";
    					for(var i=0; i< self.myListOfLogs.length; i++){
    						self.whoIsUser(self.myListOfLogs[i]);
    						self.whoIsScenario(self.myListOfLogs[i]);
    					}
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numLogsFounded= 0;
    			}
    	);
	}
	
	self.showResetExceptions = function(){
		if (self.myListOfExceptions.length>0 || self.nPagExceptions!=nPagDefault || self.nItemExceptions!=nItemDefault || self.noMoreExceptions!="")
			return true;
		else return false;
	}
	self.showResetSuggestions = function(){
		if (self.myListOfSuggestions.length>0 || self.nPagSuggestions!=nPagDefault || self.nItemSuggestions!=nItemDefault || self.noMoreSuggestions!="")
			return true;
		else return false;
	}
	self.showResetIssues = function(){
		if (self.myListOfIssues.length>0 || self.nPagIssues!=nPagDefault || self.nItemIssues!=nItemDefault || self.noMoreIssues!="")
			return true;
		else return false;
	}
	self.showResetRegistrationRequests = function(){
		if (self.myListOfRegistrationRequests.length>0 || self.nPagRegistrationRequests!=nPagDefault || self.nItemRegistrationRequests!=nItemDefault || self.noMoreRegistrationRequests!="")
			return true;
		else return false;
	}
	self.showResetLogs = function(){
		if (self.myListOfLogs.length>0 || self.nPagLogs!=nPagDefault || self.nItemLogs!=nItemDefault || self.noMoreLogs!="")
			return true;
		else return false;
	}
	self.showResetScenarios = function(){
		if (self.myListOfScenarios.length>0 || self.nPagScenarios!=nPagDefault || self.nItemScenarios!=nItemDefault || self.noMoreScenarios!="")
			return true;
		else return false;
	}
	
	self.showResetTeachers = function(){
		if (self.myListOfTeachers.length>0 || self.nPagTeachers!=nPagDefault || self.nItemTeachers!=nItemDefault || self.noMoreTeachers!="")
			return true;
		else return false;
	}
	self.showResetUsersByName = function(){
		if (self.myListOfUsers.length>0 || self.showErrorSearchBy || self.noMoreUsers!="")
			return true;
		else return false;
	}
	self.showResetStudents = function(){
		if (self.myListOfStudents.length>0 || self.nPagStudents!=nPagDefault || self.nItemStudents!=nItemDefault || self.noMoreStudents!="")
			return true;
		else return false;
	}
	
	self.resetExceptions = function(){
		self.myListOfExceptions = [];
		self.nItemExceptions=nItemDefault;
		self.nPagExceptions=0;
		self.noMoreExceptions = "";
		self.numExceptionsFounded=0;
	}
	self.resetIssues = function(){
		self.myListOfIssues = [];
		self.nItemIssues=nItemDefault;
		self.nPagIssues=0;
		self.noMoreIssues = "";
		self.numIssuesFounded=0;
	}
	self.resetSuggestions = function(){
		self.myListOfSuggestions = [];
		self.nItemSuggestions=nItemDefault;
		self.nPagSuggestions=0;
		self.noMoreSuggestions = "";
		self.numSuggestionsFounded=0;
	}
	self.resetRegistrationRequests = function(){
		self.myListOfRegistrationRequests = [];
		self.nItemRegistrationRequests=nItemDefault;
		self.nPagRegistrationRequests=0;
		self.noMoreRegistrationRequests = "";
		self.numRegistrationRequestsFounded=0;
	}
	self.resetLogs = function(){
		self.myListOfLogs = [];
		self.nItemLogs=nItemDefault;
		self.nPagLogs=0;
		self.noMoreLogs = "";
		self.numLogsFounded=0;
		self.showTwoCal=false;
		self.typeOfLog="ALL";
	}
	self.resetScenarios = function(){
		self.myListOfScenarios = [];
		self.nItemScenarios=nItemDefault;
		self.nPagScenarios=0;
		self.noMoreScenarios = "";
		self.numScenariosFounded=0;
	}
	self.resetTeachers = function(){
		self.myListOfTeachers = [];
		self.nItemTeachers=nItemDefault;
		self.nPagTeachers=0;
		self.noMoreTeachers = "";
		self.numTeachersFounded=0;
	}
	self.resetStudents = function(){
		self.myListOfStudents = [];
		self.nItemStudents=nItemDefault;
		self.nPagStudents=0;
		self.noMoreStudents = "";
		self.numStudentsFounded=0;
	}
	self.resetUsersByName = function(){
		self.firstName ="";
		self.lastName="";
		self.myListOfUsers = [];
		self.showErrorSearchBy = false;
		self.numUsersFounded=0;
		self.noMoreUsers = "";
	}
	
	
	self.showPopUpConfirmRegistration = function(l){
		modalService.showModalConfirmRegistration(l, true).then(
				function(response){

					
					alertingGeneric.addSuccess("Registrazione confermata");
					if(self.myListOfRegistrationRequests){
						for(var i=0; i<self.myListOfRegistrationRequests.length; i++){
							if(self.myListOfRegistrationRequests[i].id == l.id){
								self.myListOfRegistrationRequests.splice(i,1);
								break;
							}
						}
						self.numRegistrationRequestsFounded--;
						$location.hash("comeHere");
					    $anchorScroll();
					    $location.url($location.path());
					}
					
				}, function(reason){
					alertingGeneric.addWarning("Operazione annullata");			
					$location.hash("comeHere");
				    $anchorScroll();
				    $location.url($location.path());
				
				});
	}
	
	
	self.showPopUpDeleteRegistration = function (l){
		modalService.showModalConfirmRegistration(l, false).then(
				function(response){
					
					alertingGeneric.addSuccess("Registrazione cancellata");
					if(self.myListOfRegistrationRequests){
						for(var i=0; i<self.myListOfRegistrationRequests.length; i++){
							if(self.myListOfRegistrationRequests[i].id == l.id){
								self.myListOfRegistrationRequests.splice(i,1);
								break;
							}
						}
						self.numRegistrationRequestsFounded--;
						$location.hash("comeHere");
					    $anchorScroll();
					    $location.url($location.path());
					}
					
				}, function(reason){
					alertingGeneric.addWarning("Operazione annullata");			
					$location.hash("comeHere");
				    $anchorScroll();
				    $location.url($location.path());
				});
	};
	
	
	
	self.searchMoreInfo = function(l){
		
		
		userService.getUserByEmail(l.email).then(
				function(data){
					l.firstName = data.firstName;
					l.lastName = data.lastName;
					l.registrationDate = data.registrationDate;
					l.agree = data.agree;
					l.profile={};
					l.profile = data.profile;
				}, function(reason){
					console.log("Error in getUserByEmail !!!");
				}
		);
		l.moreInfo=true;
	}
	
}]);

angular.module('smiled.application').controller('dashboardAdminSpecificLogCtrl' ,['apiService', 'userService', 'CONSTANTS','$stateParams','$state',
   function dashboardAdminSpecificLogCtrl(apiService, userService, CONSTANTS, $stateParams, $state){
	
	var self = this;
	
	var nItemDefault=20;
	var nPagDefault=0;
	var maxItemDefault=20;
	self.nItemLogs=nItemDefault;
	
	self.nPagLogs=nPagDefault;
	
	self.myListOfLogs = [];
	self.numLogsFounded=0;
	self.showErrorSearchBy = false;
	self.noMoreLogs = "";
	self.infoStatistics={};
	var firstName, lastName, idUser, idScenario, scenarioName;
	var mapOfScenariosInLog = {};
	var mapOfUsersInLog = {};
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	
	var onStartup = function(){
		
		firstName=$stateParams.firstName;
		if(firstName)
			firstName = decodeURIComponent(firstName);
		lastName=$stateParams.lastName;
		if(lastName)
			lastName = decodeURIComponent(lastName);
		idUser=$stateParams.idUser;
		idScenario=$stateParams.idScenario;
		scenarioName=$stateParams.scenarioName;
		if(scenarioName)
			scenarioName = decodeURIComponent(scenarioName);
		
		if(idUser && ( !firstName || !lastName) && !idScenario){
			whoIsUserAndInfoStatistics();
		}else if(idScenario && !scenarioName){
			if(idUser && ( !firstName || !lastName)){
				whoIsUserAndScenarioAndInfoStatistics();
			}else if(!idUser){
				whoIsScenarioAndInfoStatistics();
			}
			
		}else{
			getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);
		}
	
	}
	

	var getInfoStatistics = function(idUser, idScenario, userFirstName, userLastName, scenarioName){
			
			self.infoStatistics = {};
			if(userFirstName && userLastName)
				self.nameOfUser = userFirstName+" "+userLastName;
			
			self.nameOfScenario=scenarioName;
			
			apiService.getInfoStatistics(idUser, idScenario).then(
	    			function(data){			
	    				self.infoStatistics=data;
	
	    			}, function(reason){
	    				console.log("errore in getInfoStatistics!!!");
	
	    			}
	    	);
	}
	
	var whoIsUserAndScenarioAndInfoStatistics = function(){

		userService.getUser(idUser).then(
				function(data){
					
					firstName = data.firstName;
					lastName = data.lastName;
					whoIsScenarioAndInfoStatistics();
				}, function(reason){
					console.log("errore in getUser");
					$state.go('logged.dashboard.admin.log');
				}
		);
		
	}
	var whoIsUserAndInfoStatistics = function(){

		userService.getUser(idUser).then(
				function(data){
					var ref = {};
					firstName = data.firstName;
					lastName = data.lastName;
					getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);

				}, function(reason){
					console.log("errore in getUser");
					$state.go('logged.dashboard.admin.log');
				}
		);
		
	}
	var whoIsScenarioAndInfoStatistics = function(){

		apiService.getScenario(idScenario).then(
				function(data){
					
					scenarioName = data.name;
					getInfoStatistics(idUser, idScenario, firstName, lastName, scenarioName);

				}, function(reason){	
					console.log("errore in getScenario");
					$state.go('logged.dashboard.admin.log');
				}
		);
	
	}
	
	/*
	 * INIZIO-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.showTwoCal=false;
	var today = new Date();
	self.dateStartOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
		    "numberOfMonths": 1
	};
	self.dateEndOptions = {
			"regional" : "it",
			"minDate" : new Date(2015,0,1,0,0,0,0),
			"maxDate" : today,
            "numberOfMonths": 1
	};
	
	var weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate()-7);
	self.dateEnd=today;
	self.dateStart=weekAgo;
	/*
	 * FINE-----------------------------------------------------------Seleziona intervallo date per i log
	 */
	self.typeOfLog="ALL";
	var count = 0;

	
	
	self.toggleShowClose = function(){
		self.showClose = !self.showClose;
	}

	self.getInfoStatistics = function(user){
		
		self.infoStatistics = {};
		self.nameOfUser = user.firstName+" "+user.lastName;
		apiService.getInfoStatistics(user.id, null).then(
    			function(data){
    				console.log("getInfoStatistics done!!!");
    				console.log(data);
    				self.infoStatistics=data;

    			}, function(reason){
    				console.log("errore in getInfoStatistics!!!");

    			}
    	);
	}
	
	self.changeLogsToPrev = function(){
		self.nPagLogs--;
		self.searchLogs();
	}
	self.changeLogsToNext = function(){
		self.nPagLogs++;
		self.searchLogs();
	}
	
	var findScenario = function(l){
		
		var mapOfScenariosInLog = {};
		if(l.scenarioId in mapOfScenariosInLog){
			
			l.nameScenario = mapOfScenariosInLog[l.scenarioId].nameScenario;
			l.creator = mapOfScenariosInLog[l.scenarioId].creator;
			
		}
		else{
			apiService.getScenario(l.scenarioId).then(
					function(data){
						var ref = {};
						ref.nameScenario = data.name;
						ref.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
						
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = data.name;
						l.creator = data.teacherCreator.firstname +" " + data.teacherCreator.lastname;
	
					}, function(reason){
						
						var ref = {};
						ref.nameScenario = "nome non disponibile";
						ref.creator = "creatore non disponibile";
						mapOfScenariosInLog[l.scenarioId] = angular.copy(ref);
						l.nameScenario = "nome non disponibile";
						l.creator = "creatore non disponibile";
						
						
					}
			);
		}
	}
	var findUser = function(l){
		
		
		if(l.userId in mapOfUsersInLog){
	
			l.firstName = mapOfUsersInLog[l.userId].firstName;
			l.lastName = mapOfUsersInLog[l.userId].lastName;
			l.email = mapOfUsersInLog[l.userId].email;
			
		}
		else{
			userService.getUser(l.userId).then(
					function(data){
						var ref = {};
						ref.firstName = data.firstName;
						ref.lastName = data.lastName;
						ref.email = data.email;
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = data.firstName;
						l.lastName = data.lastName;
						l.email = data.email;
						
						
					}, function(reason){
						var ref = {};
						ref.firstName = "nome non disponibile";
						ref.lastName = "cognome non disponibile";
						ref.email = "email non disponibile";
						mapOfUsersInLog[l.userId] = angular.copy(ref);
						l.firstName = "nome non disponibile";
						l.lastName = "cognome non disponibile";
						l.email = "email non disponibile";
						
						
					}
			);
		}
	}

	self.searchLogs = function(){
		if(self.nItemLogs>maxItemDefault)
			self.nItemLogs=maxItemDefault;
		var start=null;
		var end = null;
		var type=null;
		console.log("searchLogs");
		console.log(self.typeOfLog);
		type=self.typeOfLog;
		if(type=="ALL")
			type=null;
		if(self.showTwoCal){
			start = self.dateStart;
			end = self.dateEnd;
		}
		apiService.getPagedLogs(start, end, type, self.nPagLogs, self.nItemLogs, idUser, idScenario).then(
    			function(data){
    				self.numLogsFounded= data.totalElements;
    				self.myListOfLogs = data.content;
    				if(self.myListOfLogs.length==0)
    					self.noMoreLogs = "Nessun log trovato in questa pagina";
    				else{
    					self.noMoreLogs = "";
    					for(var i=0; i< self.myListOfLogs.length; i++){
    						if(!idUser)
    							findUser(self.myListOfLogs[i]);
    						findScenario(self.myListOfLogs[i]);
    					}
    				}
    			}, function(reason){
    				console.log("errore");
    				self.numLogsFounded= 0;
    			}
    	);
	}
	
	
	self.showResetLogs = function(){
		if (self.myListOfLogs.length>0 || self.nPagLogs!=nPagDefault || self.nItemLogs!=nItemDefault || self.noMoreLogs!="")
			return true;
		else return false;
	}
	
	
	self.resetLogs = function(){
		self.myListOfLogs = [];
		self.nItemLogs=nItemDefault;
		self.nPagLogs=0;
		self.noMoreLogs = "";
		self.numLogsFounded=0;
		self.showTwoCal=false;
		self.typeOfLog="ALL";
	}
	
	onStartup();
	
}]);

angular.module('smiled.application').controller('dashboardCtrl', ['loggedUser','modalService','userService', '$scope','$interval','apiService', 'CONSTANTS',
   function dashboardCtrl(loggedUser,modalService,userService,$scope,$interval,apiService, CONSTANTS){
	
	var self = this;
	var originalUser = angular.copy(loggedUser);
	
	
	self.missionDateFormatDay = CONSTANTS.realDateFormatOnlyDay;
	self.missionDateFormatMonth = CONSTANTS.realDateFormatOnlyMonth;
	
	if(loggedUser.role.authority=="ROLE_USER"){
		self.numScenariosToShow = 5;
		apiService.getMyMissions().then(
				function(data){
					self.myMissions = data;
				},
				function(reason){
					console.log("Error retrieve missions");
					console.log(reason);
				}
		);
	}
	else
		self.numScenariosToShow = 4;
	
	
	apiService.getMyDraft(true).then(
			function(data){
				self.myDraft = data;
				
				for(var i=0;self.myDraft && i<self.myDraft.length;i++){
					if(self.myDraft[i].character){
						self.myDraft[i].character.cover = CONSTANTS.urlCharacterCover(self.myDraft[i].scenarioId, self.myDraft[i].character.id);
					}
					for(var j=0; loggedUser.openScenarios && j<loggedUser.openScenarios.length; j++){
						if(self.myDraft[i].scenarioId==loggedUser.openScenarios[j].id){
							self.myDraft[i].scenarioName = loggedUser.openScenarios[j].name; 
						}
					}
				}
				
			},
			function(reason){
				
			}
	);	
	
	
	self.user = loggedUser;
	self.scenariosToShow = new Array();
	
	self.studentsList = loggedUser.students;
	self.showCollCard = [false,false,false,false,false,false];
	self.selectedUserID = null;
	self.myCharacters = new Array()
	
	self.tab = new Array();
	self.showPopUpCreationScenario = function (){
		modalService.showModalCreateScen();
	};
	
	// -> Fisher–Yates shuffle algorithm
	var shuffleArray = function(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle
	  while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}
	
	function compareDate (a, b){
		
		if (a.creationDate > b.creationDate)
			return -1;
		if(a.creationDate < b.creationDate)
			return 1;
		else return 0;
	}
	
	
	var createArrayOfScenariosToShow = function(){
		var tmp = new Array();
		if (self.user.openScenarios != null && self.user.creatingScenarios != null){
			for(var i=0; i<self.user.openScenarios.length; i++){
				self.user.openScenarios[i].isOpen=true;
			}
			for(var i=0; i<self.user.creatingScenarios.length; i++){
				self.user.creatingScenarios[i].isOpen=false;
			}
			tmp = angular.copy(self.user.openScenarios).concat(angular.copy(self.user.creatingScenarios));
			
		}else if(self.user.openScenarios != null && self.user.creatingScenarios == null){
			self.myCharacters = [];
			for(var i=0; i<self.user.openScenarios.length; i++){
				self.user.openScenarios[i].isOpen=true;
				
				if(self.user.openScenarios[i].myCharacterId){
					var character = {};
					character.scenarioId = self.user.openScenarios[i].id;
					character.id = self.user.openScenarios[i].myCharacterId;
					character.name = self.user.openScenarios[i].myCharacterName;
					character.cover = CONSTANTS.urlCharacterCover(self.user.openScenarios[i].id, self.user.openScenarios[i].myCharacterId);
					self.myCharacters.push(character);
				}
			}
			tmp = angular.copy(self.user.openScenarios);
		}
		else if(self.user.openScenarios == null && self.user.creatingScenarios != null){
			for(var i=0; i<self.user.creatingScenarios.length; i++){
				self.user.creatingScenarios[i].isOpen=false;
			}
			tmp = angular.copy(self.user.creatingScenarios);
		}
		
		tmp.sort(compareDate);
		
		tmp.splice(self.numScenariosToShow, (tmp.length - self.numScenariosToShow));
		
		self.scenariosToShow = tmp;
	}
	
	var getLoggedUser = function(){
		userService.getMe().then(
	
			function(data){
				if(!angular.equals(originalUser, data)){
					self.user=data;
					originalUser = angular.copy(self.user);
					createArrayOfScenariosToShow();
					if(data.students)
						shuffleArray(data.students);
					if(data.colleagues)
						shuffleArray(data.colleagues);
					if(self.myCharacters)
						shuffleArray(self.myCharacters);
				}
			}, function(reason){
				console.log("errore");
			}
	    );
	}
	

    createArrayOfScenariosToShow();
	
	
	
	
	
	self.openCollCard= function(userID,index){
		self.selectedUserID = userID;
	
		for(i=0; i<6; i++){
			if(i!=index) self.showCollCard[i] = false;
			self.tab[i]=i+1;
		}
		self.showCollCard[index] = !self.showCollCard[index];
		if(self.showCollCard[index]){
			self.tab[index]=0;
		}
	}
	
	
	var reloadDashboardListener = $scope.$on('dashboard.reloadDashboard', function () {
		console.log('dashboard.reloadDashboard');
		getLoggedUser();
       
    });
	
	var reloadSpecificDashboardListener=null;
	var reloadMissionListener=null;
	
	if(loggedUser.role.authority=="ROLE_USER"){
		reloadSpecificDashboardListener = $scope.$on('dashboardStudent.reloadDashboard', function () {
			
			getLoggedUser();
	       
	    });
		reloadMissionListener = $scope.$on('dashboardStudent.reloadMission', function () {
			
			apiService.getMyMissions().then(
					function(data){
						self.myMissions = data;
					},
					function(reason){
						console.log("Error retrieve missions");
						console.log(reason);
					}
			);
	       
	    });
		
	}else if(loggedUser.role.authority=="ROLE_TEACHER"){
		reloadSpecificDashboardListener =$scope.$on('dashboardTeacher.reloadDashboard', function () {
			
			getLoggedUser();
		});

	}
	
    $scope.$on('$destroy', function() {
    	reloadDashboardListener();
    	if(reloadSpecificDashboardListener!=null)
    		reloadSpecificDashboardListener();
    	if(reloadMissionListener!=null)
    		reloadMissionListener();
	});

	
	
}]);

angular.module('smiled.application').controller('dashboardNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService','$stateParams', '$state','loggedUser',
              function dashboardNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $stateParams, $state, loggedUser){
	
	
	var self = this; 
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.isModerator = false;
	self.isJournalist = false; 
	self.newspaper = {};
	//info dell'utente loggato, servono per fare i controlli sulla visualizzazione del giornale 
	self.loggedUser = loggedUser;
	self.currentCharacter = {}; 
	self.myNews = []; 
	self.publishedNews = []; 

	
	if(self.scen.teacherCreator.id==self.loggedUser.id){
		/*self.isCreator=true;*/
		self.isModerator=true;	
	}

	if(self.scen.actualJournalist!=null && self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
		article.setIsJournalist(true); 
	} else {
		
		article.setIsJournalist(false); 
		
	} 
	

	if(self.isJournalist){
		self.myNews = apiService.getMyNewspapers(scenId).then(
				function(data)	{
					self.myNews = data; 
				}, function(reason){
					console.log("Non esistono giornali, nè pubblicati, nè in bozza"); 
				}
		)
	}

	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data;  
			},function(reason){
				$state.go('logged.scenario.editorial');
				console.log("Non c'è l'ultimo giornale.");	
			}
	)

	apiService.getpublishedNewspapers(scenId).then(
    
			function(data){
				self.publishedNews = data; 
				
			}, function(reason){
				console.log("Non ci sono giornali pubblicati.");
			}

	)
	
	console.log(self.publishedNews);

	self.idTemplate = self.newspaper.idTemplate; 
	
	
	//modal Carousel scelta impaginazione
	
    self.showPopUpTemplates = function (){
    	modalService.showChooseTemplate();  
		//modalService.showModalChooseTemplate();
	};
	
	self.goToTemplate = function (){
	$state.go('logged.scenario.template1');
	}
	
	
	/*
		if(self.idTemplate == "2"){
			$state.go('logged.scenario.template2');
			
			
		}*/
	
	
	
	
	
}]);
angular.module("smiled.application").controller('deleteResourceCtrl', [ 'file', 'modalService', 
	function deleteResourceCtrll(file, modalService){
		var self = this;
		
		self.file=file;
		
		
}]);
angular.module('smiled.application').controller('dialogChooseTemplateCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article', '$stateParams',
       
                                                                  function dialogChooseTemplateCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams){
	var self = this; 
	var scenId = $stateParams.id;
	
    self.loadTemplate = function (idTemplate){
    	//A seconda del template scelto, viene caricata la pagina corrispondente
    	
    	if(idTemplate == "1") {
    		
        	article.setBooleanRedazione();
        	article.setIdCurrentTemplate(idTemplate); 
            $state.go('logged.scenario.template1');
        	modalService.closeModalShowChooseTemplate();	
    		
    		
    	} else 
    		
    	if(idTemplate == "2") {
    		
    	article.setBooleanRedazione();
    	article.setIdCurrentTemplate(idTemplate);
        $state.go('logged.scenario.template1');
        modalService.closeModalShowChooseTemplate();		
    	} else 
    		
    		//cambiare lo state quando ci sarà anche il terzo template disponibile
    		
    	if(idTemplate == "3") {
    		article.setBooleanRedazione();
    		article.setIdCurrentTemplate(idTemplate); 
            $state.go('logged.scenario.template2');
            modalService.closeModalShowChooseTemplate();	
    	}
	};
	
	//carousel modal images
	
	$scope.myInterval = 4000;
	$scope.slides = [
	    {
	      image: 'assets/public/img/newspaper-img/template_I.png'
	    },
	    {
	      image: 'assets/public/img/newspaper-img/template_II.png'
	    },
	    
	  ];
	
	
}]);
angular.module('smiled.application').controller('dialogConfirmRegistrationCtrl', ['modalService', 'userService', 'alertingGeneric', '$scope','confirmRegistrationBool',
                 function dialogConfirmRegistrationCtrl(modalService, userService, alertingGeneric, $scope, confirmRegistrationBool){
	var self = this;
	self.reg = {};
	self.reg = modalService.getRegistrationToConfirm();
	self.confirmReg = confirmRegistrationBool;

	alertingGeneric.removeAllAlerts();
	
	self.confirm = function (){
			if(self.confirmReg){
				userService.confirmRegisterTeacher(self.reg.token, self.reg.email).then(
						function(data){
							
							modalService.closeModalConfirmRegistration();
						},
						function (reason){
							console.log("problem in confirmation register teacher");
							alertingGeneric.addDanger("Si è verificato un errore. Non è stato possibile confermare la registrazione!");			
						}
				
				);	
			}else{
				userService.deleteRegisterTeacher(self.reg.token, self.reg.email).then(
						function(data){
							
							modalService.closeModalConfirmRegistration();
						},
						function (reason){
							console.log("problem in delete register teacher");
							alertingGeneric.addDanger("Si è verificato un errore. Non è stato possibile annullare la registrazione!");	
						}
				
				);	
			}
			
		
	}
}]);
angular.module("smiled.application").controller('dialogDeleteNewspaperCtrl', ['modalService', '$state', 'scenarioId', 'newspaperNumber', 'alertingGeneric', 'article',
   function(modalService, $state, scenarioId, newspaperNumber, alertingGeneric, article){
	var self = this;
	self.deleteNewspaper = function(){
		console.log(scenarioId);
		console.log(newspaperNumber);
		var n = modalService.deleteNewspaper(scenarioId, newspaperNumber);
		article.setIsJustDeleted(true);
		
		article.setIsDraft(false); 
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
}                                                                    
]);
angular.module('smiled.application').controller('dialogHeadlineCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article','$stateParams','apiService','newspaper','$rootScope',
       
                                                                  function dialogHeadlineCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams, apiService, newspaper, $rootScope){
	var self = this;
	var scenId = $stateParams.id;
	self.numberNewspaper;  
	self.idCurrentTemplate = article.getIdCurrentTemplate(); 
	var oldName = angular.copy(newspaper.name); 
	self.newspaperPost = {}; 
	self.newspaperPut = {}; 
	self.headline = {}; 
	self.headline = newspaper.name;

	 
	//set headline - creationNewspaper or update
	
    self.setHeadline = function (){
 
    	//controllo inserimento titolo valido
    if(self.headline.length<4 || self.headline == "Inserisci un titolo per il giornale"){
			alertingGeneric.addWarning("Inserire un NUOVO titolo di almeno 4 caratteri");	
		} 
			//creazione newspaper (se superato il primo controllo) prima volta
    else {
			if(self.idCurrentTemplate == "1" && oldName == CONSTANTS.insertHeadline) {
			
				self.newspaperPost.idTemplate = 1;
				self.newspaperPost.name = self.headline; 
				//inviare proprietà font al db
				self.newspaperPost.font = self.isChecked;
				article.setNameJustCreated(self.headline); 
				
				var s = apiService.createnewspaper(self.newspaperPost, scenId);
				s.then(function(data){
					 newspaper.font = self.isChecked; 
					 self.numberNewspaper = data.number; 
					 article.setNumberJustCreated(self.numberNewspaper);
					 article.setIsDraft(true); 
					 article.setIsJustDeleted(false);
					 modalService.closeModalCreateTitle(); 
					 $state.go('logged.scenario.template1');
					 alertingGeneric.addSuccess("Hai appena creato il giornale!");
					 $rootScope.$broadcast("dialogHeadlineCtrl.createNewspaper",{newspaper:data});
				 },
				 
				 function(reason){ 
					 alertingGeneric.addWarning("Non e' stato possibile creare il giornale, riprova!");
				 });
				modalService.closeModalCreateTitle(); 		
				$state.go('logged.scenario.template1');	
				
				
			} else  {
				
					self.numberNewspaper = article.getNumberJustCreated();
				 
					if(self.numberNewspaper == undefined || self.numberNewspaper == 0) {
						//update headline second time, when it's just created
						self.newspaperPut.name = self.headline; 
						self.newspaperPut.font = self.isChecked;
							var s= apiService.updateNewspaper(scenId, newspaper.number, self.newspaperPut);
							s.then(function(data){
								 newspaper.name = self.headline;
								 newspaper.font = self.isChecked;
								 modalService.closeModalCreateTitle(); 
								 if(newspaper.status == 'DRAFT'){
									 $state.go('logged.scenario.template1');  
								 } else if (newspaper.status == 'PUBLISHED'){
									 $state.go('logged.scenario.newspublished'); 

								 }
								 	 
							 }, function(reason){
								 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
							 });
							
					} else  {
					
						self.newspaperPut.name = self.headline;
						self.newspaperPut.font = self.isChecked;
						
						var s= apiService.updateNewspaper(scenId, newspaper.number, self.newspaperPut);
						s.then(function(data){
							 newspaper.name = self.headline;
							 newspaper.font = self.isChecked; 
							 modalService.closeModalCreateTitle(); 
							 if(newspaper.status == 'DRAFT'){
								 $state.go('logged.scenario.template1'); 
			 
							 } else 
							if(newspaper.status == 'PUBLISHED'){ 
								$state.go('logged.scenario.newspublished'); 
								
							}
							 
						 }, function(reason){
							 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
						 });
					}
			}
			
			
    if(self.idCurrentTemplate == "2") {
		
		//creazione newspaper template 2
		article.setTitle(headline);
		modalService.closeModalCreateTitle(); 		
		$state.go('logged.scenario.template2');
			}			
		}
    
}
    		

	self.closeDialog = function (){
		self.headline = oldName; 
		$scope.$dismiss();
		
	}

	
	
}]);





angular.module('smiled.application').controller('dialogMissionCtrl', ['modalService', 'apiService', 'alertingGeneric', '$scope',
                 function dialogMissionCtrl(modalService, apiService, alertingGeneric, $scope){
	var self = this;
	self.mission = {};
	
	
	self.createMission = function (scenId){
		if(scenId == null){
			//compito creato dalla dashboard
			apiService.createMission(self.mission.scenId, self.mission).then(
					function(data){
//						self.mission.title="";
//						self.mission.description="";
//						self.mission.deliverydate=null;
//						self.mission.studentId="";
						
						 //alertingGeneric.addSuccess("MissionCreata");
						 modalService.closeModalCreateMission();
					},
					function(reason){
						
						console.log("error in creation of new mission");
					}
			);
		}else{
			//compito creato dallo scenario
			
		}
		
	}
}]);
angular.module('smiled.application').controller('dialogScenarioCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS',
       
                                                                  function dialogScenarioCtrl(modalService, alertingGeneric, $state, CONSTANTS){
	
	var self = this;
	self.scenario = {};
	self.scenToDelete = modalService.getScenToDelete();
	self.attendeeToDelete = modalService.getAttendeeToDelete();
	self.collaboratorToDelete = modalService.getCollaboratorToDelete();
	self.characterToDelete = modalService.getCharacterToDelete();
	self.scenario.startDate = {};
	self.scenario.endDate = {};
	self.scenario.showRelationsToAll = true;
	self.scenario.newspaperEnabled = true;
	self.scenario.startDate.afterChrist = true;
	self.scenario.endDate.afterChrist = true;
	self.startDate = {};
	self.endDate = {};
	
	self.createScenario = function (){
	
		if(self.scenario.title=="" || self.scenario.title==null || self.scenario.startDate==null || self.scenario.endDate==null){
			alertingGeneric.addWarning("Inserire tutti i dati richiesti");
		}
		else if (self.scenario.title.length<2)
			alertingGeneric.addWarning("Inserire un titolo di almeno 2 caratteri");
		else if(checkDate(self.scenario.startDate.year) == false)
			alertingGeneric.addWarning("Data di inizio errata");
		else if(checkDate(self.scenario.endDate.year) == false)
			alertingGeneric.addWarning("Data di fine errata");
		else if(checkIfEndIsAfterStart(self.scenario.startDate, self.scenario.endDate) == false)
			alertingGeneric.addWarning("La data di fine non puo' precedere la data di inizio");
		else if(!self.scenario.startDate.afterChrist && (parseInt(self.scenario.startDate.year)>4712))
			alertingGeneric.addWarning("La minima data rappresentabile e': 1 gennaio 4712 AC");
		else{
			
			var s= modalService.createScenario(self.scenario);
			s.then(function(data){
				 alertingGeneric.addSuccess("ScenarioCreato");
				 modalService.closeModalCreateScen();
				 $state.go("logged.scenarioWizard.info", {"id": data.id});
				 
			 }, function(reason){
				 
				 alertingGeneric.addWarning("Non e' stato possibile creare lo scenario, riprova!");
			 });
			
		}
		
		
	}
	self.deleteScenario = function(){
		
		if(self.scenToDelete!=null && self.scenToDelete!=""){
			modalService.deleteScenario();
			modalService.closeModalDeleteScen();
			$state.go("logged.dashboard");
			
		}
		
	}
	
	self.startDate.months = CONSTANTS.getMonths("it");
	self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	
	self.endDate.months = CONSTANTS.getMonths("it");
	self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	
	self.getStartDays = function(){
		console.log("++++++++++++++++++");
		console.log(self.scenario.startDate.month);
		self.startDate.days = CONSTANTS.getDays(self.scenario.startDate.month);
	}
	self.getEndDays = function(){
		self.endDate.days = CONSTANTS.getDays(self.scenario.endDate.month);
	}
	
	var checkIfEndIsAfterStart = function(sD, eD){
		var startDate = {};
		var endDate = {};
		startDate.year = parseInt(sD.year);
		endDate.year = parseInt(eD.year);
		startDate.month = sD.month;
		endDate.month = eD.month;
		startDate.day = sD.day;
		endDate.day = eD.day;
		startDate.afterChrist = sD.afterChrist;
		endDate.afterChrist = eD.afterChrist;
		
		
		if(startDate.afterChrist && endDate.afterChrist){  //entrambe dopo cristo
			
			if(startDate.year > endDate.year){  //startDate.year > endDate.year ERR
				
				return false;
			}else if (startDate.year < endDate.year){ //startDate.year > endDate.year GOOD
				
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
					
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
					
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
						
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
				
		}
		else if(!startDate.afterChrist && !endDate.afterChrist){  //entrambe avanti cristo
			
			if(startDate.year < endDate.year){  //startDate.year < endDate.year ERR
				
				return false;
			}else if (startDate.year > endDate.year){ //startDate.year > endDate.year GOOD
				
				return true;
			}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
				if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
			
					return false;
				}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
					
					return true;
				}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
					
					if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
						
						return false;
					}
					else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
					
						return true;
					}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
						return true;
					}
				}
			}
		}
		else if(!startDate.afterChrist && endDate.afterChrist){   //inizio a.c. e fine d.c.  SICURAMENTE BUONO
			
			return true;
		}
		else{																				//inizio d.c. e fine a.c. SICURAMENTE ERRATO
			
			return false;
		}
	}
	
	
	var checkDate = function(year){
		if(isNaN(year)){
			return false;
		}else{
			return true;
		}
    
	}
	
	
}]);
angular.module('smiled.application').controller('dialogSetDateCtrl', ['modalService','alertingGeneric', '$state', 'scen', 'start', 'CONSTANTS',
       
function dialogSetDateCtrl(modalService, alertingGeneric, $state, scen, start, CONSTANTS){
	
	var self = this;
	
	self.start = start;
	self.newDate = {};

	
	if(start==true){
		//modifico la data di inizio
		self.newDate = scen.history.startDate;
		
	}else{
		//modifico la data di fine
		self.newDate = scen.history.endDate;		
	
	}
	
	
	self.closeModal = function(){
		modalService.closeModalSetDate();
	}
	
	self.months = CONSTANTS.getMonths("it");
	self.days = CONSTANTS.getDays(self.newDate.month);
	self.getDays = function(){
		self.days = CONSTANTS.getDays(self.newDate.month);
	}
	var checkDate = function(date){
		// regular expression to match required date format
//		   var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
//
//
//	    if(date != '' && !date.match(re)) {
//	      return false;
//	    }
//	    else
	    	return true;
	    
	    
	}
	
	
}]);
angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', '$stateParams', 'alertingGeneric',
                                                              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article, $stateParams, alertingGeneric){

	var self = this; 
	var scenId = $stateParams.id;
	//settaggio id da service - verrà preso dal DB
	self.id = article.getArticleId(); 
	if(self.id == null || self.id == 0){
		$state.go('logged.scenario.template1');	
	}

	/*self.newsNumber = article.getNumberNewspaper();*/

	self.idCurrentTemplate = article.getIdCurrentTemplate();
	//TODO CHECK
	 
	self.idPublishedTemplate = article.getIdPublishedTemplate(); 
	self.isChecked = false;
	self.isCityChecked = false; 
	self.isUploaded = false;
	self.isChanged == false;
	self.isEditing; 
	self.articles = []; 
	self.article = {};
	self.article.image = null;
	self.oldIdImage;  
	self.articlePut = {}; 

	self.publishedNewspaperNumber = article.getPublishedNewspaperNumber();

	/*----------------------  GET ARTICLE ACCORDING TO ARTICLE ID AND IF PUBLISHED OR DRAFT   ---------------------*/

	var getArticlePublishedObject = function (id) {
		apiService.getpublishedNewspapers(scenId).then (
				function(data) {
					self.publishedNewspapers = data;  
					self.idTemplate = data.idTemplate;
					var found = false;
					for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
						if(self.publishedNewspapers[i].number == self.publishedNewspaperNumber) { 
							for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
								self.newspaper = self.publishedNewspapers[i]; 

								if(self.publishedNewspapers[i].articles[j].idArticleTemplate == id){
									self.article = self.publishedNewspapers[i].articles[j];

									self.article.image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
									console.log(self.article); 
									found = true;
									break; 

								}
							}

						}

					}
				}
				,function(reason){	
				}	
		);


	}

	var getArticleObject = function(id) {

		var s = apiService.getMyLastNewspaper(scenId);
		s.then(function(data){
			self.idTemplate = data.idTemplate;
			self.newspaper = data; 
			self.articles = self.newspaper.articles;  

			if(self.articles.length == 0) {
				self.article = article.getArticleObject(self.id);
				console.log(self.article);	

			} else {

				for(var i=0; i<self.articles.length; i++){
					if(self.articles[i].idArticleTemplate == id){
						self.article = self.articles[i]; 

						self.oldIdImage = angular.copy(self.article.imageId);

						if(self.oldIdImage == null) {

							self.article.image = null; 

						} else


						{
							self.article.image = CONSTANTS.urlMedia(self.article.imageId);


						}

						break; 

					} else {			
						self.article = article.getArticleObject(self.id);
					}

				}
			}

		}),

		function(reason){

			console.log("Errore.");	
		}

	}


	self.getArticleDraft = function() {
		self.isEditing = article.getIsEditing(); 
		if(self.isEditing && self.idPublishedTemplate == 1){

			if(self.id == 1){
				getArticlePublishedObject(1); 
			} else
				if (self.id == 2) {
					getArticlePublishedObject(2);	
				} else
					if (self.id == 3) {
						getArticlePublishedObject(3);
					}

		} else {

			if(self.id == 1){
				getArticleObject(1); 
			} else
				if (self.id == 2) {
					getArticleObject(2);	
				} else
					if (self.id == 3) {
						getArticleObject(3);
					}

		}	

	}

	self.getArticleDraft();  

	/*----------------------  UPLOAD ARTICLE IMAGE     ---------------------*/

	self.uploadImage=function(file){
		self.isUploaded = true; 
		Upload.upload({
			url: CONSTANTS.urlMediaScenarioPost(scenId),
			headers : {
				'Content-Type': file.type
			},
			file: file
		})
		.then(
				function (response) {
					self.uploadedFile = {};
					self.uploadedFile.id = response.data.id;
					self.uploadedFile.name = response.config.file[0].name;       
				},function(reason){
					if(reason.status=="400" || reason.status=="406"){
						alertingScenario.addWarning("Formato non supportato.");
					}else{
						alertingScenario.addWarning("C'è stato un errore, non è stato possibile caricare il file. Riprova per favore.");
					}				        
				});
	}

	self.getUploadedImage = function(){
		return CONSTANTS.urlMedia(self.uploadedFile.id);
	}
	self.removeImage =function(){
		console.log("Di qui ci passo"); 
		self.uploadedFile = undefined;
	}


	/*----------------------  UPDATE DRAFT ARTICLE    ---------------------*/

	self.setData = function(input){

		if(self.idTemplate == 1 || self.idPublishedTemplate == 1) {

			if(self.id == 1) {

				if(input.title.length<5 || input.title == "" || input.title == null){
					alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
				} else if(input.subtitle.length<5 || input.subtitle == "" ){
					alertingGeneric.addWarning("Inserire un sottitolo di almeno 5 caratteri");

				} else if (input.text1 == "" || input.text1.length<20 || input.text2 == "" || input.text2.lenght<20) {
					alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
				}	
				else {
					self.articlePut.title = input.title; 
					self.articlePut.subtitle = input.subtitle; 
					self.articlePut.text1 = input.text1; 
					self.articlePut.text2 = input.text2;
					self.articlePut.idArticleTemplate = 1; 

					if(input.city == undefined) {self.articlePut.city = ""}
					else { self.articlePut.city = input.city;   }


					if(self.isEditing){

						article.setIsEditing(false); 

						//put dell'articolo al db
						var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
						s.then(function(data){ 	

							$state.go('logged.scenario.editorial');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	

					} else {

						var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							self.newsNumber  = data.number; 
							var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
							n.then(function(data){ 		
								$state.go('logged.scenario.template1');

							}, function(reason){

								alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
								console.log("Impossibile aggiornare l'articolo.")
							})	


						},function(reason){

							console.log("Errore.");	
						}
						)




					}

				}
			} else
				if(self.id == 2) {

					if(input.title.length<5 || input.title == "" || input.title == null){
						alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
					} 

					else if (input.text1 == "" || input.text1.length<20) {
						alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
					}


					self.articlePut.title = input.title; 
					self.articlePut.text1 = input.text1; 
					if(self.isUploaded == true){
						self.articlePut.imageId = self.uploadedFile.id;
						self.isUploaded == false; 
					} else 
					{		
						self.articlePut.imageId = self.article.imageId; 


					}

					self.articlePut.idArticleTemplate = 2; 

					if(input.city == undefined) {self.articlePut.city = ""}
					else { self.articlePut.city = input.city;   }



					if(self.isEditing){

						article.setIsEditing(false); 
						console.log(self.publishedNewspaperNumber); 
						//put dell'articolo al db
						var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
						s.then(function(data){ 	

							$state.go('logged.scenario.editorial');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	

					} else {

						//put dell'articolo al db
						var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							self.newsNumber  = data.number; 
							var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
							n.then(function(data){ 		
								$state.go('logged.scenario.template1');

							}, function(reason){

								alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
								console.log("Impossibile aggiornare l'articolo.")
							})	


						},function(reason){

							console.log("Errore.");	
						}
						)

					}
				} 

			if(self.id == 3) {

				if(input.title.length<5 || input.title == "" || input.title == null){
					alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
				} else if(input.subtitle.length<5 || input.subtitle == "" ){
					alertingGeneric.addWarning("Inserire un sottitolo di almeno 5 caratteri");

				} else if (input.text1 == "" || input.text1.length<20 || input.text2 == "" || input.text2.lenght<20) {
					alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
				}	


				self.articlePut.title = input.title; 
				self.articlePut.subtitle = input.subtitle; 
				self.articlePut.text1 = input.text1; 
				self.articlePut.text2 = input.text2;
				self.articlePut.idArticleTemplate = 3; 

				if(input.city == undefined) {self.articlePut.city = ""}
				else { self.articlePut.city = input.city;   }

				if(self.isUploaded == true){
					
					self.articlePut.imageId = self.uploadedFile.id;
					self.isUploaded == false; 

				} 	else 
				{		
					self.articlePut.imageId = self.article.imageId;

				}



				if(self.isEditing){
					article.setIsEditing(false); 
					//put dell'articolo al db
					var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
					s.then(function(data){ 	

						$state.go('logged.scenario.editorial');

					}, function(reason){

						alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
						console.log("Impossibile aggiornare l'articolo.")
					})	

				} else {

					var s = apiService.getMyLastNewspaper(scenId); 
					s.then(function(data){
						self.newsNumber  = data.number; 
						var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
						n.then(function(data){ 		
							$state.go('logged.scenario.template1');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	


					},function(reason){

						console.log("Errore.");	
					}
					)
				}	


			}

		}

		if (self.idTemplate == 2) {
			article.setArticleObject(input, self.id);
			$state.go('logged.scenario.template2');


		}

		/*article.setArticleObject(input, self.id);
	            $state.go('logged.scenario.template1');*/





	}





}]);
angular.module('smiled.application').controller('draftsListCtrl', ['loggedUser', 'drafts','apiService', 'CONSTANTS',
    function draftsListCtrl(loggedUser, drafts, apiService, CONSTANTS){
	
	var self = this;
	self.user = loggedUser;
	self.myDraft = drafts;
	
	var onStartUp = function(){			
		for(var i=0;self.myDraft && i<self.myDraft.length;i++){
			if(self.myDraft[i].character){
				self.myDraft[i].character.cover = CONSTANTS.urlCharacterCover(self.myDraft[i].scenarioId, self.myDraft[i].character.id);
			}
			for(var j=0; loggedUser.openScenarios && j<loggedUser.openScenarios.length; j++){
				if(self.myDraft[i].scenarioId==loggedUser.openScenarios[j].id){
					self.myDraft[i].scenarioName = loggedUser.openScenarios[j].name; 
				}
			}
		}
		console.log("DRAFT");
	}
	
	onStartUp();
	
}]);
angular.module('smiled.application').controller('editDraftCtrl', ['loggedUser', 'drafts', '$stateParams',
    function editDraftCtrl(loggedUser, drafts, $stateParams){
	
	var self = this;
	self.user = loggedUser;
	self.drafts = drafts;
	self.postId = $stateParams.postId;

}]);
angular.module('smiled.application').controller('expandCtrl', ['apiService', function dashboardCtrl( apiService){
	
	var self = this;
	function getMe(){
		
		return apiService.getMe().then(
				
				function(data){
					self.user = data;
					var list = data.creatingScenarios;

				},
				function(reason){
					self.user ={};
					console.log("dashboardCtrl error getting user");
				}
			);
	}
	
	getMe();
	
}]);
angular.module('smiled.application').controller('filesListCtrl', ['loggedUser', function filesListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
angular.module('smiled.application').controller('forgotCtrl', ['userService','alertingGeneric', 
  function forgotCtrl(userService, alertingGeneric){
	
	var self = this;
	self.userEmail="";
	
	self.sendNewPassRequest = function(){
		
		if(!self.userEmail || !validateEmail()){
			alertingGeneric.addWarning("Inserire un indirizzo mail valido");
		}else{
			var e = {};
			e.email = self.userEmail;
			userService.forgotPasswordRequest(e).then(
					function(data){
						
						alertingGeneric.addSuccess("Richiesta inviata con successo.");
					},
					function(reason){
						
						alertingGeneric.addDanger("Si è verificato un errore");
					}
			);
		}
	}
	
	var validateEmail = function () {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(self.userEmail);
	}

	
}]);
angular.module('smiled.application').controller('indexCtrl', [ 'userService', 'apiService', 
                                                              function indexCtrl(userService,apiService){
	userService.registerObserverLoginCallback(isLoggedUpdate);
	userService.registerObserverImageProfileCallback(updateImageProfile);
	
	var baseImageProfile = "api/v1/me/cover";
	
	var self = this;
	
	function isLoggedUpdate(){
		self.isLogged = userService.isLogged();
		if(self.isLogged){
			apiService.getMe().then(
					function(data){
						self.user=data;
					
						var imageProfileUrl = baseImageProfile;
						var random = new Date();
						self.cover = imageProfileUrl+"?"+random.toString();
					},
					function(reason){
						console.log("errore");
					}
			);
		}
	}
	
	function logout(){
		userService.logout();
	}
	
	function updateImageProfile(){
		var random = new Date();
		
		self.cover = baseImageProfile+"?"+random.toString();
	}
	
	self.logout = logout;
	
	isLoggedUpdate();
	

}]);
angular.module('smiled.application').controller('issuesCtrl', ['CONSTANTS', 'apiService', '$state', '$timeout',
              function issuesCtrl(CONSTANTS, apiService, $state, $timeout){
	
	var self = this;
	self.sended=false;
	self.suggestionSended=false;
	self.error=false;
	
	self.postSuggestion = function(){
		var suggestion = {};
		suggestion.newFeature = self.newFeature;
		suggestion.modifyFeature = self.modifyFeature;
		suggestion.deleteFeature = self.deleteFeature;
		
		apiService.postSuggestion(suggestion).then(
			function(data){
				self.error=false;
				self.newFeature="";
				self.modifyFeature="";
				self.deleteFeature="";
				self.suggestionSended=true;
				$timeout( function(){
					$state.go("logged.dashboard");
				}, 7000);
			},
			function(reason){
				self.error=true;
				console.log("Errore nell'invio della segnalazione"+reason);
			}
		);
	}
	
	
	self.postIssue = function(){
		var problema = {};
		problema.preOperation = self.preOperation;
		problema.issue = self.issue;
		problema.expect = self.expect;
		apiService.postIssue(problema).then(
			function(data){
				self.error=false;
				self.preOperation="";
				self.issue="";
				self.expect="";
				self.sended=true;
				$timeout( function(){
					$state.go("logged.dashboard");
				}, 7000);
			},
			function(reason){
				self.error=true;
				console.log("Errore nell'invio della segnalazione"+reason);
			}
		);
	}

}])
angular.module('smiled.application').controller('loggedCtrl', ['loggedUser', '$state',
         function loggedCtrl(loggedUser,$state){
	
		
		
		if(loggedUser.role.authority=="ROLE_ADMIN"){
			$state.go('logged.dashboard.admin.users');
		}
		else if(loggedUser.role.authority=="ROLE_TEACHER"){
			$state.go('logged.dashboard.teacher');
		}
		else if(loggedUser.role.authority=="ROLE_USER"){
			$state.go('logged.dashboard.student');
		}
		
}]);



angular.module('smiled.application').controller('loginCtrl', ['userService', 'apiService','alertingLogin', '$state',
                                                              function loginCtrl(userService, apiService, alertingLogin, $state){
	
	var self = this;
	self.user = {
		
	};
	
	
	self.register = {};
	/*Opzioni per datepicker*/
	self.dateOptions = {
			dateFormat: 'dd/mm/yy'
			//autosize: true
	};
	
		
	self.login = function(){
		
		if(self.user.email==null || self.user.email==""){
			alertingLogin.addWarning("Inserire email");
			self.user.password ="";
		
		}
		else if(self.user.password==null || self.user.password==""){
			alertingLogin.addWarning("Inserire password");
			
		}
		else if(!validateEmail(self.user.email)){
			alertingLogin.addWarning("Email non valida!");
			self.user.password ="";
		}
		else if(self.user.password.length<8){
			alertingLogin.addWarning("Password troppo corta!");
			self.user.password ="";
		}
		else{
			userService.login(self.user.email, self.user.password).then(
					function(data){
						$state.go('logged.dashboard');
					},
					function(reason){
						self.user.password ="";
						self.user.email ="";
						alertingLogin.addDanger("Attenzione credenziali errate!");
						
					});
			
			
		}
	}
	var validateEmail = function (email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(email);
	}



	
}]);
angular.module('smiled.application').controller('mainCtrl', ['$state', '$rootScope',
         function loggedCtrl($state, $rootScope){
	
	 $rootScope.$on('unauthorized', function() {
        $state.go('notLogged.login');
	 });
	 
}]);
angular.module('smiled.application').controller('moreInfoCtrl',['$window',
  function moreInfoCtrl($window){
	
	var self = this;
	self.content=null;
	
	
//	var getPdf = function(){
//		$http.get('/assets/public/pdf/meschola_guida.ppt', {responseType:'arraybuffer'})
//			.success(function (response) {
//	       var file = new Blob([response], {type: 'application/pdf'});
//	       var fileURL = URL.createObjectURL(file);
//	       self.content = $sce.trustAsResourceUrl(fileURL);
//		});
//	}
	
	self.downloadPdf = function(){
		
		$window.location = "assets/public/pdf/meschola_guida.pdf";	
	}
	
	//CAROUSEL
	var scen1 = {img:"assets/public/img/green.jpg"};
	var scen2 = {img:"assets/public/img/landing page/Personalizzabile.png"};
	var scen3 = {img:"assets/public/img/landing page/Sicura.png"};
	var scen4 = {img:"assets/public/img/landing page/Collaborativa.png"};
	var scen5 = {img:"assets/public/img/cover_default.jpg"};
	var scen6 = {img:"assets/public/img/calderone1.png"};
	var scen7 = {img:"assets/public/img/icon/pg.png"};
	var scen8 = {img:"assets/public/img/wizard/wiz_att.png"};
	var scen9 = {img:"assets/public/img/wizard/wiz_char.png"};
	var scen10 = {img:"assets/public/img/wizard/wiz_coll.png"};
	var scen11 = {img:"assets/public/img/ic_creatingscenario.png"};
	var scen12 = {img:"assets/public/img/ic_openscenario.png"};
	var scen13 = {img:"assets/public/img/wizard/wiz_info.png"};
	var scen14 = {img:"assets/public/img/wizard/wiz_rel.png"};
	var scen15 = {img:"assets/public/img/landing page/ic_teacher.png"};
	var scenarios = [scen1, scen2, scen3, scen4, scen5, scen6, scen7, scen8, scen9, scen10, scen11, scen12, scen13];
	
	var scenarioIndex = 0;
	
	// LARGE AND MEDIUM DISPLAY
	self.hideArrowsL = false;
	self.scenariosToShowL = scenarios.slice(0,5);		
	if (scenarios.length <= 5){
		self.hideArrowsL = true;
	}	
	self.shiftScenariosAfterL = function(){
		scenarioIndex = scenarioIndex+5;		
		if (scenarioIndex>11 || scenarioIndex>=scenarios.length){
			//se sono arrivato alla fine degli scenari li rivedo da capo
			scenarioIndex = 0;
		}if (scenarios.length-scenarioIndex<=5){
			//se ho meno di 15 scenari quelli aggiuntivi li vedo in coda 
			scenarioIndex = scenarios.length-5;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);
	}
	
	self.shiftScenariosBeforeL = function(){
		if(scenarioIndex == 0){
			scenarioIndex = scenarios.length - 5;
		}else{
			scenarioIndex = scenarioIndex-5;
		}if(scenarioIndex<0){
			scenarioIndex = 0;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);

	}
	
	//SMALL DISPLAY
	self.hideArrowsM = false;
	self.scenariosToShowM = scenarios.slice(0,3);
	if(scenarios.length <= 3){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterM = function(){
		scenarioIndex = scenarioIndex+3;
		if (scenarioIndex>12 || scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}if(scenarios.length-scenarioIndex<=3){
			scenarioIndex = scenarios.length - 3;
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	self.shiftScenariosBeforeM = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-3;
		}else{
			scenarioIndex = scenarioIndex-3;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	
	//EXTRA SMALL DISPLAY
	self.hideArrowsS = false;
	self.scenariosToShowS = scenarios.slice(0,1);
	if(scenarios.length <= 1){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterS = function(){
		scenarioIndex = scenarioIndex+1;
		if(scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	self.shiftScenariosBeforeS = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-1;
		}else{ scenarioIndex = scenarioIndex-1;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	
	
}]);
angular.module('smiled.application').controller('navbarCtrl', [ 'userService', '$state', 'CONSTANTS', '$scope','webSocketService', 'notifyService', '$timeout','$window', '$rootScope',
                                                              function navbarCtrl(userService,$state, CONSTANTS, $scope, webSocketService, notifyService, $timeout, $window, $rootScope){
	
 /*  WebSocketService viene iniettato affiché lo stessa venga istanziato e quindi inizializzato per aprire la connessione websocket.
  */	
	var self = this;
	self.newNotifications = [];
	self.oldNotifications = [];
	self.numNewNotifications=0;
	self.user = {};
	self.basicCover = {};
	
	self.dateFormat = CONSTANTS.realDateFormatWithSecond;
	self.iHaveDone = false;
	self.openNotifications = false;
	
	userService.getMe().then(		
		function(data){
			self.user=data;
			
			if(self.user.role.authority=="ROLE_TEACHER" || self.user.role.authority=="ROLE_ADMIN"){
				self.basicCover=CONSTANTS.basicTeacherCover;
			}
			else if(self.user.role.authority=="ROLE_USER"){
				self.basicCover=CONSTANTS.basicStudentCover;				
			}
			
		},
		function(reason){
			console.log("errore");
		}
	);
	
	var updateCover = function(){
		var date = new Date();
		self.cover = CONSTANTS.urlMeCover+"?"+date.toString();
	}
	
	var monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
	                  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
	
	var getNewNotification = function(n){
		
		n.read=false;
		self.newNotifications.splice(0,0,n);	
		self.numNewNotifications=self.newNotifications.length;

		formatVerb(self.newNotifications);
		
		
	}
	
	var formatVerb = function(notifications){
		if(notifications!=null && notifications.length>0){
			var scenarioId = userService.getScenarioId();
			var reloadAssociation = false;
			
				for(var i=0; i<notifications.length; i++){
					if(notifications[i].verb == "COMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha commentato un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha commentato un post che segui nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "LIKE_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = "A "+notifications[i].actorName +" piace un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = "A "+notifications[i].actorName +" piace un post in cui sei taggato nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "TAG_ON_CREATE"){
						notifications[i].text = notifications[i].actorName +" ti ha taggato in un post nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "TAG_ON_MOD"){
						if(notifications[i].tagged){
							var stringTags="";
							for(var j=0;j<notifications[i].tagged.length; j++){
								if(j<notifications[i].tagged.length-2){
									stringTags+=notifications[i].tagged[j].firstname + ", ";
								}else{
									if(j<notifications[i].tagged.length-1)
										stringTags+=notifications[i].tagged[j].firstname +" e ";
									else
										stringTags+=notifications[i].tagged[j].firstname;
								}
								
							}
								notifications[i].text = notifications[i].actorName +" ha taggato "+ stringTags+" in un post nello scenario "+notifications[i].scenarioName;
						}
						
					}
					else if(notifications[i].verb == "METACOMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un post che segui nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Ti e' stato assegnato il personaggio "+ notifications[i].actorName+" nello scenario "+notifications[i].scenarioName;
							if(scenarioId == notifications[i].scenarioId)
								reloadAssociation=true;
						}else
							notifications[i].text = "Il personaggio "+ notifications[i].actorName+" e' stato assegnato a "+notifications[i].objectContent+ " nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "DEL_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Non stai piu' interpretando il personaggio "+ notifications[i].actorName+" nello scenario "+notifications[i].scenarioName;
							if(scenarioId == notifications[i].scenarioId)
								reloadAssociation=true;					
						}else
							notifications[i].text = notifications[i].objectContent+" non sta piu' interpretando il personaggio "+ notifications[i].actorName+ "nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "OPEN_SCENARIO"){
						notifications[i].text = "Entra nel nuovo scenario "+ notifications[i].scenarioName +" creato da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "CLOSE_SCENARIO"){
						notifications[i].text = "Lo scenario "+ notifications[i].scenarioName +" e' stato chiuso da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "MODIFIED"){
						if(self.user.id!=notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_PERSONAL_MISSION"){
						notifications[i].text = notifications[i].actorName +", ti e' stata assegnata una nuova missione nello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_GLOBAL_MISSION"){
						notifications[i].text = notifications[i].actorName +" ha assegnato una nuova missione ai partecipanti dello scenario "+notifications[i].scenarioName;
					}
					else if(notifications[i].verb == "NEW_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha aggiunto come collaboratore nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_FILE"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto il file "+notifications[i].objectContent+" nella sezione materiali dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha iscritto allo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DELETED_POST_BY_MOD"){
						notifications[i].text = notifications[i].actorName +" ha cancellato un tuo post nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "MODIFIED_POST_BY_MOD"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un tuo post nello scenario "+notifications[i].scenarioName;
						else
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui nello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_MOD_TO_CREATOR"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto "+notifications[i].objectContent+" come collaboratore dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEWSPAPER_ON"){
						notifications[i].text = notifications[i].actorName +" ha abilitato il giornale  dallo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEWSPAPER_OFF"){
						notifications[i].text = notifications[i].actorName +" ha disabilitato il giornale  dallo scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_NEWSPAPER"){
						notifications[i].text = notifications[i].actorName +" ha pubblicato "+notifications[i].objectContent+" dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_NEWSPAPER"){
						notifications[i].text = notifications[i].actorName +" ha rimosso "+notifications[i].objectContent+" dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "UPD_NEWSPAPER"){
						notifications[i].text = notifications[i].actorName +" ha modificato il giornale ("+notifications[i].objectContent+") dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "NEW_JOURNALIST"){
						notifications[i].text = notifications[i].actorName +" ti ha nominato giornalista dello scenario "+notifications[i].scenarioName;
					}else if(notifications[i].verb == "DEL_JOURNALIST"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dal ruolo di giornalista dello scenario "+notifications[i].scenarioName;
					}
					
					else{
						notifications[i].text="Nuova notifica!";
					}
					//new, del, upd nome+numero in objectContent
					
					//UPD_NEWSPAPER
					//NEW_JOURNALIST
					//DEL_JOURNALIST
					
					//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				}
		}
		if(reloadAssociation){
			notifyService.reloadAssociation();
		}
		
		
	}
	
	var formatDate = function(notifications){
		
		if(notifications!=null && notifications.length>0){
			var actual = new Date();
			for(var i=0; i<notifications.length; i++){
	
				var timeString="";
				var diff = actual-notifications[i].date;
				diff = Math.round(diff/1000);
				if(diff<=1)
					timeString="un secondo fa";
				else if(diff<60)
					timeString = diff+" secondi fa";
				else if(diff>=60){
					diff = Math.round(diff/60);
					if(diff<=1)
						timeString = "un minuto fa";
					else if(diff<60)
						timeString = diff+" minuti fa";
					else if(diff>=60){
						var dd = new Date(notifications[i].date);
						diff= Math.round(diff/60);
						if(diff<=1)
							timeString = "circa un'ora fa";
						else if(diff<24)
							timeString =diff+" ore fa";
						else if(diff<48)
							timeString = "Ieri alle "+dd.getHours()+" "+dd.getMinutes();
						else if(diff>=48) 
							timeString = dd.getDate()+" "+ monthNames[dd.getMonth()] + " alle ore "+dd.getHours()+":"+dd.getMinutes();
					}
				}
				
				notifications[i].formatDate = timeString;
	
			}
			
		}
	}
	
	var closeDropDown = function(){
		if(self.newNotifications && self.newNotifications.length>0){
			for(var i=self.newNotifications.length-1; i>=0; i--){
				self.oldNotifications.splice(0,0,angular.copy(self.newNotifications[i]));
			}
			self.newNotifications = [];

		}
		self.numNewNotifications=0;
		self.openNotifications=false;
	}
	
	self.onBlurDropDown = function(){
		closeDropDown();
	}
	
	var openDropDown = function(){
		
		if(self.newNotifications.length>0){
			formatDate(self.newNotifications);
			var ack={};
			ack.ids = [];
			ack.type="ACK_N";
			for(var i=self.newNotifications.length-1; i>=0; i--){
				ack.ids.push(angular.copy(self.newNotifications[i].id));
			}
			if(ack && ack.ids)
				webSocketService.send(ack);
		}
		if(self.oldNotifications.length>0)		
			formatDate(self.oldNotifications);
		
	
		
		self.openNotifications=true;	
		if(self.newNotifications.length+self.oldNotifications.length<10){
			var older="";
			var num=10;
			if(self.oldNotifications.length>0)
				older=self.oldNotifications[self.oldNotifications.length-1].id;
			else if(self.newNotifications.length>0)
				older=self.newNotifications[self.newNotifications.length-1].id;
			if(older){
				num=10-self.newNotifications.length+self.oldNotifications.length;
			}
			if(num>0)
				notifyService.readOldNotifications(older, num).then(
						function(data){
							formatDate(data);
							formatVerb(data);
							for(var i=0; data && i<data.length; i++){
								if(data[i].sender != self.user.id){
									data[i].read=false;
									self.oldNotifications.push(data[i]);
								}
							}
						},
						function(reason){
							console.log("Error retriving old notification (REST)");
							
						}
				);
		}
	}
	
	self.clickOnNotificationsButton = function(){
		//se openNotifications==true significa che sto chiudendo il dropDown delle notifiche
		//se openNotifications==false significa che sto aprendo il dropDown delle notifiche
		
		if (self.openNotifications){ //era aperto quindi sto chiudendo
			closeDropDown();
			var element = $window.document.getElementById("notificationButton");
			if(element)
				element.blur();
		}else{ //era chiuso quindi sto aprendo
			openDropDown();		
		}
	}
	
	
	self.getNotificationCover = function(){
		return null;
	}
	
	
	
	self.clickOnNotify = function(n){
		
		
		if(!n.viewed){
			n.viewed=true;
			var view={};
			view.ids = [];
			view.ids.push(n.id);
			view.type="VIEW_N";
			$timeout(webSocketService.send(view),1000);
		}
		
		if(n.verb=="MODIFIED" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="LIKE_TO_POST" || n.verb=="TAG_ON_CREATE" || n.verb=="TAG_ON_MOD"){
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": n.objectId});
		}else if(n.verb=="COMMENT_TO_POST" || n.verb=="METACOMMENT_TO_POST"){
			var idPost = n.objectId.substring(0, n.objectId.indexOf("/"));
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": idPost});
		}else if(n.verb=="NEW_PERSONAL_MISSION"){
			if($state.current.name=='logged.scenario.missions'){
				$rootScope.$broadcast('notification.updateCharacterMission',{idS:n.scenarioId, idC:n.actorId});
				
			}else{
				$state.go('logged.scenario.missions', {"id":n.scenarioId });
			}
ß		}else if(n.verb=="NEW_GLOBAL_MISSION"){
			if($state.current.name=='logged.scenario.missions'){
				$rootScope.$broadcast('notification.updateGlobalMission',{idS:n.scenarioId});
			}else{
				$state.go('logged.scenario.missions', {"id":n.scenarioId });
			}
		}
		else if(n.verb=="DEL_ASSOCIATION" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE"){
			$state.go('logged.scenario.characters', {"id":n.scenarioId });
		}else if(n.verb=="NEW_ASSOCIATION"){
			$state.go('logged.scenario.charprofile', {"id":n.scenarioId, "idCharacter": n.actorId});
		}else if(n.verb =="NEW_MOD_TOCREATOR" || n.verb=="NEW_MOD"){
			$state.go('logged.scenarioWizard.info', {"id":n.scenarioId });
		}
		else if(n.verb=="NEW_FILE"){
			$state.go('logged.scenario.resources', {"id":n.scenarioId });
		}else if(n.verb=="DEL_MOD" || n.verb=="DEL_ATTENDEE"){
			$state.go('logged.dashboard');
		}else if(n.verb=="NEW_NEWSPAPER" || n.verb=="DEL_NEWSPAPER" || n.verb=="NEWSPAPER_ON" || n.verb=="NEWSPAPER_OFF" || n.verb=="NEW_JOURNALIST" || n.verb=="DEL_JOURNALIST"){
			$state.go('logged.scenario.editorial', {"id":n.scenarioId });
		}
		
	}
	
	self.getSrcPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return CONSTANTS.urlScenarioCover(n.scenarioId);
			}else if(n.verb=="METACOMMENT_TO_POST" || n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="DEL_MOD" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				return CONSTANTS.urlUserCover(n.actorId);
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}else{
					return "assets/public/img/narr.png";
				}
			}else if(n.verb=="NEW_NEWSPAPER" || n.verb=="DEL_NEWSPAPER" || n.verb=="NEWSPAPER_ON" || n.verb=="NEWSPAPER_OFF" || n.verb=="NEW_JOURNALIST" || n.verb=="DEL_JOURNALIST"){
				return "assets/public/img/wizard/wiz_newspaper.png";
			}else{
				if(n.verb=="TAG_ON_CREATE" ||n.verb=="TAG_ON_MOD" ){
					if(n.actorId){
						return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
					}else{
						return "assets/public/img/narr.png";
					}
				}else{
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}
				
				
			}
		}else if(n.type=="USER_MESSAGE"){
			console.log("message!!!!!!!!!!!!");
		}
		
		return "assets/public/img/icon/pg.png";
	}
	
	self.getErrPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return "assets/public/img/icon/ic_scen.png";
			}
			else if(n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="MODIFIED_POST_BY_MOD"|| n.verb=="DEL_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				
				return "assets/public/img/ic_teacher.png";
			}else if(n.verb=="METACOMMENT_TO_POST"){
				if(isTeacher(n.actorId))
					return "assets/public/img/ic_teacher.png";
				else
					return "assets/public/img/ic_student.png";
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return "assets/public/img/icon/pg.png";
				}else{
					return "assets/public/img/narr.png";
				}
			}else{
				return "assets/public/img/icon/pg.png";
			}
		}else if(n.type=="USER_MESSAGE"){
			return "assets/public/img/ic_student.png";
		}
	}
	

	var isTeacher = function(id){
		
		if(self.user.role.authority=="ROLE_TEACHER"  ){
			if( self.user.colleagues){
				
				for(var i=0; i< self.user.colleagues.length; i++){
					if(self.user.colleagues[i].id == id)
						return true;
				}
			}
			
		}
		
		else if(self.user.role.authority=="ROLE_USER"  ){
			if(self.user.teachers){
				for(var i=0; i< self.user.teachers.length; i++){
					if(self.user.teachers[i].id == id)
						return true;
				}
			}
			
		}
		return false;
	}

	
	
	
	
		
	function logout(){
		userService.logout().then(
				function(data){
					self.cover="";
					$state.go('notLogged.login');
				},
				function(reason){
					console.log('Errore logout');
				}
		);
	}
	
//	function updateImageProfile(){
//		var random = new Date();
//		console.log(baseImageProfile+"?"+random.toString());
//		self.cover = baseImageProfile+"?"+random.toString();
//	}
//	
	self.logout = logout;
	
	//isLoggedUpdate();
	
	updateCover();
	userService.registerObserverPersonalCover(updateCover);
	
	
	//metodo usato dall'esterno per settare a viewed la notifica con l'id specificato
	var setViewedNotifify = function(id){
		if(self.newNotifications)
			for(var i =0; i< self.newNotifications.length; i++){
				if(self.newNotifications[i].id == id){
					self.newNotifications[i].viewed = true;
					return;
				}
			}
		if(self.oldNotifications)
			for(var i =0; i< self.oldNotifications.length; i++){
				if(self.oldNotifications[i].id == id){
					self.oldNotifications[i].viewed = true;
	
				}
			}
	}
	
	var newNotificationListener = $scope.$on('notification.newNotificationEvent', function (event, data) {
		
        getNewNotification(data.notification);
        $scope.$applyAsync();
       
    })
    
    var setViewedListener = $scope.$on('notification.setViewedEvent', function (event, data) {
		
    	setViewedNotifify(data.id);
     
       
    })
  
	
	$scope.$on("$destroy", function() {
		newNotificationListener();
		setViewedListener();
        notifyService.resetObserverAssociation();
    });

}]);
angular.module('smiled.application').controller('notificationCtrl', ['$rootScope', '$state', 'userService', 'apiService','CONSTANTS', '$timeout','webSocketService',
              function characterProfileCtrl($rootScope, $state, userService, apiService, CONSTANTS, $timeout, webSocketService){
	
	var self = this;
	self.notifications = [];
	self.dateFormat = CONSTANTS.realDateFormatWithMinute;
	self.user = {};
	self.user.id="";
	self.basicCover = {};
	self.busy=false;
	var stopScroll=false;
	
	self.user = userService.getLastMe();
	
	var getMoreRecentNotifications = function(){
		apiService.getLastUserNotifications("", 10).then(		
				function(data){
					if(data.length==0){
						stopScroll=true;
					}else{
						formatVerb(data);
						self.notifications=data;
					}
					self.busy=false;
				},
				function(reason){
					console.log("problem in getLastUserNotifications");
				
					self.busy=false;
				}
			);
	}
	
	
	var downloadMoreNotifications = function(){
		apiService.getLastUserNotifications(self.notifications[self.notifications.length-1].id, 10).then(		
				function(data){
					if(data.length==0){
						stopScroll=true;
					}else{
						formatVerb(data);
						self.notifications = self.notifications.concat(data);
					}
					self.busy=false;
				},
				function(reason){
					console.log(reason);
					self.busy=false;
				}
			);
	}
	
	self.nextNotification = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
		if(self.notifications.length==0){
			getMoreRecentNotifications();
		}else{
			downloadMoreNotifications();
		}
	}
	
	var onStartup = function(){
		
		getMoreRecentNotifications();

	}
	
	onStartup();
	
	/* Utility -------------------- */
	
	self.clickOnNotify = function(n){
		
		$rootScope.$broadcast("notification.setViewedEvent", {id:n.id});
		n.viewed=true;
		var view={};
		view.ids = [];
		view.ids.push(n.id);
		view.type="VIEW_N";
		$timeout(webSocketService.send(view),1000);
		if(n.verb=="MODIFIED" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="LIKE_TO_POST" || n.verb=="TAG_ON_CREATE" || n.verb=="TAG_ON_MOD"){
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": n.objectId});
		}else if(n.verb=="COMMENT_TO_POST" || n.verb=="METACOMMENT_TO_POST"){
			var idPost = n.objectId.substring(0, n.objectId.indexOf("/"));
			$state.go('logged.scenario.post', {"id":n.scenarioId , "idPost": idPost});
		}else if(n.verb=="NEW_PERSONAL_MISSION" || n.verb=="NEW_GLOBAL_MISSION"){
			$state.go('logged.scenario.missions', {"id":n.scenarioId });
		}else if(n.verb=="DEL_ASSOCIATION" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb =="NEW_MOD_TOCREATOR" || n.verb=="NEW_MOD"){
			$state.go('logged.scenario.characters', {"id":n.scenarioId });
		}else if(n.verb=="NEW_ASSOCIATION"){
			$state.go('logged.scenario.charprofile', {"id":n.scenarioId, "idCharacter": n.actorId});
		}else if(n.verb=="NEW_FILE"){
			$state.go('logged.scenario.resources', {"id":n.scenarioId });
		}else if(n.verb=="DEL_MOD" || n.verb=="DEL_ATTENDEE"){
			$state.go('logged.dashboard');
		}
		
	}
	
	self.getSrcPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return CONSTANTS.urlScenarioCover(n.scenarioId);
			}else if(n.verb=="METACOMMENT_TO_POST" || n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="DEL_MOD" || n.verb=="MODIFIED_POST_BY_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				return CONSTANTS.urlUserCover(n.actorId);
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}else{
					return "assets/public/img/narr.png";
				}
			}
			else{
				if(n.verb=="TAG_ON_CREATE" ||n.verb=="TAG_ON_MOD" ){
					if(n.actorId){
						return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
					}else{
						return "assets/public/img/narr.png";
					}
				}else{
					return CONSTANTS.urlCharacterCover(n.scenarioId, n.actorId );
				}
				
				
			}
		}else if(n.type=="USER_MESSAGE"){
			console.log("message!!!!!!!!!!!!");
		}
		
		return "assets/public/img/icon/pg.png";
	}
	
	self.getErrPhoto = function(n){
		if(n.type=="NOTIFICATION"){
			if(n.verb=="NEW_GLOBAL_MISSION" || n.verb=="CLOSE_SCENARIO" || n.verb=="OPEN_SCENARIO" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){
				return "assets/public/img/icon/ic_scen.png";
			}
			else if(n.verb=="NEW_MOD" || n.verb=="NEW_MOD_TO_CREATOR" || n.verb=="MODIFIED_POST_BY_MOD"|| n.verb=="DEL_MOD" || n.verb=="DELETED_POST_BY_MOD" || n.verb=="NEW_FILE"){
				
				return "assets/public/img/ic_teacher.png";
			}else if(n.verb=="METACOMMENT_TO_POST"){
				if(isTeacher(n.actorId))
					return "assets/public/img/ic_teacher.png";
				else
					return "assets/public/img/ic_student.png";
			}else if(n.verb=="MODIFIED"){
				if(n.actorId){
					return "assets/public/img/icon/pg.png";
				}else{
					return "assets/public/img/narr.png";
				}
			}else{
				return "assets/public/img/icon/pg.png";
			}
		}else if(n.type=="USER_MESSAGE"){
			return "assets/public/img/ic_student.png";
		}
	}
	
	var formatVerb = function(notifications){
		
		if(notifications!=null && notifications.length>0){
			
			
				for(var i=0; i<notifications.length; i++){
					if(notifications[i].verb == "COMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha commentato un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha commentato un post che segui";
					}
					else if(notifications[i].verb == "LIKE_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = "A "+notifications[i].actorName +" piace un tuo post";
						else
							notifications[i].text = "A "+notifications[i].actorName +" piace un post in cui sei taggato";
					}
					else if(notifications[i].verb == "TAG_ON_CREATE"){
						notifications[i].text = notifications[i].actorName +" ti ha taggato in un post";
					}
					else if(notifications[i].verb == "TAG_ON_MOD"){
						if(notifications[i].tagged){
							var stringTags="";
							for(var j=0;j<notifications[i].tagged.length; j++){
								if(j<notifications[i].tagged.length-2){
									stringTags+=notifications[i].tagged[j].firstname + ", ";
								}else{
									if(j<notifications[i].tagged.length-1)
										stringTags+=notifications[i].tagged[j].firstname +" e ";
									else
										stringTags+=notifications[i].tagged[j].firstname;
								}
								
							}
								notifications[i].text = notifications[i].actorName +" ha taggato "+ stringTags+" in un post";
						}
						
					}
					else if(notifications[i].verb == "METACOMMENT_TO_POST"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha inserito un suggerimento ad un post che segui";
					}
					else if(notifications[i].verb == "NEW_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Ti e' stato assegnato il personaggio "+ notifications[i].actorName;
							
						}else
							notifications[i].text = "Il personaggio "+ notifications[i].actorName+" e' stato assegnato a "+notifications[i].objectContent;
					}
					else if(notifications[i].verb == "DEL_ASSOCIATION"){
						if(self.user.id==notifications[i].objectId){
							notifications[i].text = "Non stai piu' interpretando il personaggio "+ notifications[i].actorName;
										
						}else
							notifications[i].text = notifications[i].objectContent+" non sta piu' interpretando il personaggio "+ notifications[i].actorName;
					}
					else if(notifications[i].verb == "OPEN_SCENARIO"){
						notifications[i].text = "Entra nel nuovo scenario "+ notifications[i].scenarioName +" creato da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "CLOSE_SCENARIO"){
						notifications[i].text = "Lo scenario "+ notifications[i].scenarioName +" e' stato chiuso da "+notifications[i].actorName;
					}
					else if(notifications[i].verb == "MODIFIED"){
						if(self.user.id!=notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui";
					}else if(notifications[i].verb == "NEW_PERSONAL_MISSION"){
						notifications[i].text = notifications[i].actorName +", ti e' stata assegnata una nuova missione";
					}
					else if(notifications[i].verb == "NEW_GLOBAL_MISSION"){
						notifications[i].text = notifications[i].actorName +" ha assegnato una nuova missione ai partecipanti dello scenario";
					}
					else if(notifications[i].verb == "NEW_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha aggiunto come collaboratore";
					}else if(notifications[i].verb == "NEW_FILE"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto il file "+notifications[i].objectContent+" nella sezione materiali";
					}else if(notifications[i].verb == "NEW_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha iscritto allo scenario";
					}else if(notifications[i].verb == "DEL_ATTENDEE"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario";
					}else if(notifications[i].verb == "DELETED_POST_BY_MOD"){
						notifications[i].text = notifications[i].actorName +" ha cancellato un tuo post";
					}else if(notifications[i].verb == "MODIFIED_POST_BY_MOD"){
						if(self.user.id==notifications[i].mainReceiver)
							notifications[i].text = notifications[i].actorName +" ha modificato un tuo post";
						else
							notifications[i].text = notifications[i].actorName +" ha modificato un post che segui";
					}else if(notifications[i].verb == "NEW_MOD_TO_CREATOR"){
						notifications[i].text = notifications[i].actorName +" ha aggiunto "+notifications[i].objectContent+" come collaboratore";
					}else if(notifications[i].verb == "DEL_MOD"){
						notifications[i].text = notifications[i].actorName +" ti ha rimosso dallo scenario ";
					}else{
						notifications[i].text="Nuova notifica!";
					}
					//TODO	 aggiungere tutti gli altri possibili tipi di notifiche
				}
		}
				
	}
	
	var isTeacher = function(id){
		
		if(self.user.role.authority=="ROLE_TEACHER"  ){
			if( self.user.colleagues){
				
				for(var i=0; i< self.user.colleagues.length; i++){
					if(self.user.colleagues[i].id == id)
						return true;
				}
			}
			
		}
		
		else if(self.user.role.authority=="ROLE_USER"  ){
			if(self.user.teachers){
				for(var i=0; i< self.user.teachers.length; i++){
					if(self.user.teachers[i].id == id)
						return true;
				}
			}
			
		}
		return false;
	}

}]);
angular.module("smiled.application").controller('oldCharacterChangeOnCommentCtrl', [ 'charName', 'modalService', '$window', 
	function oldCharacterChangeOnCommentCtrl(charName, modalService,$window){
		var self = this;
		
		self.charName=charName;
		self.ok = function(){
			modalService.closeModalOldCharacterChangeOnComment();
			$window.location.reload();
		}
		
}]);
angular.module("smiled.application").controller('openMapCtrl', [ 'post', 'scenarioMap', 'modalService', 
	function openMapCtrl(post, scenarioMap, modalService){
		var self = this;
		self.post = post;
		var oldPlace = angular.copy(post.place);
		if(scenarioMap)
			self.map = scenarioMap.url;
		else
			self.map=null;
	
		self.stylePin = {'visibility' : 'hidden'};
		self.pinPoint = function(event){
			
			var pin = {};
			pin.x = event.offsetX/event.target.width;
			pin.y = event.offsetY/event.target.height;
			post.place = pin;

			var x = event.offsetX-20;
			var y = event.offsetY-40;
			self.stylePin = {'visibility' : 'visible', 'top': y+'px', 'left': x+'px'};
			
		}
		
		self.removePoint = function(){
			console.log("removePoint");
		}
		
		self.ok = function(){
			modalService.closeModalOpenMap();
		}
		
		self.cancel = function(){
			modalService.closeModalOpenMap();
			post.place=oldPlace;
		}
}]);
angular.module("smiled.application").controller('openMapForPostCtrl', [ 'post', 'scenarioMap', 'modalService', 
	function openMapForPostCtrl(post, scenarioMap, modalService){
		var self = this;
		self.post = post;
		
		if(scenarioMap)
			self.map = scenarioMap.url;
		else
			self.map=null;
		
		console.log("OPENMAPFORPOSTCTRL: "+self.map);
			
		self.ok = function(){
			modalService.closeModalOpenMapForPost();
		}
		
		self.cancel = function(){
			modalService.closeModalOpenMapForPost();
		}
}]);
angular.module('smiled.application').controller('personalMissionCtrl', ['apiService', 'CONSTANTS', '$scope', '$stateParams',
   function personalMissionCtrl(apiService, CONSTANTS, $scope, $stateParams){
	
	var self = this;
	console.log($stateParams.missions);
	if($stateParams.missions!=null && $stateParams.missions.length>0){
		self.myMissions = $stateParams.missions;
	}else{
		console.log("download missions");
		apiService.getMyMissions().then(
				function(data){
					self.myMissions = data;
				},
				function(reason){
					console.log("Error retrieve missions");
					console.log(reason);
				}
		);
	}
	
	self.missionDateFormatDay = CONSTANTS.realDateFormatOnlyDay;
	self.missionDateFormatMonth = CONSTANTS.realDateFormatOnlyMonth;
	
}]);
angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS', '$cookies', '$filter', '$anchorScroll', '$location',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS, $cookies, $filter, $anchorScroll, $location){
	
	var self = this;
	var id = null;
	var role = null;
	self.ruolo = null;
	self.editProfile = false;
	self.editPassword = false;
	self.updateUserDTO = {};
	self.dateFormat = CONSTANTS.realDateFormatWithoutHour;
	self.isModifiable=false;
	self.user = {};
	self.oldPassword="";
	self.newPassword="";
	self.newPassword2 = "";
	self.messageErrorModifyPassword = "";
	
	self.dateOptions = {
			"regional" : "it",
			"changeYear" : true,
			"maxDate" : "0",
			"minDate" : new Date(1900,0,1,0,0,0,0),
			"yearRange" : "1900:c"
	};
	
	var myIdentity = $cookies.get('myMescholaId');
	
	var onSuccessGetUser = function(data){
		self.user = data;
		role = self.user.role;
		if(self.user.profile){
			self.updateUserDTO.gender = angular.copy(self.user.profile.gender);
			self.bornDateString = $filter( 'date') ( angular.copy(self.user.profile.bornDate), self.dateFormat );
			self.updateUserDTO.bornCity = angular.copy(self.user.profile.bornCity);
			self.updateUserDTO.schoolCity = angular.copy(self.user.profile.schoolCity);
			self.updateUserDTO.school = angular.copy(self.user.profile.school);
			self.updateUserDTO.quote = angular.copy(self.user.profile.quote);
			
		}
		
		
		if (role.authority=="ROLE_TEACHER")
			self.ruolo="DOCENTE";
		else if(role.authority=="ROLE_USER")
			self.ruolo="STUDENTE";
		else
			self.ruolo="AMMINISTRATORE";
	}
	
	var onErrorGetUser = function(reason){
		console.log("Error getting user personalProfile: "+reason);
	}
	var onErrorUpdateUser = function(reason){
		console.log("Error updating user personalProfile: "+reason);
	}

	if($stateParams.id)
		id = $stateParams.id;
	if(id){
		userService.getUser(id).then(onSuccessGetUser, onErrorGetUser);
		
		if(id == myIdentity){
			var d = new Date();
			self.url = CONSTANTS.urlMeCover+"?"+d.toString();
			self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+d.toString();
			self.isModifiable=true;
		}
		else{
			var d = new Date();
			self.url = CONSTANTS.urlUserCover(id)+"?"+d.toString();
			self.coverLarge = CONSTANTS.urlUserCoverLarge(id)+"?"+d.toString();
		}
		
	}else{
		userService.getMe().then(onSuccessGetUser, onErrorGetUser);
		var d = new Date();
		self.url = CONSTANTS.urlMeCover+"?"+d.toString();
		self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+d.toString();
		self.isModifiable=true;
	}
	
	self.updateMe = function(){
		
		if(self.bornDateString){
			var s = self.bornDateString.split("-");
			
		    var d = new Date(s[2], s[1]-1, s[0], 0, 0, 0, 0);
			self.updateUserDTO.bornDate = d;
		}
		
		userService.updateMe(self.updateUserDTO).then(onSuccessGetUser, onErrorUpdateUser);
	}
	
	self.uploadCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/me/cover/',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	            
	            var date = new Date();
	            self.url = CONSTANTS.urlMeCover+"?"+date.toString();    
	            userService.notifyPersonalCoverObservers();
	        });
		}
	}
	
	self.uploadCoverLarge = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/me/coverLarge',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	           
	            var date = new Date();
	            self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+date.toString();    
	            //userService.notifyPersonalCoverObservers();
	        });
		}
	}
	
	self.switchEditPassword = function(){
		
		self.editPassword = !self.editPassword;
		if(self.editPassword==true){
			$location.hash("changePwd");
		    $anchorScroll();
		    $location.url($location.path());
		}
			
		
	}
	
	self.switchEditProfile = function(){
		self.editProfile = !self.editProfile;
		self.editPassword = false;
	}
	
	self.showEditProfile = function(){
		self.editPassword = false;
		self.editProfile = true;
	}
	
	self.closeEditProfile = function(){
		self.editProfile = false;
		
		self.deleteModifyPassword();
	}

	self.deleteUpdateMe = function(){
		self.updateUserDTO = {};
		if(self.user.profile){
			self.updateUserDTO.gender = angular.copy(self.user.profile.gender);
			self.bornDateString = $filter( 'date') ( angular.copy(self.user.profile.bornDate), self.dateFormat );
		
			self.updateUserDTO.bornCity = angular.copy(self.user.profile.bornCity);
			self.updateUserDTO.schoolCity = angular.copy(self.user.profile.schoolCity);
			self.updateUserDTO.school = angular.copy(self.user.profile.school);
			self.updateUserDTO.quote = angular.copy(self.user.profile.quote);
		}
	}
	
	self.deleteModifyPassword = function(){
		self.oldPassword="";
		self.newPassword="";
		self.newPassword2 = "";
		self.editPassword=false;
		self.messageErrorModifyPassword ="";
	}
	self.modifyPassword = function(){
		self.messageErrorModifyPassword ="";
		if(self.oldPassword && self.newPassword){
			if(self.newPassword.length<8){
				self.messageErrorModifyPassword = "Inserire una password lunga almeno 8 caratteri!";
				self.oldPassword="";
				self.newPassword="";
				self.newPassword2="";
			}else{
				if(self.newPassword == self.newPassword2){
					var passwordDTO = {};
					passwordDTO.oldPassword = self.oldPassword;
					passwordDTO.newPassword = self.newPassword;
					userService.changePassword(passwordDTO).then(
							function(data){
								self.oldPassword="";
								self.newPassword="";
								self.newPassword2="";
								self.editPassword = false;
								alert("Password modificata correttamente");
							},
							function(reason){
								
								self.messageErrorModifyPassword = "Errore nel cambio password!";
								self.oldPassword="";
								self.newPassword="";
								self.newPassword2="";
							}
					);
				}else{
					
					self.messageErrorModifyPassword = "Errore - le due password non corrispondono!";
					self.oldPassword="";
					self.newPassword="";
					self.newPassword2="";
				}
			}
			
			
		}else{
			
			self.messageErrorModifyPassword = "Inserire tutti i campi richiesti!";
			self.oldPassword="";
			self.newPassword="";
			self.newPassword2="";
		}
	}
	
}]);

angular.module('smiled.application').controller('publishedNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams','alertingGeneric', 'loggedUser',
              function publishedNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, alertingGeneric, loggedUser){
	
	var self = this; 
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.newspaper = {}; 
	self.loggedUser = loggedUser;
	self.isJournalist=false; 
	self.isEditing; 
	self.idArticle; 
	if($stateParams.number){
		self.publishedNewspaperNumber = $stateParams.number;
		article.setPublishedNewspaperNumber($stateParams.number);

	} else {
		self.publishedNewspaperNumber = article.getPublishedNewspaperNumber();
		
	}
	if(self.scen.actualJournalist!=null && self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
	} 
	
	apiService.getnewspaperNumber(scenId,self.publishedNewspaperNumber).then(
			function(data) {
				self.newspaper = data;
				console.log(self.newspaper.name);
				console.log("GIORNALE PUBBLICATO CTRL")
				article.setIdPublishedTemplate(self.newspaper.idTemplate);
	
			}, function(reason) {	
				$state.go('logged.scenario.editorial');
			}
	)
	
	
	
	self.publishedNewspapers = [];
	
	
	
	self.goToDashboard = function(){
		if(self.scen.newspaperEnabled){
		  $state.go('logged.scenario.editorial');
		} else {
	      $state.go('logged.scenario.posts');
		}
		
	}
	
	
	//vai alle bozze SOLO PER STUDENTE GIORNALISTA 
	self.goToDraft = function(id){
		if(self.isJournalist){
			
			article.setIsEditing(true); 
			
			switch (id){
			case 1: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticle2col');
				break;
			case 2: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticleSimple');
				break;	
			case 3: 
				article.setArticleId(id);
				$state.go('logged.scenario.draftArticle2col');
				break;
			default: 
				console.log("ERROR");
				
			}
			/*article.setArticleId(self.idArticle);*/

	}else {
		
		console.log("NON SEI ABILITATO ALLA MODIFICA"); 
		
	}
	
	} 
}]); 
angular.module('smiled.application').controller('registerCtrl', ['apiService', '$state', 'alertingRegistration','$scope',
                                                                 function registerCtrl(apiService, $state, alertingRegistration, $scope){

	var self = this;
	self.user= {};
	self.user.agree=false;
	
	self.dateOptions = {
			"regional" : "it",
			"changeYear" : true,
			"maxDate" : "0",
			"minDate" : new Date(1900,0,1,0,0,0,0),
			"yearRange" : "1900:c"
	};
	
	self.postRegister = function (){

		if(validateRegister()){
			apiService.postRegister(self.user).then(
					function(data){
						//il server ha accettato la registrazione
						console.log("success register");
						self.user.email="";
						self.user.firstName="";
						self.user.lastName="";
						self.user.bornDate="";
						self.user.schoolCity="";
						self.user.bornCity ="";
						self.user.nameOfSchool="";
						self.user.password="";
						self.user.confirmPassword="";
						self.user.agree=false;
						alertingRegistration.addSuccess("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					},
					//il server ha rifiutato la registrazione
					function(reason){ 
						self.user.email="";
						self.user.firstName="";
						self.user.lastName="";
						self.user.bornDate="";
						self.user.schoolCity="";
						self.user.bornCity ="";
						self.user.nameOfSchool="";
						self.user.password="";
						self.user.confirmPassword="";
						self.user.agree=false;
						alertingRegistration.addDanger("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						throw new Error ("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						
						
					}
			);
		//la validazione lato client è fallita
		}else{
			self.user.password="";
			self.user.confirmPassword="";
		}
	}
	var validateRegister = function(){

		if(self.user.email==null || self.user.email=="" || self.user.firstName==null || self.user.firstName=="" || 
				self.user.lastName==null || self.user.lastName=="" || self.user.bornDate==null || self.user.bornDate =="" || 
				self.user.bornCity==null || self.user.bornCity =="" || 
				self.user.schoolCity==null || self.user.schoolCity =="" || 
				self.user.nameOfSchool==null || self.user.nameOfSchool =="" || self.user.password==null ||
				self.user.password=="" || self.user.confirmPassword==null || self.user.confirmPassword==""){
			alertingRegistration.addWarning("Compilare tutti i campi!");
			
			return false;
		}
		else if(!self.user.agree){
			alertingRegistration.addWarning("Acconsenti al trattamento dei tuoi dati personali!");
			return false;
		}
		else if(!validateEmail(self.user.email)){
			alertingRegistration.addWarning("Email non valida!");
			return false;
		}
		else if(self.user.password!=self.user.confirmPassword){
			alertingRegistration.addWarning("Attenzione le due password digitate non corrispondono!");
			return false;
		}
		else if(self.user.password.length<8){
			alertingRegistration.addWarning("Password troppo corta!");
			return false;
		}
		else
			return true;
	}
	
	var validateEmail = function (email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(email);
	}
	
	//CAROUSEL
	var scen1 = "assets/public/img/green.jpg";
	var scen2 = "assets/public/img/landing page/Personalizzabile.png";
	var scen3 = "assets/public/img/landing page/Sicura.png";
	var scen4 = "assets/public/img/landing page/Collaborativa.png";
	var scen5 = "assets/public/img/cover_default.jpg";
	var scen6 = "assets/public/img/calderone1.png";
	var scen7 = "assets/public/img/icon/pg.png";
	var scen8 = "assets/public/img/wizard/wiz_att.png";
	var scen9 = "assets/public/img/wizard/wiz_char.png";
	var scen10 = "assets/public/img/wizard/wiz_coll.png";
	var scen11 = "assets/public/img/ic_creatingscenario.png";
	var scen12 = "assets/public/img/ic_openscenario.png";
	var scen13 = "assets/public/img/wizard/wiz_info.png";
	var scen14 = "assets/public/img/wizard/wiz_rel.png";
	var scen15 = "assets/public/img/landing page/ic_teacher.png";
	var scenarios = [scen1, scen2, scen3, scen4, scen5, scen6, scen7, scen8, scen9, scen10, scen11, scen12, scen13];
	
	var scenarioIndex = 0;
	
	// LARGE AND MEDIUM DISPLAY
	self.hideArrowsL = false;
	self.scenariosToShowL = scenarios.slice(0,5);		
	if (scenarios.length <= 5){
		self.hideArrowsL = true;
	}	
	self.shiftScenariosAfterL = function(){
		scenarioIndex = scenarioIndex+5;		
		if (scenarioIndex>11 || scenarioIndex>=scenarios.length){
			//se sono arrivato alla fine degli scenari li rivedo da capo
			scenarioIndex = 0;
		}if (scenarios.length-scenarioIndex<=5){
			//se ho meno di 15 scenari quelli aggiuntivi li vedo in coda 
			scenarioIndex = scenarios.length-5;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);
	}
	
	self.shiftScenariosBeforeL = function(){
		if(scenarioIndex == 0){
			scenarioIndex = scenarios.length - 5;
		}else{
			scenarioIndex = scenarioIndex-5;
		}if(scenarioIndex<0){
			scenarioIndex = 0;
		}
		self.scenariosToShowL = scenarios.slice(scenarioIndex,scenarioIndex+5);

	}
	
	//SMALL DISPLAY
	self.hideArrowsM = false;
	self.scenariosToShowM = scenarios.slice(0,3);
	if(scenarios.length <= 3){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterM = function(){
		scenarioIndex = scenarioIndex+3;
		if (scenarioIndex>12 || scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}if(scenarios.length-scenarioIndex<=3){
			scenarioIndex = scenarios.length - 3;
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	self.shiftScenariosBeforeM = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-3;
		}else{
			scenarioIndex = scenarioIndex-3;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowM = scenarios.slice(scenarioIndex,scenarioIndex+3);
	}
	
	//EXTRA SMALL DISPLAY
	self.hideArrowsS = false;
	self.scenariosToShowS = scenarios.slice(0,1);
	if(scenarios.length <= 1){
		hideArrowsM = true;
	}
	self.shiftScenariosAfterS = function(){
		scenarioIndex = scenarioIndex+1;
		if(scenarioIndex>=scenarios.length){
			scenarioIndex = 0;
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	self.shiftScenariosBeforeS = function(){
		if(scenarioIndex==0){
			scenarioIndex = scenarios.length-1;
		}else{ scenarioIndex = scenarioIndex-1;
			if(scenarioIndex<0){
				scenarioIndex = 0;
			}
		}
		self.scenariosToShowS = scenarios.slice(scenarioIndex,scenarioIndex+1);
	}
	
	
}]);

angular.module('smiled.application').controller('registrationConfirmCtrl', ['$state',
            function($state){
				$state.go('login');
			}
]);
angular.module('smiled.application').controller('scenarioCharactersCtrl', ['CONSTANTS', '$scope',
              function scenarioCharactersCtrl(CONSTANTS,$scope){
	
	var self = this;
	self.scen = $scope.scenario.scen;
	
	var onStartup = function(){
		self.associations = self.scen.characters;
		if(self.associations){
			for(var i=0; i<self.associations.length; i++){
				self.associations[i].cover = CONSTANTS.urlCharacterCover(self.scen.id, self.associations[i].id);
				console.log(self.associations[i].cover);
				if(self.associations[i].userId){
					if(self.scen.attendees){
						for(var j=0; j<self.scen.attendees.length; j++){
							if(self.scen.attendees[j].id==self.associations[i].id){
								self.associations[i].userFirstName=self.scen.attendees[j].firstname;
								self.associations[i].userLastName=self.scen.attendees[j].lasstname;
								self.associations[i].userCover=CONSTANTS.urlUserCover(self.scen.attendees[j].id);
								break;
							}
						}
					}
				}
			}
		}
	}
	onStartup();
}]);
angular.module('smiled.application').controller('scenarioCtrl', ['scenario', 'loggedUser', 'CONSTANTS', 'apiService', 'userService','modalService', '$location','$anchorScroll','Upload','notifyService','$scope','$interval','$state','article','$log',
                                                function scenarioCtrl(scenario, loggedUser, CONSTANTS, apiService, userService, modalService, $location, $anchorScroll, Upload, notifyService, $scope, $interval, $state, article, $log){
	
	
	var self = this;
	self.scen = scenario;
	self.loggedUser = loggedUser;
    var date = new Date();
	self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id)+"?"+date.toString();
	self.isModerator = false;
	self.isCreator = false;
	self.hasCharacter = false;
	self.currentCharacter = {};
	self.showBoxEvent = false;
	self.showBoxCharacters = false;
	self.showBoxAttendees = false;
	self.showBoxCollaborators = false;
	self.showBoxInfo = true;
	self.numNewPost = 0;
	self.dateFormat = CONSTANTS.realDateFormatWithMinute;
	self.continueProduction = article.getBooleanRedazione(); 
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	self.firstNameAndSecondName = function(first, second){
		return first + " "+ second;
	}
	self.openBoxEvent = function(){
		self.showBoxEvent = !self.showBoxEvent;
	}
	
	self.openBoxCharacters = function(){
		self.showBoxCharacters = true;
	}
	self.openBoxAttendees = function(){
		self.showBoxAttendees = true;
	}
	self.openBoxCollaborators = function(){
		self.showBoxCollaborators = true;
	}
	self.openBoxInfo = function(){
		self.showBoxInfo = true;
	}
	
	self.closeBoxInfo = function(){
		self.showBoxInfo = false;
	}
	
	self.closeBoxCharacters = function(){
		self.showBoxCharacters = false;
	}
	self.closeBoxAttendees = function(){
		self.showBoxAttendees = false;
	}
	self.closeBoxCollaborators = function(){
		self.showBoxCollaborators = false;
	}
	
	self.incrementNumNewPost = function(){	
		
		self.numNewPost++;
		
	}
	
	var resetNumNewPost = function(){
		self.numNewPost = 0;
	}
	
	
	self.showNewPosts = function(){		
		notifyService.reloadList(); //dico al notifyService di avvertire scenarioPostController che ci sono nuovi post da scaricare
		resetNumNewPost();
		$location.hash("top");
	    $anchorScroll();
	    $location.url($location.path());
	}
	
	var reloadMe = function(){
		
		userService.getMe().then(function(data){
			self.loggedUser =data;
			onStartup();
		}, function (reason){
			consolelog("error");
		});
			
		
	}
	
	self.goToNewspaper = function() {
		
			$state.go('logged.scenario.editorial');			
		
				
	}
			
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	
	var onStartup = function(){
		
		if(self.scen.teacherCreator.id==self.loggedUser.id){
		
			self.isCreator=true;
			self.isModerator=true;	
			
		}
		userService.setScenarioId(self.scen.id);

		
		if(!self.isModerator){
			if(self.scen.collaborators){
				for(var i=0; i<self.scen.collaborators.length; i++){
					if(self.scen.collaborators[i].id==self.loggedUser.id){
						
						self.isModerator=true;
						break;
					}
				}
			}
		}
		
		if(self.scen.status=="ACTIVE"){
			if(self.loggedUser.openScenarios!=null)
				for(var i=0; i<self.loggedUser.openScenarios.length; i++){
					if(self.loggedUser.openScenarios[i].id==self.scen.id){
						if(self.loggedUser.openScenarios[i].myCharacterId){
							var date = new Date();
							self.hasCharacter=true;
							self.currentCharacter.id = self.loggedUser.openScenarios[i].myCharacterId;
							self.currentCharacter.name = self.loggedUser.openScenarios[i].myCharacterName;
							self.currentCharacter.cover = CONSTANTS.urlCharacterCover(self.scen.id, self.currentCharacter.id)+"?"+date.toString();
						}else{
							self.hasCharacter=false;
							self.currentCharacter={};
						}
					}
				}
		
		}
	}
	
	self.uploadCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: CONSTANTS.urlScenarioCover(self.scen.id),
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	        })
	        .success(function (data, status, headers, config) {
	            var date = new Date();
	            self.scen.cover = CONSTANTS.urlScenarioCover(self.scen.id)+"?"+date.toString() ;
	        });
		}
	}
	
	
	
	 
	
	var newPostListener = $scope.$on('notification.newPostEvent', function () {
        self.incrementNumNewPost();
        $scope.$applyAsync();
       
    })
  
	$scope.$on("$destroy", function() {
        notifyService.resetObserverAssociation();
		newPostListener();
    });
	
	
	notifyService.registerObserverAssociation(reloadMe);
	onStartup();

}]);
angular.module('smiled.application').controller('scenarioMapCtrl', ['CONSTANTS', '$scope', 'apiService', 'Fullscreen',
              function scenarioMapCtrl(CONSTANTS,$scope,apiService, Fullscreen){
	
	var self = this;
	self.isFullScreen = false;
	self.scen = $scope.scenario.scen;
	if(self.scen.history.mapId)
		self.map = CONSTANTS.urlMedia(self.scen.history.mapId);
	
	self.posts = apiService.getPagedPosts(self.scen.id, 0, 300, false);
	
	self.slide = 0;

	self.startDateString = "";
	self.endDateString = "";
	
	
	self.actualDate = "";
	
	self.bars = {};
//	self.topBarHeight = angular.element(document.querySelector('#container-canvas')).height+10;	
//	console.log("TOP: "+self.topBarHeight);
	self.getHeight = function(i){
		if(self.bars && self.bars[i]){
			var max = Math.max.apply(Math, self.bars);
			if(max==0)
				return "0%";
			else 
				return parseInt((self.bars[i]*100)/max)+"%";
		}else
			return "0%";
	}
	
	self.getDisplace = function(){
		var widthDiv = angular.element(document.querySelector('#slider')).width();
		var displace = parseInt((widthDiv/100)*self.slide); 
		if(displace>((3/4)*widthDiv))
			displace-=widthDiv/4;
		else
			displace-=widthDiv/8;
		return displace+"px";
	}
	
	self.options = {
		orientation: 'horizontal',
		min: 0,
		max: 100,
		range: 'min',
	};
	
	self.toggleFullScreen = function(){
		self.isFullScreen = !self.isFullScreen;
		if(self.isFullScreen)
			Fullscreen.all();
		else
			Fullscreen.cancel();
	}
	
}]);
angular.module('smiled.application').controller('scenarioMissionsCtrl', ['$stateParams','apiService','$scope', 'CONSTANTS',
                                                                         
		 function scenarioMissionsCtrl($stateParams, apiService, $scope, CONSTANTS){
	
			 var self = this;
			 
			 var myId = $scope.scenario.loggedUser.id;
			 self.myCharacter = null;
			 self.characters = [];
		
			var onStartUp = function(){
				apiService.getScenario($stateParams.id).then(
						function(data){
	
							$scope.scenario.scen = data;
							var date = new Date();
							$scope.scenario.scen.cover = CONSTANTS.urlScenarioCover($scope.scenario.scen.id)+"?"+date.toString();
						},
						function(reason){
							console.log("error in find scenario");
						}
				);
				
				if($scope.scenario.isModerator || $scope.scenario.isCreator || $scope.scenario.loggedUser.role.authority=="ROLE_ADMIN"){
					apiService.getAllCharactersFromScen($stateParams.id).then(
							function(data){
								self.characters = data;						
							},
							function(reason){
								console.log("error in find all characters");
							}
					);
				}else{
					if($scope.scenario.scen.characters){
						for(var i=0; i< $scope.scenario.scen.characters.length; i++){
							if($scope.scenario.scen.characters[i].userId == myId){
								self.myCharacter = $scope.scenario.scen.characters[i];
							
								break;
							}
						}
					}
					if(self.myCharacter){
						apiService.getCharacter($stateParams.id, self.myCharacter.id).then(
								function(data){
									
									self.characters.push(data);
								},
								function(reason){
									console.log("error in find my character");
								}
						);
					}
					
				}
				
				
			}
			
			var reloadCharacterMission = function(idS, idC){
				apiService.getCharacter(idS, idC).then(
						function(data){
							if(self.characters){
								for(var i = 0; i< self.characters.length; i++){
									if(self.characters[i].id == data.id){
										self.characters[i] = data;
									}
								}
							}
						},
						function(reason){
							console.log("error in reload character mission");
						}
				);
			}
			
			var reloadGlobalMission = function(idS){
				apiService.getScenario(idS).then(
						function(data){
							$scope.scenario.scen = data;
							var date = new Date();
							$scope.scenario.scen.cover = CONSTANTS.urlScenarioCover(idS)+"?"+date.toString();
						},
						function(reason){
							console.log("error in reload global mission");
						}
				);
			}
			
			onStartUp();
			
			var updateGlobalMission = $scope.$on('notification.updateGlobalMission', function (event, data) {
				console.log("event!!!!!!!!!");
				reloadGlobalMission(data.idS);
		    });
			
			var updateCharacterMission = $scope.$on('notification.updateCharacterMission', function (event, data) {
		       reloadCharacterMission(data.idS, data.idC);
		    });
		    
		    $scope.$on("$destroy", function() {
		    	updateCharacterMission();
		    	updateGlobalMission();
		        
		    });
	
}]);
angular.module('smiled.application').controller('scenarioPostCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function scenarioPostCtrl(CONSTANTS,$scope, apiService,Upload,$interval, notifyService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.posts = [];
	$scope.scenario.labelNewPosts = true;
	var scrollable = CONSTANTS.numberOfPostForScroll;
	
	
//	self.newPost = {};
//	self.newPost.date = {
//			afterChrist : true
//	};
//	self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
	
	self.newEvent = {};
	self.newEvent.date = {
			afterChrist : true
	};
	self.newEvent.date.formatted=CONSTANTS.insertHistoricalDateEvent;
	
	
//	self.newPost.image = {};
//	self.newPost.file  = {};
	self.showDatePicker=false;
	self.showDatePickerEvent=false;

	if($scope.scenario.hasCharacter)
		self.commentTab=true;
	else
		self.commentTab=false;
	
	self.realDateFormat = CONSTANTS.realDateFormatWithHour;
	
	
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	
	self.getUrlCoverCharacter = function(id){
		return CONSTANTS.urlCharacterCover(self.scen.id,id);
	}
	
	self.getUrlMedia = function(id){
		return CONSTANTS.urlMedia(id);
	}
	
	self.formatDate = function(date){
		if(date.afterChrist)
			era="D.C.";
		else
			era="A.C.";
		
		return date.day+" / "+date.month+" / "+date.year+" "+era;
	}
	
	var postAlreadyPresent = function(postId){
		for(var i = 0; i<self.posts.length; i++){
			if(self.posts[i].id == postId)
				return true;
		}
		return false;
	}
	
	self.switchCommentTab = function(c){
		if($scope.scenario.hasCharacter)
			self.commentTab = c;
		else
			self.commentTab = false;
	}
	
	/*-----------------------------------UTILIY------------------------------------------------*/
	var stopScroll=false;
	self.nextPost = function(){
		if(self.busy || stopScroll)
			return;
		self.busy=true;
	
		if(self.posts.length==0){
			self.getPost("",scrollable);
		}else{
			self.getPost(self.posts[self.posts.length-1].id,scrollable);
		}
	}
	
	self.busy=false;
	
	self.getPost = function(lastId, n){
//		apiService.getPagedPosts(self.scen.id, 0, n, false).then(
		apiService.getLastPosts(self.scen.id, lastId, n).then(

			function(data){
//				self.posts = data.content;
				var newPosts = [];
				newPosts = data;
				if(data.length==0)
					stopScroll=true;

				for(var i=0; newPosts && i<newPosts.length;i++){
					if(newPosts[i].character){
						newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
					
						for(var j=0; j<newPosts[i].likes.length; j++){
							if(newPosts[i].likes[j].id==self.currentCharacter.id){
								newPosts[i].youLike=true;
								break;
							}
						}
					}
					self.posts.push(angular.copy(newPosts[i]));
				}
				self.busy=false;
				
			}, function(reason){
				console.log("errore");
				self.busy=false;
			}
		);
	}
	
	//listOfNewPosts è la lista di id di post da scaricare
	var updateScenarioWithNewPosts = function(listOfNewPosts){
		
//      Operazione di scrematura molto probabilmente NON NECESSARIA!!!
//		if(listOfNewPosts!=null && listOfNewPosts.length>0){
//			for(var i = 0; i<listOfNewPosts.length; i++){
//				if(postAlreadyPresent(listOfNewPosts[i])){
//					listOfNewPosts.splice(i,1);  //sto scremando i post che ho gia scaricato
//				}
//			}
//		}
		
		
		apiService.getListOfNewPosts(self.scen.id, listOfNewPosts).then(
				
				function(data){
					var newPosts = data.content;
					for(var i=0; i<newPosts.length;i++){
//						if(self.posts[i].imageId){
//							self.posts[i].imageUrl = CONSTANTS.urlMedia(self.posts[i].imageId);
//						}
						if(newPosts[i].character){
							newPosts[i].character.cover = CONSTANTS.urlCharacterCover(self.scen.id,newPosts[i].character.id);
						
							for(var j=0; j<newPosts[i].likes.length; j++){
								if(newPosts[i].likes[j].id==self.currentCharacter.id){
									newPosts[i].youLike=true;
									break;
								}
							}
						}
					}
					
					for(var i=0; i<self.posts.length; i++){
						newPosts.push(self.posts[i]);
					}
					self.posts=newPosts;
					
					
				}, function(reason){
					console.log("errore");
				}
		);
		
	}
	
	var updateScenarioWithModPosts = function(listOfUpdPosts){
		if(listOfUpdPosts!=null && listOfUpdPosts.length>0){
			for(var i = 0; i<listOfUpdPosts.length; i++){
				if(!postAlreadyPresent(listOfUpdPosts[i])){
					listOfUpPosts.splice(i,1);  //sto scremando i post che ho gia scaricato
				}
			}
			if(listOfUpdPosts.length>0){
				apiService.getListOfNewPosts(self.scen.id, listOfUpdPosts).then(
						
						function(data){
							if(data.content){
								for(var i=0; i<data.content.length; i++){
									for(var j=0; j<self.posts.length; j++){

										if(self.posts[j].id == data.content[i].id){
											
											self.posts[j]=angular.copy(data.content[i]);
										}
									}
								}
							}

						}, function(reason){
							console.log("errore");
						}
				);
			}
		}
	}
	
	self.addCommentToPost = function(s){
		if(s.newComment){
			var comment = {};
			comment.text=s.newComment;
			apiService.sendCommentToPost(self.scen.id, s.id, comment).then(
					function(data){
						apiService.getSingleStatus(self.scen.id, s.id).then(
								function(data){
									for(var i=0; i<self.posts.length; i++){
										if(self.posts[i].id==data.id){
											data.newComment="";
											if(data.imageId)
												data.imageUrl = CONSTANTS.urlMedia(data.imageId);
											data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
											self.posts.splice(i,1,data);
										}
									}
									
								},
								function(reason){
									console.log("error in insert new post in array");
								}
						);
					},
					function(reason){
						console.log("fail to send comment: "+reason);
					}
			);
		}
	}
	
	self.addMetaCommentToPost = function(s){
		if(s.newMetaComment){
			var comment = {};
			comment.text=s.newMetaComment;
			apiService.sendMetaCommentToPost(self.scen.id, s.id, comment).then(
					function(data){
						apiService.getSingleStatus(self.scen.id, s.id).then(
								function(data){
									s.newMetaComment="";
									for(var i=0; i<self.posts.length; i++){
										if(self.posts[i].id==data.id){
											data.newComment="";
											if(data.imageId)
												data.imageUrl = CONSTANTS.urlMedia(data.imageId);
											data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
											self.posts.splice(i,1,data);
										}
									}
								},
								function(reason){
									console.log("error in insert new post in array");
								}
						);
					},
					function(reason){
						console.log("fail to send comment: "+reason);
					}
			);
		}
	}
	
	
	notifyService.setActualScenarioId(self.scen.id);
	notifyService.registerObserverReloadList(updateScenarioWithNewPosts);
	
	var updPostEvent = $scope.$on("notification.updPostEvent", function (event, data){
		console.log("notification.updPostEvent");
		var listOfUpdPost = [];
		listOfUpdPost.push(data.id);
		updateScenarioWithModPosts(listOfUpdPost);
	});
	
	var updNewCommentEvent = $scope.$on("notification.updNewComment", function (event, data){
		var n = data.notification;
		var founded = false;
		for(var i=0; i<self.posts.length; i++){
			if(self.posts[i].id==n.objectId){
				for(var j=0; self.posts[i].comments && j<self.posts[i].comments.length; j++){
					if(self.posts[i].comments[j].id == n.comment.id){
						self.posts[i].comments[j] = angular.copy(n.comment);
						founded=true;
						break;
					}
				}
				if(!founded){
					self.posts[i].comments.splice(0,0,angular.copy(n.comment));
				}
				break;
			}
		}
	});
	
	var updNewMetaCommentEvent = $scope.$on("notification.updNewMetaComment", function (event, data){
		var n = data.notification;
		var founded = false;
		for(var i=0; i<self.posts.length; i++){
			if(self.posts[i].id==n.objectId){
				for(var j=0; self.posts[i].metaComments && j<self.posts[i].metaComments.length; j++){
					if(self.posts[i].metaComments[j].id == n.metaComment.id){
						self.posts[i].metaComments[j] = angular.copy(n.metaComment);
						founded=true;
						break;
					}
				}
				if(!founded){
					self.posts[i].metaComments.splice(0,0,angular.copy(n.metaComment));
				}
				break;
			}
		}
	});
	
	
//	self.getPost("",2);
	
	$scope.$on("$destroy", function() {
		updNewMetaCommentEvent();
		updNewCommentEvent();
        updPostEvent();
        notifyService.resetActualScenarioId();
        notifyService.resetObserverReloadList();
        $scope.scenario.labelNewPosts = false;
        self.post=[];
        $scope.scenario.numNewPost = 0;
    });
	

}]);
angular.module('smiled.application').controller('scenarioResourcesCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload', '$location', '$anchorScroll', 'modalService',
              function scenarioResourcesCtrl(CONSTANTS,$scope, apiService,Upload, $location, $anchorScroll, modalService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.uploadable = $scope.scenario.isCreator || $scope.scenario.isModerator;
	
	self.showMetaBox = false;
	self.showProgressBar = false;
	self.newFile = {};
	self.newFile.progress=0;
	self.showCancelButton=false;
	self.error="";
	self.files = [];
	
	self.realDateFormat = CONSTANTS.realDateFormatWithHour;
	
	var up;
	
	var getResourceType = function(format){
		if(format=="jpg" || format=="png" || format=="gif")
			return "img";
		if(format=="pdf")
			return "pdf";
		if(format=="doc" || format =="docx" || format=="odt" || format=="txt")
			return "doc";
		if(format=="ppt" || format=="pptx" || format=="odp")
			return "ppt";
		if(format="xls" || format=="xlsx" || format=="ods")
			return "excel";
		
		
		return "doc";
		
	}
	
	var uploadMediaList = function(){
		apiService.getTrustedMediaMetadata(self.scen.id).then(
	
			function(response){
				self.files = response;
				if(self.files){
					for(var i=0; i<self.files.length; i++){
						
						self.files[i].type = getResourceType(self.files[i].format);
						
						if(self.files[i].teacherId==self.scen.teacherCreator.id){
							self.files[i].user = self.scen.teacherCreator.firstname+" "+self.scen.teacherCreator.lastname;
							continue;
						}else{
							if(self.scen.collaborators){
								for(var j=0; j<self.scen.collaborators.length; j++){
									if(self.files[i].teacherId==self.scen.collaborators[j].id){
										self.files[i].user = self.scen.collaborators[j].firstname+" "+self.scen.collaborators[j].lastname;
										break;
									}
								}
							}
						}
					}
				}
			},
			function(reason){
				console.log("ERRORE DOWNLOAD METADATA");
			}
		);
	}
	
	uploadMediaList();
	
	self.uploadFiles = function(file){
		self.error="";
		up = Upload.upload({
            url: CONSTANTS.urlTrustedMediaScenarioPost(self.scen.id),
            headers : {
                'Content-Type': file.type
            },
            file: file
        });
		
		up.then(
				/*SUCCESS*/
				function(resp){
					self.showCancelButton=false;
					self.showMetaBox=true;
					self.newFile.name = resp.config.file[0].name;
					self.newFile.id=resp.data.id;
					uploadMediaList();
				},
				/*FAIL*/
				function(reason){
					console.log("UPLOAD FAILED");
					self.newFile.progress = 0;
					self.error="Upload fallito ("+reason.data.message+"). Si prega di riprovare.";
					self.showCancelButton=false;
				},
				/*PROGRESS*/
				function(evt){
					self.showCancelButton=true;
					self.showProgressBar=true;
					self.newFile.progress = parseInt(100.0 * evt.loaded / evt.total);
					self.widthProgressBar=self.newFile.progress+"%";
				}
		);
	};
	
	self.abortUpload = function(){
		up.abort();
	}
	
	self.saveMeta = function(){
		var metaDTO = {};
		metaDTO.description = self.newFile.description;
		apiService.postTrustedMediaMetadata(self.scen.id, self.newFile.id, metaDTO).then(
				function(data){
					self.showMetaBox = false;
					self.showProgressBar = false;
					for(var i=0; i<self.files.length; i++){
						if(self.files[i].name==self.newFile.id){
							self.files[i].description = self.newFile.description;
						}
					}
					self.newFile = {};
					self.newFile.progress=0;
				},
				function(reason){
					console.log("ERRORE UPLOAD METADATA!");
					console.log(reason);
				}
		);
	};
	
	self.hideMetaBox = function(){
		self.showMetaBox = false;
		self.showProgressBar = false;
		self.newFile = {};
		self.newFile.progress=0;
	}
	
	self.getMediaUrl = function(id){
		return CONSTANTS.urlMedia(id);
	}
	
	self.updateFile = function(index){
		$location.hash("update-description");
	    $anchorScroll();
	    $location.url($location.path());
		self.showMetaBox=true;
		self.newFile.name = self.files[index].originalName;
		self.newFile.id = self.files[index].name;
		self.newFile.description = self.files[index].description;
	}
	
	self.removeFile =function(index){
		modalService.showModalDeleteResource(self.files[index]).then(
				function(response){
					apiService.deleteTrustedMedia(self.scen.id, self.files[index].name).then(
							function(response){
								self.files.splice(index, 1);
							},
							function(reason){
								
							}
					);
				},
				function(reason){
					console.log("errore");
				}
		);
	}
	

}]);
angular.module('smiled.application').controller('scenarioSocialGraphCtrl', 
		[
		 function scenarioSocialGraphCtrl(){
	
	var self = this;
	
}]);
angular.module("smiled.application").controller('scenarioStorylineCtrl', [ 'apiService', '$scope', 'CONSTANTS', 'Lightbox',
        function scenarioStorylineCtrl(apiService, $scope, CONSTANTS, Lightbox){
        	
        	var self = this;
        	self.posts = [];
        	self.date = {};
        	var numMediaPerRow = 3;
        	var order=true;
        	self.showFromEnd = true;
        	var scrollable = CONSTANTS.numberOfPostForScroll;
        
        	self.busy=false;
        	var stopScroll=false;
        	
        	
        	self.nextPost = function(){
        		if(self.busy || stopScroll)
        			return;
        		self.busy=true;
        		if(self.posts.length==0){
        			getPost();
        		}else{
        			getPost(self.posts[self.posts.length-1].julianDayNumber,self.posts[self.posts.length-1].timeNumber);
        		}
        	}
        	
        	var getPost = function(date, time){
        	
		    	apiService.getLastHistoricPosts($scope.scenario.scen.id, scrollable, order, date, time).then(
		    			function(data){
		    				var arrivedPosts = data;
		    				if(arrivedPosts.length==0){
		    					stopScroll=true;
		    					return;
		    				}
		    				for(var i=0; i<arrivedPosts.length;i++){
		  					
		    					if(arrivedPosts[i].character && arrivedPosts[i].character.id){
		    						arrivedPosts[i].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,arrivedPosts[i].character.id);
		    						for(var j=0; j<arrivedPosts[i].likes.length; j++){
		    							if(arrivedPosts[i].likes[j].id==arrivedPosts[i].character.id){
		    								arrivedPosts[i].youLike=true;
		    								break;
		    							}
		    						}
		    					}else{
		    						arrivedPosts[i].character = {};
		    						arrivedPosts[i].character.name="Narratore";
		    						arrivedPosts[i].character.cover="assets/public/img/narr.png";
		    						arrivedPosts[i].isEvent = true;
		    					}
		    					if(arrivedPosts[i].comments){
		    						for(var j=0; j<arrivedPosts[i].comments.length; j++){
		    							arrivedPosts[i].comments[j].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,arrivedPosts[i].comments[j].character.id);
		    						}
		    					}
		    					if(arrivedPosts[i].imagesMetadata){
		    						arrivedPosts[i].media = new Array();
		    						arrivedPosts[i].media[0] = new Array();
		    						var col = -1;
		    						var row = 0;
		    						for(var j=0; j<arrivedPosts[i].imagesMetadata.length;j++){
		    							if(j!=0 && j%numMediaPerRow==0){
		    								col=0;
		    								row++;
		    								arrivedPosts[i].media[row] = new Array();
		    							}else{
		    								col++;
		    							}
		    							arrivedPosts[i].media[row][col] = CONSTANTS.urlMediaThumb(arrivedPosts[i].imagesMetadata[j].id);
		    							arrivedPosts[i].imagesMetadata[j].url = CONSTANTS.urlMedia(arrivedPosts[i].imagesMetadata[j].id);
		    						}
		    					}
		    					self.posts.push(angular.copy(arrivedPosts[i]));
		    				}
	    					self.busy=false;
		    			}, function(reason){
		    				console.log("errore");
	    					self.busy=false;
		    			}
		    	);
			}
        	
//        	getPost();
        	
        	self.switchOrder = function(o){
        		order = !order;
        		self.posts=[];
        		self.busy=false;
        		stopScroll=false;
        		self.nextPost();
        	}
        	
        	self.getPosition = function(index){
        		if(index%2==0)
        			return "timeline-inverted";
        		else
        			return "";
        	}
        	
        	var getMonthString = function(month){
        		return CONSTANTS.monthString(month);
        	} 
			
			var julianNumberToDate = function(jd, date){
        		  var l = jd + 68569;
        	      var n = parseInt(( 4 * l ) / 146097);
        	      l = l - parseInt(( 146097 * n + 3 ) / 4);
        	      var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
        	      l = l - parseInt(( 1461 * i ) / 4) + 31;
        	      var j = parseInt(( 80 * l ) / 2447);
        	      date.day = l - parseInt(( 2447 * j ) / 80);
        	      l = parseInt(j / 11);
        	      date.month = j + 2 - ( 12 * l );
        	      date.year = 100 * ( n - 49 ) + i + l;
        	      date.dow = jd%7;
        	}
			var getTimeToSeconds=function(timeNumber,t){
        		t.hours=parseInt(timeNumber/3600);
        		timeNumber=timeNumber%3600;
        		t.minutes=parseInt(timeNumber/60);
        		timeNumber=timeNumber%60;
        		t.seconds=timeNumber;
        	}
			
			self.formatDate = function(jd, timeNumber){
//				if(date.afterChrist)
//					era="D.C.";
//				else
//					era="A.C.";
//				
//				return date.day+" / "+date.month+" / "+date.year+" "+era;
				julianNumberToDate(jd, self.date);
        		var era = self.date.year > 0 ? "" : " A.C.";
        		var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
        		s = self.date.day+" "+s;
        		var time = {};
        		getTimeToSeconds(timeNumber, time);
        		
        		s+=" "+time.hours+":";
				if(time.minutes<10)
        			s+="0"+time.minutes;
        		else
        			s+=time.minutes;
        		return s;
			}
        	
        	self.realDateFormatWithHour = CONSTANTS.realDateFormatWithHour;
        	
        	self.getMediaUrl = function(id){
        		return CONSNTANTS.urlMedia(id);
        	}
        	
        	self.openPostGallery = function(post, row, col){
				var index = (row*numMediaPerRow)+col;
				if(post.media)
					Lightbox.openModal(post.imagesMetadata,index);
        	}
}]);
angular.module('smiled.application').controller('scenarioWizardCtrl', ['apiService', '$stateParams', '$state', 
                                                                       '$location', '$scope', '$element', 'userService', 
                                                                       'Upload', 'CONSTANTS', '$q','modalService',
                                                                       '$timeout', 'alertingGeneric',
   function scenarioWizardCtrl(apiService, $stateParams, $state, $location, $scope, $element, userService, Upload, CONSTANTS, $q, modalService, $timeout, alertingGeneric){
	
	 	var self = this;
		/*Variabile che contiene lo scenario prelevato dalla getScenario
		 * self.scenario.characters è l'array di Reference a Character contenuto in scenario*/
	 	self.scenario = {};
	 	
//	 	for(var i=0; i<self.blabla.length; i++){
//	 		self.bobo = self.blabla[i];
//	 	}
	 	
		var tab;
		self.scenarioServer = {};
		self.associated = [];
		self.notAssociatedAttendees = [];
		self.notAssociatedCharacters = [];
		//self.charactersCover = [];
		self.emailList;
		self.accordionIsDisabled=true;
		self.user;
		self.selectableStudents = [];
		//self.selectableCollaborators = new Array();
		self.currentCharacters = []; //qui ci vanno le modifiche temporanee al character i-esimo. Questo ci permette di decidere se effettuare o meno la put sul server nel momento in cui andiamo a chiudere l'accordion
		self.charactersServer = []; //array di character cosi come sono sul server
		self.map;
		
		self.lastUserClicked = null;
		self.lastCharacterClicked = null;
		
		var currentCharacterIndex = -1;
		var getMePromise = $q.defer();
		var id = $stateParams.id;
		self.showNewspaperTab;
		
		
		//GET ME
		userService.getMe().then(
			function(data){
				self.user = data;
				var userCopy = angular.copy(self.user);
				self.selectableStudents = userCopy.students;
			
				getMePromise.resolve();
				getScenario();
			}
		);
		
		self.concatNameAndSurname = function (name, surname){
			return name + " " + surname;
		}
		
		self.isClickedUser = function(id){
			if(self.lastUserClicked && id == self.lastUserClicked.id)
				return true;
			else 
				return false;
		}
		
		self.isClickedCharacter = function(id){
			if(self.lastCharacterClicked && id == self.lastCharacterClicked.id)
				return true;
			else 
				return false;
		}
		
		self.userClicked = function(user){
			if(self.lastUserClicked && user.id == self.lastUserClicked.id){
				self.lastUserClicked = null;
			}
			else{
				self.lastUserClicked = user;
				if(self.lastCharacterClicked!=null){
					self.createAssociationWithoutDrag();
					self.lastUserClicked = null;
					self.lastCharacterClicked=null;
				}
			}
				
			
		}
		
		self.characterClicked = function(character){
			if(self.lastCharacterClicked && character.id == self.lastCharacterClicked.id){
				self.lastCharacterClicked = null;
			}
			else{
				self.lastCharacterClicked = character;
				if(self.lastUserClicked!=null){
					self.createAssociationWithoutDrag();
					self.lastUserClicked = null;
					self.lastCharacterClicked=null;
				}
			}
				
		}
		
		var getScenario = function(){
			//GET SCENARIO
			if(id==null){
				self.title="Crea nuovo scenario";
			}else{
				self.charging = true;
				apiService.getScenario(id).then(
						function(data){
							self.scenarioServer = data;
							self.scenario = angular.copy(data);

							self.title = data.name;
							
							updateSelectableAttendees();
							//aggiorno le cover dei characters dello scenario
							updateCover();
							//updateSelectableCollaborators();
							
							updateAssociated();
							if(self.scenario.newspaperEnabled){
								
								self.showNewspaperTab=true;
								
								self.actualJournalist = self.scenario.actualJournalist;
								updateAllPeopleInScenario();
								if(self.allPeopleInScenario!=null){
									for(var i=0; i<self.allPeopleInScenario.length; i++){
										if(self.actualJournalist != null && self.allPeopleInScenario[i].id == self.actualJournalist.id)
											self.allPeopleInScenario.splice(i,1);
									}
								}
								
								
							}else{
								self.showNewspaperTab=false;
								if(tab==5){
									$state.go("logged.scenarioWizard.info");
								}
							}
							
							retrieveCharacterAndOrder();
						
						}, function(reason){
							console.log("errore");
							$state.go("logged.dashboard");
						}
				);
				self.scenarioCover = CONSTANTS.urlScenarioCover(id);
				
			}
		}
		
		self.isScenarioActive = function(){
			
			if (self.scenario.status == 'ACTIVE')
				return true;
			else 
				return false;
		}
		
		var retrieveCharacterAndOrder = function(){
			
			apiService.getAllCharactersFromScen(id).then(
					function(data){
						if(self.scenario.characters){
							for(var i=0; i<self.scenario.characters.length;i++){
								for(var j=0; j<data.length;j++){
									if(data[j].id==self.scenario.characters[i].id){
										if(!data[j].bornDate){
											data[j].bornDate = {};
											data[j].bornDate.afterChrist = true;
										}
										if(!data[j].deadDate){
											data[j].deadDate = {};
											data[j].deadDate.afterChrist = true;
										}
										self.charactersServer[i]=data[j];
										self.currentCharacters[i] = angular.copy(data[j]);
										data.splice(j,1);
										break;
									}
								}
							}
						}
						self.accordionIsDisabled=false;

						//$timeout(function(){self.accordionIsDisabled=false;},10000);
					}, function(reason){
						console.log("errore");
					}
			);
			
			
		}
		
		var updateCover = function(){
			if(self.scenario.characters)
				for(var i=0;i<self.scenario.characters.length;i++){
					self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
					self.scenarioServer.characters[i].cover = CONSTANTS.urlCharacterCover(id, self.scenario.characters[i].id);
				}
			if(self.scenario.attendees)
				for(var i=0;i<self.scenario.attendees.length; i++){
					self.scenario.attendees[i].cover = CONSTANTS.urlUserCover(self.scenario.attendees[i].id);
					self.scenarioServer.attendees[i].cover = CONSTANTS.urlUserCover(self.scenario.attendees[i].id);
				}
			if(self.scenario.collaborators)
				for(var i=0;i<self.scenario.collaborators.length; i++){
					self.scenario.collaborators[i].cover = CONSTANTS.urlUserCover(self.scenario.collaborators[i].id);
					self.scenarioServer.collaborators[i].cover = CONSTANTS.urlUserCover(self.scenario.collaborators[i].id);
				}
			self.scenario.teacherCreator.cover = CONSTANTS.urlUserCover(self.scenario.teacherCreator.id);
			self.scenarioServer.teacherCreator.cover = CONSTANTS.urlUserCover(self.scenario.teacherCreator.id);
			self.map = CONSTANTS.urlMedia(self.scenario.history.mapId);
		}
		
		
		
		var updateAssociated = function(){
			var teacherPlay=false;
			var attendees= new Array();
			
			if(self.scenario.attendees){
				attendees = angular.copy(self.scenario.attendees);
			}
			if(self.scenario.collaborators){
				
				attendees = attendees.concat(self.scenario.collaborators);
			}

			

			if(self.scenario.characters){
				for(var i=0; i<self.scenario.characters.length; i++){
					if(self.scenario.characters[i].userId==null){
						self.notAssociatedCharacters.push(self.scenario.characters[i]);
					}else if(self.scenario.characters[i].userId==self.scenario.teacherCreator.id){
						var association = {};
						association.character = self.scenario.characters[i];
						association.attendee = self.scenario.teacherCreator;
						self.associations.push(association);
						teacherPlay=true;
					}else{
						if(attendees){
							for(var j=0; j<attendees.length; j++){
								if(attendees[j].id==self.scenario.characters[i].userId){
									var association = {};
									association.character = self.scenario.characters[i];
									association.attendee = attendees[j];
									self.associations.push(association);
									attendees.splice(j,1);
									break;
								}
							}
						}
					}
				}
			}
			self.notAssociatedAttendees = attendees;


			if(!teacherPlay)
				self.notAssociatedAttendees.push(self.scenario.teacherCreator);
			
		}
		
		/*------------------------------------------------------------------------------------------------------------------------ */
		
		
		self.showPopUpDeleteScenario = function (){
			if(self.scenario!=null)
				modalService.showModalDeleteScen(self.scenario);
		};
		
		self.showPopUpDeleteAttendee = function (a){
			modalService.showModalDeleteAttendee(a).then(
					function(response){
						if(response.firstname)
							self.deleteAttendee(response);
						else
							self.deleteInvited(response);
						alertingGeneric.addSuccess("Partecipante rimosso");
						
					}, function(reason){
						console.log("Errore - Rimozione partecipante annullata");
					});
		};
		
		self.showPopUpDeleteCollaborator = function (c){
			modalService.showModalDeleteCollaborator(c).then(
					function(response){
						
						self.deleteCollaborator(response);	
						alertingGeneric.addSuccess("Collaboratore rimosso");
						
					}, function(reason){
						console.log("Rimozione collaboratore annullata");
					});
		};
		
		self.showPopUpDeleteCharacter = function (c){
			modalService.showModalDeleteCharacter(c).then(
					function(response){
						self.deleteCharacter(c);
						alertingGeneric.addSuccess("Personaggio rimosso");
						
					}, function(reason){
						console.log("Rimozione personaggio annullata");
					});
		};
		
		var reInsertInSelectable = function(s){
			
			self.selectableStudents.push(s);
			
		}
//		var reInsertInSelectableCollaborators = function(c){
//			console.log("reInsertInSelectableCollaborators");
//			self.selectableCollaborators.push(c);
//		}
		
		var updateSelectableAttendees = function(){
			
			if(self.scenarioServer && self.scenarioServer.attendees && self.selectableStudents){
				
				for(var i=0; i<self.scenarioServer.attendees.length; i++){
					
					for(var j=0; j<self.selectableStudents.length; j++){
						
						if(self.scenarioServer.attendees[i].id==self.selectableStudents[j].id){
							self.selectableStudents.splice(j,1);
						}
					}
				}
			}
		}
		
		self.getPagedTeacherByRegex = function(regex){
			return apiService.getPagedTeacherByRegex(0, 10, regex).then(
						function(data){
							return filterListSelectableCollaborators(data.content);
							
						},
						function(reason){
							console.log("failed to get paged teacher by regex");
							console.log(reason);
						}
				
			);
			
			
		}
		
		self.selectNewJournalist = function(){
			return apiService.updateUserJournalist(self.scenario.id, self.selectedJournalist.id).then(
					function(data){
						if(self.actualJournalist!=null && self.actualJournalist!=""){
							var oldJournalist = angular.copy(self.actualJournalist);
							self.allPeopleInScenario.push(oldJournalist);
						}
						self.actualJournalist=angular.copy(self.selectedJournalist);
						self.selectedJournalist="";
						for(var i=0; i<self.allPeopleInScenario.length; i++){
							if(self.allPeopleInScenario[i].id == self.actualJournalist.id)
								self.allPeopleInScenario.splice(i,1);
						}
						
					},
					function(reason){
						console.log("failed to select new journalist");
						self.selectedJournalist="";
						console.log(reason);
					}
			
		);
			
		}
		
		var filterListSelectableCollaborators = function(l){
			
			var found=false;
			if(l){
				for(var i=0; i< l.length; i++){
					found=false;
					if(l[i].id == self.user.id){
						
						l.splice(i, 1);
						continue;
					}
					if(self.scenario.collaborators!=null){
						for(var j=0; j< self.scenario.collaborators.length; j++){
							
							if(l[i].id == self.scenario.collaborators[j].id){
								
								l.splice(i, 1);
								found = true;
								break;
							}
						}
					}
					if(found)
						continue;
						
				}
			}
			
			return l;
		}
		
//		var updateSelectableCollaborators = function(){
//			
//			if(self.scenarioServer && self.scenarioServer.collaborators && self.selectableCollaborators){
//			
//				for(var i=0; i<self.scenarioServer.collaborators.length; i++){
//			
//					for(var j=0; j<self.selectableCollaborators.length; j++){
//					
//						if(self.scenarioSever.collaborators[i].id==self.selectableCollaborators[j].id){
//							self.selectableCollaborators.splice(j,1);
//						}
//					}
//				}
//			}
//		}
		
		
		self.exitWizard = function(){
			self.saveInfo();
			self.checkOpenAccordion();
		}
		
		self.saveInfo = function(){
			var scenarioDTO = {};
			scenarioDTO.name = self.scenario.name;
			scenarioDTO.description = self.scenario.description;
			scenarioDTO.history = self.scenario.history;
			scenarioDTO.showRelationsToAll = self.scenario.showRelationsToAll;
			scenarioDTO.newspaperEnabled = self.scenario.newspaperEnabled;
			
			if(id==null){
				console.log("######################ID NULL");
				scenarioDTO.showRelationsToAll = true;
				scenarioDTO.newspaperEnabled = true;
				
				if(infoValidate()){
					apiService.createScenario(scenarioDTO).then(
							function(data){
								id = data.id;
								self.showNewspaperTab=true;
							},
							function(reason){								
								console.log("Errore creazione scenario");
							}
					);
				}else{
					console.log("fail infoValidate");
				}
			}else{
				console.log("######################ID NOT NULL");
				if(!isEquivalent(self.scenario, self.scenarioServer) && infoValidate()){
					console.log(scenarioDTO.newspaperEnabled);
					apiService.updateScenario(scenarioDTO, id).then(
							function(data){
								self.scenarioServer = data;
								self.scenario = angular.copy(data);
								console.log(self.scenario);
								if(self.scenario.newspaperEnabled)
									self.showNewspaperTab=true;
								else
									self.showNewspaperTab=false;
								self.actualJournalist=self.scenario.actualJournalist;
								
								updateCover();
								alertingGeneric.addSuccess("Scenario modificato");
							},
							function(reason){
								alertingGeneric.addWarning("Modifica scenario fallita");
							}
					);
				}else{
				}
			}
		}
		
		self.inviteStudents = function(){
			var emails = extractEmails(self.emailList);
			
			var emailsDTO=[];
			if(emails){
				for(var i=0; i<emails.length; i++){
					emailsDTO.push({"email": emails[i]});
				}
			}
			
			if(emailsDTO && emailsDTO.length>0 && id!=null){
				apiService.addUsersToScenario(emailsDTO,id).then(
						function(data){
							var diff = emailsDTO.length-data.length;
							if(data.length==1){
								if(emailsDTO.length==1)
									alertingGeneric.addSuccess("Studente invitato correttamente");
								else{
									if(diff==1)
										alertingGeneric.addSuccess(data.length+" studente invitato correttamente. (Non e'" +
											"stato possibile invitare "+diff+" studente)");
									else
										alertingGeneric.addSuccess(data.length+" studente invitato correttamente. (Non e'" +
												"stato possibile invitare "+diff+" studenti)");
								}
							}else if(data.length > 1){
								if(diff==0)
									alertingGeneric.addSuccess("Tutti gli studenti sono stati invitati correttamente");
								else{
									if(diff==1)
										alertingGeneric.addSuccess(data.length+" studenti invitati correttamente. (Non e'" +
											"stato possibile invitare "+diff+" studente)");
									else
										alertingGeneric.addSuccess(data.length+" studenti invitati correttamente. (Non e'" +
												"stato possibile invitare "+diff+" studenti)");
								}
									
							}
							for(var i=0; i<data.length; i++){
								if(data[i].firstname!=null){
									data[i].cover = CONSTANTS.urlUserCover(data[i].id);
									if(self.scenarioServer.attendees==null || self.scenarioServer.attendees == "")
										self.scenarioServer.attendees = new Array();
									self.scenarioServer.attendees.push(data[i]);
									self.notAssociatedAttendees.push(angular.copy(data[i]));

								}
								else{
									if(self.scenarioServer.invited==null || self.scenarioServer.invited == "")
										self.scenarioServer.invited = new Array();
									self.scenarioServer.invited.push(data[i]);
								}
							}
							self.emailList=null;
							if(data.length>0)
								updateSelectableAttendees();
							else{
								if(emailsDTO.length==1)
									alertingGeneric.addWarning("Non e' stato possibile invitare l'utente associato alla mail inserita");
								else
									alertingGeneric.addWarning("Non e' stato possibile invitare nessuno degli utenti associati alle mail inserite");

							}
						},
						function(reason){
							console.log(reason);
						}
				);
			}else{
				alertingGeneric.addWarning("Inserire almeno una email valida");
				self.emailList=null;
			}
		}
		
		self.uploadCover = function(file){
			if(file && file.length){
				Upload.upload({
		            url: CONSTANTS.urlScenarioCover(id),
		            headers : {
		                'Content-Type': file.type
		            },
		            file: file
		        })
//		            .progress(function (evt) {
//		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//		        })
		        .success(function (data, status, headers, config) {
		            var date = new Date();
		            self.scenarioCover = CONSTANTS.urlScenarioCover(id)+"?"+date.toString() ;
		        });
			}
		}
		
		self.uploadCharacterCover = function(file,event,idCharacter){
			if(file && file.length && idCharacter){
				Upload.upload({
		            url: CONSTANTS.urlCharacterCover(id,idCharacter),
		            headers : {
		                'Content-Type': file.type
		            },
		            file: file
		        })
//		            .progress(function (evt) {
//		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//		        })
		        .success(function (data, status, headers, config) {
		            for(var i=0; i<self.scenario.characters.length; i++){
		            	if(self.scenario.characters[i].id==idCharacter){
		            		var d = new Date();
		            		self.scenario.characters[i].cover = CONSTANTS.urlCharacterCover(id, idCharacter)+"?"+d.toString();
		            	}
		            }
		        });
			}
		}
		
		self.addCharacter = function(){
			if(self.newCharacter && self.newCharacter.name.length>2){
				apiService.addCharacterToScenario(self.newCharacter,id).then(
						function(data){
							var name = angular.copy(self.newCharacter.name);
							self.newCharacter.id = data.id;
							//self.newCharacter.status=false;
							if(self.scenario.characters==null || self.scenario.characters=="")
								self.scenario.characters= new Array();
							self.newCharacter.cover = CONSTANTS.urlCharacterCover(id,self.newCharacter.id);
							self.newCharacter.isOpen=false;
							self.newCharacter.isSync=false;
							self.scenario.characters.push(angular.copy(self.newCharacter));
							self.newCharacter.isOpen=null;
							self.newCharacter.isSync=null;
							self.newCharacter.bornDate = {};
							self.newCharacter.bornDate.afterChrist = true;
							self.newCharacter.deadDate = {};
							self.newCharacter.deadDate.afterChrist = true;
							self.charactersServer.push(angular.copy(self.newCharacter));
							self.currentCharacters.push(angular.copy(self.newCharacter));
							self.notAssociatedCharacters.push(angular.copy(self.newCharacter));
							self.newCharacter.cover = null;
							self.newCharacter.name = "";
							self.newCharacter.id = null;
							alertingGeneric.addSuccess("Il personaggio " + name +" e' stato creato correttamente");
							
						},
						function(reason){
							alertingGeneric.addWarning("Non è stato possibile creare il personaggio " + self.newCharacter.name);
						}
				);
			}
		}
		
		var getCharacter = function(i){
			var c = $q.defer();
			if(!self.charactersServer[i].isSync){
				apiService.getCharacter(id, self.charactersServer[i].id).then(
						function(data){
							var oldIsOpen = self.charactersServer[i].isOpen;
							self.charactersServer[i] = data;
							self.charactersServer[i].isSync=true;
							self.charactersServer[i].isOpen = oldIsOpen;
							c.resolve(data);
						},
						function(reason){
							self.charactersServer[i].isSync=false;
							c.reject();
						}
				);
				return c.promise;
			}
			else 
				return c.resolve(self.charactersServer[i]);
		}
		
		var syncCurrentCharacter = function(i, c){
			current = angular.copy(c);

			self.currentCharacters[i].name = current.name;
			self.currentCharacters[i].nickname = current.nickname;
			self.currentCharacters[i].bornDate = current.bornDate;
			self.currentCharacters[i].deadDate = current.deadDate;
			self.currentCharacters[i].bornTown = current.bornTown;
			self.currentCharacters[i].deadTown = current.deadTown;
			self.currentCharacters[i].description = current.description;
			self.currentCharacters[i].quote = current.quote;
			self.currentCharacters[i].gender = current.gender;
			self.currentCharacters[i].role = current.role;
			
		}
		
		self.openAccordion = function(i){
			
			if(self.accordionIsDisabled)
				return;
			
			if(currentCharacterIndex!=-1){
				
				if(isUpdatedCharacter(self.currentCharacters[currentCharacterIndex], self.charactersServer[currentCharacterIndex])){
					if(isCurrentCharacterValid(self.currentCharacters[currentCharacterIndex])){
						//va fatta la put delle nuove informazioni ed alla fine va gestito l'aggiornamento del currentCharacter
						
						if(i!=currentCharacterIndex){
							syncCurrentCharacter(i, self.charactersServer[i]);
						}
						var charDTO = angular.copy(self.currentCharacters[currentCharacterIndex]);
						checkHistoricalDate(charDTO);
						apiService.updateCharacter(id, charDTO , self.charactersServer[currentCharacterIndex].id).then(
								function(data){
									self.charactersServer[currentCharacterIndex] = data;
									var cover = angular.copy(self.scenario.characters[currentCharacterIndex].cover);
									self.scenario.characters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
									self.scenario.characters[currentCharacterIndex].cover = cover;
									if(!data.bornDate){
										self.scenario.characters[currentCharacterIndex].bornDate = {};
										self.scenario.characters[currentCharacterIndex].bornDate.afterChrist = true;
									}
									if(!data.deadDate){
										self.scenario.characters[currentCharacterIndex].deadDate = {};
										self.scenario.characters[currentCharacterIndex].deadDate.afterChrist = true;
									}
									
									if(self.scenario.characters[currentCharacterIndex].userId!=null){
										for(var k=0; i<self.associations.length; k++){
											if(self.associations[k].character.id==self.scenario.characters[currentCharacterIndex].id){
												self.associations[k].character.name=self.scenario.characters[currentCharacterIndex].name;
												break;
											}
							
										}
									}else{
										for(var j=0; j<self.notAssociatedCharacters.length; j++){
											if(self.notAssociatedCharacters[j].id==self.scenario.characters[currentCharacterIndex].id){
												self.notAssociatedCharacters[j].name=self.scenario.characters[currentCharacterIndex].name;
												break;
											}
							
										}
									}
									if(currentCharacterIndex!=i)
										currentCharacterIndex=i;
									else
										currentCharacterIndex=-1;
									alertingGeneric.addSuccess("Il personaggio " + data.name + " e' stato modificato correttamente");
									
								}
							,function(reason){
								alertingGeneric.addWarning("Non e' stato possibile modificare il personaggio ");
								var cover = angular.copy(self.currentCharacters[currentCharacterIndex].cover);
								var date = 
								self.currentCharacters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
								self.currentCharacters[currentCharacterIndex].cover = cover;
							}
						);
					}else{ //la validazione delle info digitate è fallita
						//TODO
						alertingGeneric.addWarning("Non e' stato possibile modificare il personaggio");
						var cover = angular.copy(self.currentCharacters[currentCharacterIndex].cover);
						self.currentCharacters[currentCharacterIndex] = angular.copy(self.charactersServer[currentCharacterIndex]);
						self.currentCharacters[currentCharacterIndex].cover = cover;
						
						if(currentCharacterIndex!=i)
							currentCharacterIndex=i;
						else
							currentCharacterIndex=-1;
					}
				}else{ 
					//TODO il current character non differisce rispetto alle info che sono sul server quindi non è necessario fare la put sul server
					/*TO CONTINUE*/
					if(currentCharacterIndex!=i)
						currentCharacterIndex=i;
					else
						currentCharacterIndex=-1;
				}
			}else{
				//si tratta della prima apertura dell'accordion in questa istanza dello state
				currentCharacterIndex=i;
			}
		}
		
		var checkHistoricalDate = function(charDTO){
			
			if(charDTO.bornDate && !charDTO.bornDate.year && !charDTO.bornDate.month && !charDTO.bornDate.day)
				charDTO.bornDate = null;
			if(charDTO.deadDate && !charDTO.deadDate.year && !charDTO.deadDate.month && !charDTO.deadDate.day)
				charDTO.deadDate = null;
		}
		
		self.addCollaborator = function(){
			
			
			apiService.addCollaboratorToScenario(self.selectedCollaborator.id, id).then(
					function(data){
							if(self.scenarioServer.collaborators==null)
								self.scenarioServer.collaborators = new Array();
							self.scenarioServer.collaborators.push(data);
							self.selectedCollaborator="";
							if(self.scenario.collaborators==null)
								self.scenario.collaborators = new Array();
							self.scenario.collaborators.push(angular.copy(data));
							if(self.notAssociatedAttendees==null)
								self.notAssociatedAttendees = new Array();
							var newCollaborator = angular.copy(data);
							alertingGeneric.addSuccess(newCollaborator.firstname + " "+ newCollaborator.lastname +" aggiunto correttamente");
							newCollaborator.cover = CONSTANTS.urlUserCover(data.id);
							self.notAssociatedAttendees.push(newCollaborator);
						}, 
					function(reason){
							alertingGeneric.addWarning("Errore nell'aggiunta del collaboratore. Operazione consentita solo al creatore dello scenario.");
					});
		}
		
		self.addAttendee = function(attendee){
			var emailsDTO = [];
			emailsDTO.push({"email": attendee.email});
			
			//utilizzo la addUsersToScenario passandogli un vettore che contiene una sola email 
			apiService.addUsersToScenario(emailsDTO,id).then(
					function(data){
						for(var i=0; i<data.length; i++){
							if(data[i].firstname!=null){
								data[i].cover=CONSTANTS.urlUserCover(data[i].id);
								if(self.scenarioServer.attendees==null || self.scenarioServer.attendees == "")
									self.scenarioServer.attendees = new Array();
								self.scenarioServer.attendees.push(data[i]);
								self.notAssociatedAttendees.push(angular.copy(data[i]));
							}
							else{
								if(self.scenarioServer.invited==null || self.scenarioServer.invited == "")
									self.scenarioServer.invited = new Array();
								self.scenarioServer.invited.push(data[i]);
							}
						}
						self.emailList=null;
						self.selectedUser="";
						alertingGeneric.addSuccess(attendee.firstname + " "+ attendee.lastname +" aggiunto correttamente");
						for(var j=0; j<self.selectableStudents.length; j++){
							if(self.selectableStudents[j].id==attendee.id){
								self.selectableStudents.splice(j,1);
							}
								
						}
					},
					function(reason){
						if(emailsDTO.length==1)
							alertingGeneric.addWarning("Errore nell'aggiunta del partecipante");
						
						
					}
			);
			
		}
		
		self.enterInScenario = function(){
			self.exitWizard();
			$state.go("logged.scenario.posts", {id : id});
		}
		
		self.deleteAttendee = function(s){
			apiService.removeUserFromScenario(id, s.id).then(
					function(data){
						for(var i=0; i<self.scenarioServer.attendees.length; i++){
							if(self.scenarioServer.attendees[i].id==s.id){
								self.scenarioServer.attendees.splice(i,1);
								self.scenario.attendees.splice(i,1);
							}
						}
						reInsertInSelectable(s);
						manageAssociationOnAttendeeDeletion(s);
					},
					function(reason){
						alertingGeneric.addWarning("Errore nella rimozione del partecipante.");
						console.log("Delete attendee failed: "+reason);
					}
			)
		}
		
		self.removeJournalist = function(){
			apiService.removeUserFromJournalist(self.scenario.id).then(
					function(data){
						
						self.allPeopleInScenario.push(self.actualJournalist);
						self.actualJournalist=null;
					},
					function(reason){
						alertingGeneric.addWarning("Errore nella rimozione del giornalista.");
						console.log("Delete journalist failed: "+reason);
					}
			)
		}
		
		
		self.deleteCollaborator = function(c){
			apiService.removeCollaboratorFromScenario(id, c.id, false).then(
					function(data){
						for(var i=0; i<self.scenarioServer.collaborators.length; i++){
							if(self.scenarioServer.collaborators[i].id==c.id)
								self.scenarioServer.collaborators.splice(i,1);
							if(self.scenario.collaborators[i].id==c.id)
								self.scenario.collaborators.splice(i,1);
						}
						manageAssociationOnAttendeeDeletion(c);
						//reInsertInSelectableCollaborators(c);
					},
					function(reason){
						alertingGeneric.addWarning("Errore nella rimozione del collaboratore. Operazione consentita solo al creatore dello scenario.");
						console.log("Delete collaborator failed: "+reason);
					}
			)
		}
		
		self.deleteInvited = function(s){
			apiService.removeUserFromScenario(id, s.id).then(
					function(data){
						for(var i=0; i<self.scenarioServer.invited.length; i++){
							if(self.scenarioServer.invited[i].id==s.id)
								self.scenarioServer.invited.splice(i,1);
						}
					},
					function(reason){
						console.log("Delete invited user failed: "+reason);
					}
			)
		}
		
		
		self.deleteCharacter = function(c){
			apiService.removeCharacterFromScenario(id, c.id).then(
					function(data){
						for(var i=0; i<self.scenario.characters.length; i++){
							if(self.scenario.characters[i].id==c.id){
								self.scenario.characters.splice(i,1);
								self.charactersServer.splice(i,1);
								self.currentCharacters.splice(i,1);
								/*TODO valutares*/
								self.scenarioServer.characters.splice(i,1);
								manageAssociationOnCharacterDeletion(c);
								currentCharacterIndex = -1;
							}
						}
					},
					function(reason){
						console.log("Delete character failed: "+reason);
					}
			);
		}
		
		var manageAssociationOnAttendeeDeletion = function(a){
			if(self.notAssociatedAttendees){
				for(var j=0; j<self.notAssociatedAttendees.length; j++){
					if(self.notAssociatedAttendees[j].id==a.id){
						self.notAssociatedAttendees.splice(j,1);
						return;
					}
				}
			}
			if(self.associations){
				for(var i=0; i<self.associations.length; i++){
					if(self.associations[i].attendee.id==a.id){
						self.notAssociatedCharacters.push(self.associations[i].character);
						self.associations.splice(i,1);
						break;
					}
				}
			}
		}
		
		
		var manageAssociationOnCharacterDeletion = function(c){
			if(self.notAssociatedCharacters){
				for(var j=0; j<self.notAssociatedCharacters.length; j++){
					if(self.notAssociatedCharacters[j].id==c.id){
						self.notAssociatedCharacters.splice(j,1);
						return;
					}
				}
			}
			if(self.associations){
				for(var i=0; i<self.associations.length; i++){
					if(self.associations[i].character.id==c.id){
						self.notAssociatedAttendees.push(self.associations[i].attendee);
						self.associations.splice(i,1);
						break;
					}
				}
			}
		}
		
		/*Variabile temporanea utilizzata dal drag & drop per tenere traccia dell'ultima card presa*/
		var dragged;
		self.associations = new Array();
		
		self.createAssociationWithoutDrag = function(){
			var association = {};
			association.attendee = self.lastUserClicked;
			association.character = self.lastCharacterClicked;
			
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						/*TODO allineare charactersServer*/
						self.associations.push(angular.copy(association));
						
						if(self.notAssociatedAttendees){
							for(var i=0; i<self.notAssociatedAttendees.length; i++){
								if(self.notAssociatedAttendees[i].id == association.attendee.id){
									self.notAssociatedAttendees.splice(i,1);
									break;
								}
							}
						}
						if(self.notAssociatedCharacters){
							for(var i=0; i<self.notAssociatedCharacters.length; i++){
								if(self.notAssociatedCharacters[i].id == association.character.id){
									self.notAssociatedCharacters.splice(i,1);
									break;
								}
							}
						}
						
						
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		self.dropSuccessHandlerCharacter =function($event, indexAttendee){

			var association = {};
			association.attendee = self.notAssociatedAttendees[indexAttendee];
			association.character = self.notAssociatedCharacters[dragged];
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						/*TODO allineare charactersServer*/
						self.associations.push(angular.copy(association));
						self.notAssociatedAttendees.splice(indexAttendee,1);
						self.notAssociatedCharacters.splice(dragged,1);
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		self.dropSuccessHandlerAttendee =function($event, indexCharacter){

			var association = {};
			association.attendee = self.notAssociatedAttendees[dragged];
			association.character = self.notAssociatedCharacters[indexCharacter];
			
			apiService.addUserToCharacter(id, association.attendee.id, association.character.id).then(
					function(data){
						self.associations.push(angular.copy(association));
						self.notAssociatedAttendees.splice(dragged,1);
						self.notAssociatedCharacters.splice(indexCharacter,1);
					},
					function(reason){
						console.log("Association failed: "+reason);
					}
			);
		}
		
		/*index --> dove vado*/
		self.onDrop = function($event, $data, index){
	
			dragged = index;
		}
		
		self.removeAssociation =  function(a){
			var character = a.character;
			var attendee = a.attendee;
			for(var i=0; i<self.associations.length; i++){
				if(self.associations[i].attendee.id==a.attendee.id){
					apiService.removeUserFromCharacter(id, attendee.id, character.id).then(
							function(data){
								self.notAssociatedAttendees.push(attendee);
								self.notAssociatedCharacters.push(character);
								self.associations.splice(i,1);
							},
							function(reason){
								console.log("Removing asssociation failed:" +reason);
							}
					);
					break;
				}
			}
		}
		
		self.openScenario = function(){
			self.exitWizard();
			var scenarioDTO = {"status": "ACTIVE"};
			scenarioDTO.showRelationsToAll = self.scenario.showRelationsToAll;
			scenarioDTO.newspaperEnabled = self.scenario.newspaperEnabled;
			apiService.updateScenario(scenarioDTO, id).then(
					function(data){
						self.scenarioServer=data;
						$state.go("logged.scenario.posts", {id : id});
					},
					function(reason){
						console.log("C'è stato un problema, impossibile attivare lo scenario");
					}
			);
		}
		
		self.closeScenario = function(){
			self.exitWizard();
		}
		
		self.suspendScenario = function(){
			console.log("sospensione scenario da implementare");
		}
		
		
		
		self.showPopUpSetDate = function(flagFirst){
			modalService.showPopUpSetDate(self.scenario, flagFirst);
		}
		self.isStudent = function(s){
			if(s.type== 'Student')
				return true;
			else return false;
		}
		
		self.uploadMap = function(file){
			if(file && file.length){
				Upload.upload({
		            url: CONSTANTS.urlPostMedia(self.scenario.id),
		            headers : {
		                'Content-Type': file.type
		            },
		            file: file
		        })
//		            .progress(function (evt) {
//		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//		            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//		        })
		        .success(function (data, status, headers, config) {
		            self.scenario.history.mapId = data.id;
		            var scenarioDTO = {};
		            scenarioDTO.history = {};
		            scenarioDTO.history.mapId = data.id;
		            apiService.updateScenario(scenarioDTO, self.scenario.id).then(
		            		function(data){
		            			self.scenarioServer = data;
		            		},
		            		function(reason){
		            			console.log("ERROR UPLOAD MAP");
		            		}
		            );
		            var date = new Date();
		            self.map = CONSTANTS.urlMedia(data.id)+"?"+date.toString() ;
		        });
			}
		}
		
		self.showDeadDatePicker = false;
		self.switchShowDeadDate = function(){
			if(!self.showDeadDatePicker && self.showBornDatePicker){
				self.showBornDatePicker = false;
			}
			self.showDeadDatePicker = !self.showDeadDatePicker;
		}
		
		self.showBornDatePicker = false;
		self.switchShowBornDate = function(){
			if(!self.showBornDatePicker && self.showDeadDatePicker){
				self.showDeadDatePicker = false;
			}
			self.showBornDatePicker = !self.showBornDatePicker;
		}
		
		self.hideDatePicker = function(){
			self.showDeadDatePicker = false;
			self.showBornDatePicker = false;
		}
		
		
/*--------------------------------------UTILITY----------------------------------------------------*/
		
		var onStartup = function(){
			var path = $location.path();
			var tabString = path.substr(path.lastIndexOf('/') + 1);
			if(tabString=="info"){
				tab=0;
			}else if(tabString=="partecipanti"){
				tab=1;
			}else if(tabString=="personaggi"){
				tab=2;
			}else if(tabString=="associazioni"){
				tab=3;
			}else if(tabString=="collaboratori"){
				tab=4;
			}else if(tabString=="giornale"){
				tab=5;
			}
		}
		
		self.checkOpenAccordion = function(){
			if(self.scenario.characters){
				for(var i=0; i<self.scenario.characters.length; i++){
					if(self.scenario.characters[i].isOpen){
						self.openAccordion(i);
						break;
					}
				}
			}
		}
		
		var updateAllPeopleInScenario = function(){
			self.allPeopleInScenario=[];
			self.allPeopleInScenario = self.allPeopleInScenario.concat(self.notAssociatedAttendees);
			if(self.associations!=null){
				for(var i=0; i<self.associations.length; i++){
					self.allPeopleInScenario.push(self.associations[i].attendee);
				}
			}
		}
		
		self.changeStateTab = function(newDestination){
			if(newDestination==5)
				updateAllPeopleInScenario();
			switch(tab){
				case 0 : {
					tab = newDestination;
					self.saveInfo();
					break;
				}
				case 1 : {
					tab = newDestination;				
					break;
				}
				case 2: {
					self.checkOpenAccordion();
					tab = newDestination;					
					break;
				}
				case 3: {
					tab = newDestination;
					break;
				}
				case 4: {
					tab = newDestination;
					break;
				}
				case 5: {
					tab = newDestination;
					break;
				}
			}
		}
		
		var isEquivalent =  function(a, b) {
	
			if(a.name != b.name){
				return false;
			}
			if( a.description != b.description){
				return false;
			}
				
			r = angular.equals(a.history.startDate, b.history.startDate);
			
			if (r == false){
				return false;
			}
			r = angular.equals(a.history.endDate, b.history.endDate);
			if (r == false){
				return false;
			}
			
			if( a.showRelationsToAll != b.showRelationsToAll){
				return false;
			}
			if( a.newspaperEnabled != b.newspaperEnabled){
				return false;
			}
			

			return true;

		}
		var dateValidate = function(){
			
			//controllo se data inizio è valida
			if(self.scenario.history && self.scenario.history.startDate.year && !checkDate(self.scenario.history.startDate.year) ){
				alertingGeneric.addWarning("Data non valida");
				self.scenario = angular.copy(self.scenarioServer);
				
				return false;
			}
			//controllo se la data fine è valida
			if(self.scenario.history && self.scenario.history.endDate.year && !checkDate(self.scenario.history.endDate.year)){
				alertingGeneric.addWarning("Data non valida");
				self.scenario = angular.copy(self.scenarioServer);
				
				return false;
			}
			
			//controllo che data fine non preceda data inizio
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate ){
				

				if (!checkIfEndIsAfterStart(self.scenario.history.startDate , self.scenario.history.endDate )){
					self.scenario = angular.copy(self.scenarioServer);
					
					return false;
				}
					
			}
			return true;
		}
		
		
		var infoValidate = function(){
			
			//valido le date 
			if (!dateValidate())
				return false;
			
			var ret=true;
			
			if(!self.scenario.name || self.scenario.name.length<2){
				
				alertingGeneric.addWarning("Il nome dello scenario deve essere di almeno 2 caratteri");
				ret=false;
				self.scenario= angular.copy(self.scenarioServer);
				
			}
//			if(!self.scenario.description){
//				if(self.scenarioServer.description){
//					self.scenario.description=angular.copy(self.scenarioServer.description);
//				}else{
//					self.scenario.description="";
//				}
//			}
			
			if(self.scenario.history && self.scenario.history.startDate){
				if(!self.scenario.history.startDate.afterChrist && (parseInt(self.scenario.history.startDate.year)>4712)){   
					alertingGeneric.addWarning("La minima data rappresentabile e': 1 gennaio 4712 AC");
					return false;
				}
			}
			
			if(!self.scenario.history || !self.scenario.history.startDate){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.startDate){
					self.scenario.history.startDate=angular.copy(self.scenarioServer.history.startDate);
				}else{
					self.scenario.history.startDate="";
				}
			}
			if(!self.scenario.history || !self.scenario.history.endDate){
				ret=false;
				if(self.scenarioServer.history && self.scenarioServer.history.endDate){
					self.scenario.history.endDate=angular.copy(self.scenarioServer.history.endDate);
				}else{
					self.scenario.history.endDate="";
				}
			}
			if(self.scenario.history && self.scenario.history.startDate && self.scenario.history.endDate){
				if(self.scenario.history.startDate>self.scenario.history.endDate){
					ret=false;
					if(self.scenarioServer.history && self.scenarioServer.history.endDate){
						self.scenario.history.endDate=angular.copy(self.scenarioServer.history.endDate);
					}else{
						self.scenario.history.endDate="";
					}
					if(self.scenarioServer.history && self.scenarioServer.history.startDate){
						self.scenario.history.startDate=angular.copy(self.scenarioServer.history.startDate);
					}else{
						self.scenario.history.startDate="";
					}
				}
			}
				
			
			return ret;
		}
		
		
		var checkIfEndIsAfterStart = function(startDate, endDate){
			if(startDate.afterChrist && endDate.afterChrist){  //entrambe dopo cristo
				if(startDate.year > endDate.year){  //startDate.year > endDate.year ERR
					alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
					return false;
				}else if (startDate.year < endDate.year){ //startDate.year < endDate.year GOOD
					return true;
				}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
					if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
						alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
						return false;
					}else if(
						startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
						return true;
					}
					else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
						if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
							alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
							return false;
						}
						else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
							return true;
						}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
							return true;
						}
					}
				}
					
			}
			else if(!startDate.afterChrist && !endDate.afterChrist){  //entrambe avanti cristo
				if(startDate.year < endDate.year){  //startDate.year < endDate.year ERR
					alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
					return false;
				}else if (startDate.year > endDate.year){ //startDate.year > endDate.year GOOD
					return true;
				}else{   //data inizio e fine hanno lo stesso anno, quindi guardo al mese!
					if(startDate.month > endDate.month){  //startDate.month > endDate.month ERR
						alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
						return false;
					}else if(startDate.month < endDate.month){ //startDate.month < endDate.month GOOD
						return true;
					}else{  //data inizio e data fine hanno stesso anno e stesso mese, quindi guardo al giorno
						if(startDate.day > endDate.day){  //startDate.day > endDate.day ERR
							alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
							return false;
						}
						else if(startDate.day < endDate.day){ //startDate.day < endDate.day GOOD
							return true;
						}else{   //data inizio e data fine hanno stesso anno, mese e giorno GOOD
							return true;
						}
					}
				}
			}
			else if(!startDate.afterChrist && endDate.afterChrist){   //inizio a.c. e fine d.c.  SICURAMENTE BUONO
				return true;
			}
			else{																				//inizio d.c. e fine a.c. SICURAMENTE ERRATO
				alertingGeneric.addWarning("La data di inizio deve precedere quella di fine");
				return false;
			}
		}

		var extractEmails = function(text){
		    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		}	
		
		var isUpdatedCharacter = function(newChar, oldChar){
			
			if(newChar.name!=oldChar.name)
				return true;
			if(newChar.nickname!=oldChar.nickname)
				return true;
			
			if(newChar.bornDate && oldChar.bornDate){
				if(newChar.bornDate.day!=oldChar.bornDate.day)
					return true;
				if(newChar.bornDate.month!=oldChar.bornDate.month)
					return true;
				if(newChar.bornDate.year!=oldChar.bornDate.year)
					return true;
				if(newChar.bornDate.afterChrist!=oldChar.bornDate.afterChrist)
					return true;
				
			}if(newChar.deadDate && oldChar.deadDate){
				if(newChar.deadDate.day!=oldChar.deadDate.day)
					return true;
				if(newChar.deadDate.month!=oldChar.deadDate.month)
					return true;
				if(newChar.deadDate.year!=oldChar.deadDate.year)
					return true;
				if(newChar.deadDate.afterChrist!=oldChar.deadDate.afterChrist)
					return true;
			}
			
			if(newChar.bornTown!=oldChar.bornTown)
				return true;
			if(newChar.deadTown!=oldChar.deadTown)
				return true;
			if(newChar.description!=oldChar.description)
				return true;
			if(newChar.quote!=oldChar.quote)
				return true;
			if(newChar.gender!=oldChar.gender)
				return true;
			if(newChar.role!=oldChar.role)
				return true;
			
			return false;
		}
		
		var isCurrentCharacterValid = function(char){
			
			if(char.deadDate.year && !checkDate(char.deadDate.year))
				return false;
			if(char.bornDate.year && !checkDate(char.bornDate.year))
				return false;
			if(char.deadDate && char.bornDate && char.deadDate.year && char.bornDate.year){
				if(!checkIfEndIsAfterStart(char.bornDate, char.deadDate)){
					return false;
				}
			}
			return true;
		}
		
		var checkDate = function(year){
			if(isNaN(year)){
				return false;
			}else{
				return true;
			}  
		}

		onStartup();

}]);
	

angular.module('smiled.application').controller('scenariosListCtrl', 
		['loggedUser', 'CONSTANTS', 'modalService', 
		 function scenariosListCtrl(loggedUser,CONSTANTS,modalService){
	
	var self = this;
	self.user = loggedUser;
	
	self.realDateWithHour = CONSTANTS.realDateFormatWithHour;
	self.realDateWithoutHour = CONSTANTS.realDateFormatWithoutHour;
	
	
	self.showPopUpCreationScenario = function (){
		modalService.showModalCreateScen();
	};
}]);
angular.module('smiled.application').controller('secondTemplateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state',
              function secondTemplateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state){
	
	
	var self = this;
	var idTemplate = article.getIdCurrentTemplate();
	
}]);
angular.module('smiled.application').controller('setPasswordCtrl', ['userService', '$state', 'alertingRegistration', '$timeout',
                                                                 function setPasswordCtrl(userService, $state, alertingRegistration, $timeout){

	var self = this;
	self.user= {};
	
	self.dateOptions = {
			"regional" : "it",
			"changeYear" : true,
			"maxDate" : "0",
			"minDate" : new Date(1900,0,1,0,0,0,0),
			"yearRange" : "1900:c"
	};
	
	self.confirmRegister = function (){

		if(validateRegister()){
			userService.changeFirstPassword(self.user).then(
					function(data){
						//il server ha accettato il cambio della password
						console.log("success register");
						self.user.email="";
						self.user.firstname="";
						self.user.lastname="";
						self.user.bornDate="";
						self.user.newPassword="";
						self.user.confirmPassword="";
						alertingRegistration.addSuccess("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
						$timeout(function(){
							
							$state.go('notLogged.login');
						}, 5000);
					
					},
					//il server ha rifiutato la registrazione
					function(reason){ 
						self.user.email="";
						self.user.firstname="";
						self.user.lastname="";
						self.user.bornDate="";
						self.user.oldPassword="";
						self.user.newPassword="";
						self.user.confirmPassword="";
						alertingRegistration.addDanger("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						throw new Error ("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						
						
					}
			);
		//la validazione lato client è fallita
		}else{
			self.user.oldPassword="";
			self.user.newPassword="";
			self.user.confirmPassword="";
		}
	}
	var validateRegister = function(){

		if(self.user.email==null || self.user.email=="" || self.user.firstname==null || self.user.firstname=="" || 
				self.user.lastname==null || self.user.lastname=="" || self.user.oldPassword==null || self.user.oldPassword=="" || self.user.newPassword==null ||
				self.user.newPassword=="" || self.user.confirmPassword==null || self.user.confirmPassword==""){
			alertingRegistration.addWarning("Compilare tutti i campi!");
			return false;
		}
		else if(!validateEmail(self.user.email)){
			alertingRegistration.addWarning("Email non valida!");
			return false;
		}
		else if(self.user.newPassword!=self.user.confirmPassword){
			alertingRegistration.addWarning("Attenzione le due password digitate non corrispondono!");
			return false;
		}
		else if(self.user.newPassword.length<8){
			alertingRegistration.addWarning("Nuova password troppo corta!");
			return false;
		}
		else if(self.user.oldPassword.length<8){
			alertingRegistration.addWarning("Vecchia password troppo corta!");
			return false;
		}
		else
			return true;
	}
	
	var validateEmail = function (email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(email);
	}
	

}]);
angular.module('smiled.application').controller('shellCtrl', ['$scope', '$location' ,'userService', '$state',
         function shellCtrl($scope, $location, userService,$state){
	
	if(!userService.isLogged){
		$state.go("login");
	}else{
		switch($location.path()){
			case "/":
				$state.go("logged");
				break;
			case "/dashboard":
				$state.go("logged");
				break;
			default:
				$state.go("notFound");
		}
	}
}]);



angular.module('smiled.application').controller('singlePostCtrl', ['$state', '$stateParams', 'CONSTANTS', '$scope', 'apiService', 'Upload','$interval','notifyService',
              function singlePostCtrl($state, $stateParams, CONSTANTS, $scope, apiService,Upload,$interval, notifyService){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.currentCharacter = $scope.scenario.currentCharacter;
	self.post={};
	var idPost =$stateParams.idPost;
	var scenId = $stateParams.id;
	self.postReady=false;
	
	var onStartup = function (){
		
		if(!scenId || scenId==""){
			$state.go('logged.dashboard');
		}else if(!idPost || idPost==""){
			$state.go('logged.scenario.posts', {"id":scenId});
		}else{
			self.post= apiService.getSingleStatus(scenId, idPost).then(
						function(data){
							self.post=data;
							self.postReady=true;
						},function(reason){
							self.post={};
							self.postReady=false;
							console.log("Errore. C'è stato qualche problema nel download del post");
							
						}
			)
		};
		
	}
	
	
	onStartup();
	
}]);
angular.module('smiled.application').controller('studentsListCtrl', ['loggedUser', function studentsListCtrl(loggedUser){
	
	var self = this;
	self.user = loggedUser;
	
}]);
angular.module('smiled.application').controller('toolMapCtrl', ['CONSTANTS',
      function toolMapCtrl(CONSTANTS){

	var self = this;

	self.Win64="MapTool-Windows_x64.zip";
	self.Win32="MapTool-Windows_x86.zip";
	self.Mac="MapTool-MacOSX.zip";
	self.Tux64="MapTool-linux_x64.zip";
	self.Tux32="MapTool-linux_x86.zip";
	
	self.getFile = function(i){
		return  CONSTANTS.urlToolMap(i);
	}
	
}]);
angular.module('smiled.application').controller('updateScenarioCtrl', [ 'apiService', 
                                                              function updateScenarioCtrl(apiService){

	
	var self = this;

	self.scenario = {
			
	};
	var s1 = {};
	var listEmail = {};
	
	function produceListEmail(list){
		l = [];
		return l; 
	}
	
	
	self.showHideContent=function(e){
		var container1 = $("#basicinfobox");
		var container2 = $("#studentsbox");
		var container3 = $("#charactersbox");
		var container4 = $("#associationbox");
		var container5 = $("#collaboratorsbox");

		
		
		if (!container1.is(e.target) && container1.has(e.target).length === 0){
			/*Chiudi il div*/
			self.basicinfoboxOn=false;
			
			if(self.scenario.startDate==null || self.scenario.endDate==null || self.scenario.title==null){
				
			}else{
				s1.title= self.scenario.title;
				s1.startDate = self.scenario.startDate;
				s1.endDate = self.scenario.endDate;
			}
		}else{
			/*Apri il div*/
			self.basicinfoboxOn=true;
		}
		if (!container2.is(e.target) && container2.has(e.target).length === 0){
			/*Chiudi il div*/
			
			if(self.scenario.listEmail==null){
			}else{
				listEmail = produceListEmail(self.scenario.listEmail);
			}
			self.studentsboxOn=false;
		}else{
			/*Apri il div*/
			self.studentsboxOn=true;
		}
		if (!container3.is(e.target) && container3.has(e.target).length === 0){
			/*Chiudi il div*/
			self.charactersboxOn=false;
		}else{
			/*Apri il div*/
			self.charactersboxOn=true;
		}
		if (!container4.is(e.target) && container4.has(e.target).length === 0){
			/*Chiudi il div*/
			self.associationboxOn=false;
		}else{
			/*Apri il div*/
			self.associationboxOn=true;
		}
		if (!container5.is(e.target) && container5.has(e.target).length === 0){
			/*Chiudi il div*/
			self.collaboratorsboxOn=false;
		}else{
			/*Apri il div*/
			self.collaboratorsboxOn=true;
		}
	}
}]);


angular.module('smiled.application').factory('alertingGeneric',['$timeout', function($timeout) {
        
        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger", "arrow_box1"];

        var addWarning = function (message) {
            addAlert("warning", message);
        };

        var addDanger = function (message) {
            addAlert("danger", message);
        };

        var addInfo = function (message) {
            addAlert("info", message);
        };

        var addSuccess = function (message) {
            addAlert("success", message);
        };
        

        var addAlert = function (type, message) {
        	
        	if(currentAlerts.length>0)
        		currentAlerts.splice(0, 1);
  
    		var alert = { type: type, message: message };
    		currentAlerts.push(alert);

    		$timeout(function () {
    			removeAlert(alert);
    		}, 4000);
        	
        };

        var removeAlert = function (alert) {
            for (var i = 0; i < currentAlerts.length; i++) {
                if (currentAlerts[i] === alert) {
                    currentAlerts.splice(i, 1);
                    break;
                }
            }
        };
        
        var removeAllAlerts = function () {
            currentAlerts.length = [];
        };

        var errorHandler = function (description) {
            return function () {
                addDanger(description);
            };
        };
        

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes,
            removeAllAlerts: removeAllAlerts
        };
           

}]);
angular.module("smiled.application").factory('alertingLogin',['$timeout', function($timeout) {
        
        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger"];

        var addWarning = function (message) {
            addAlert("warning", message);
        };

        var addDanger = function (message) {
            addAlert("danger", message);
        };

        var addInfo = function (message) {
            addAlert("info", message);
        };

        var addSuccess = function (message) {
            addAlert("success", message);
        };

        var addAlert = function (type, message) {
        	
        	if(currentAlerts.length==0){
        		var alert = { type: type, message: message };
        		currentAlerts.push(alert);

        		$timeout(function () {
        			removeAlert(alert);
        		}, 5000);
        	}
        };

        var removeAlert = function (alert) {
            for (var i = 0; i < currentAlerts.length; i++) {
                if (currentAlerts[i] === alert) {
                    currentAlerts.splice(i, 1);
                    break;
                }
            }
        };

        var errorHandler = function (description) {
            return function () {
                addDanger(description);
            };
        };

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes
        };
           

}]);
angular.module("smiled.application").factory('alertingRegistration',['$timeout', function($timeout) {
        
        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger"];

        var addWarning = function (message) {
            addAlert("warning", message);
        };

        var addDanger = function (message) {
            addAlert("danger", message);
        };

        var addInfo = function (message) {
            addAlert("info", message);
        };

        var addSuccess = function (message) {
            addAlert("success", message);
        };

		var addAlert = function (type, message) {
		        	
		        	if(currentAlerts.length==0){
		        		var alert = { type: type, message: message };
		        		currentAlerts.push(alert);
		
		        		$timeout(function () {
		        			removeAlert(alert);
		        		}, 5000);
		        	}
		 };

        var removeAlert = function (alert) {
        	
        	 for (var i = 0; i < currentAlerts.length; i++) {
                    if (currentAlerts[i] === alert) {
                        currentAlerts.splice(i, 1);
                        break;
                    }
              }
        	
           
        };

        var errorHandler = function (description) {
            return function () {
                addDanger(description);
            };
        };

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes
        };
           

}]);
angular.module('smiled.application').factory('alertingScenario',['$timeout', '$location', '$anchorScroll',
    function($timeout, $location, $anchorScroll) {
        
        var currentAlerts = [];
        var alertTypes = ["success", "info", "warning", "danger"];

        var addWarning = function (message) {
            addAlert("warning", message);
        };

        var addDanger = function (message) {
            addAlert("danger", message);
        };

        var addInfo = function (message) {
            addAlert("info", message);
        };

        var addSuccess = function (message) {
            addAlert("success", message);
        };

        var addAlert = function (type, message) {
        	
        	if(currentAlerts.length>0)
        		currentAlerts.splice(0, 1);
  
    		var alert = { type: type, message: message };
    		currentAlerts.push(alert);
    		$location.hash("topBox");
			$anchorScroll();
			$location.url($location.path());

    		$timeout(function () {
    			removeAlert(alert);
    		}, 5000);
        	
        };

        var removeAlert = function (alert) {
            for (var i = 0; i < currentAlerts.length; i++) {
                if (currentAlerts[i] === alert) {
                    currentAlerts.splice(i, 1);
                    break;
                }
            }
        };

        var errorHandler = function (description) {
            return function () {
                addDanger(description);
            };
        };

        return {
            addWarning: addWarning,
            addDanger: addDanger,
            addInfo: addInfo,
            addSuccess: addSuccess,
            addAlert: addAlert,
            removeAlert: removeAlert,
            errorHandler: errorHandler,
            currentAlerts: currentAlerts,
            alertTypes: alertTypes
        };
           

}]);
 angular.module('smiled.application').factory('apiService', ['$http', '$q',
                                                            function apiService($http,$q){

	var postRegister = function(registerObject){
		var s = $q.defer();
		$http.post("/api/v1/register", registerObject).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}



	/*-----------------------------------------------------------*/	

	var getScenario = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario).then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}

	var createScenario = function(scenarioDTO){
		var s = $q.defer();
		$http.post("/api/v1/scenarios", scenarioDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var updateScenario = function(scenarioDTO, id){
		var s = $q.defer();
		$http.put("/api/v1/scenarios/"+id, scenarioDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	

	var deleteScenario = function(id){
		var s = $q.defer();
		$http.delete("/api/v1/scenarios/"+id).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var addUsersToScenario = function(emailsDTO, id){
		var e = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/users", emailsDTO).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					e.reject(reason);
				}
		);
		return e.promise;
	}

	var addCollaboratorToScenario = function (idCollaborator, id){
		var e = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/collaborators/"+ idCollaborator).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					console.log(reason);
					e.reject(reason);
				}
		);
		return e.promise;
	}
	

	var addCharacterToScenario = function(character, id){
		var c = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/characters", character).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}

	var updateCharacter = function(id, characterDTO, idCharacter){
		var c = $q.defer();
		$http.put("/api/v1/scenarios/"+id+"/characters/"+idCharacter, characterDTO).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
	
	var getAllCharactersFromScen = function(id){
		var c = $q.defer();

		$http.get("/api/v1/scenarios/"+id+"/characters").then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);

		return c.promise;
	}
	var getCharacter = function(id, idCharacter){
		var c = $q.defer();
		$http.get("/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}

	var removeUserFromScenario = function(id, idUser){
		var u = $q.defer();
		$http.delete("/api/v1/scenarios/"+id+"/users/"+idUser).then(
				function(response){
					u.resolve(response.data);
				},
				function(reason){
					u.reject(reason);
				}
		);
		return u.promise;
	} 

	var removeCollaboratorFromScenario = function(id, idCollaborator, putInAttendeesList){
		var u = $q.defer();
		$http.delete("/api/v1/scenarios/"+id+"/collaborators/"+idCollaborator, putInAttendeesList).then(
				function(response){
					u.resolve(response.data);
				},
				function(reason){
					u.reject(reason);
				}
		);
		return u.promise;
	} 

	var removeCharacterFromScenario = function(id, idCharacter){
		var c = $q.defer();
		$http.delete("/api/v1/scenarios/"+id+"/characters/"+idCharacter).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	} 

	

	var addUserToCharacter = function(id, userId, characterId){
		var c = $q.defer();

		$http.put("/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);

		return c.promise;
	}

	var removeUserFromCharacter = function(id, userId, characterId){
		var c = $q.defer();

		$http.delete("/api/v1/scenarios/"+id+"/characters/"+characterId+"/users/"+userId).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);

		return c.promise;
	}

	/* -------------- GESTIONE DEI POST----------------- */	

	var sendStatus = function(id, idCharacter, status){
		var s = $q.defer();
		$http.post("/api/v1/scenarios/"+id+"/characters/"+idCharacter+"/status", status).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var updateStatus = function(id, idStatus, newStatus){
		var s = $q.defer();
		$http.put("/api/v1/scenarios/"+id+"/status/"+idStatus, newStatus).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var updateEvent = function(id, idEvent, newEvent){
		var s = $q.defer();
		$http.put("/api/v1/scenarios/"+id+"/events/"+idEvent, newEvent).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var deletePost = function(id, idPost){
		var s = $q.defer();
		$http.delete("/api/v1/scenarios/"+id+"/posts/"+idPost).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var getPagedPosts = function(id, nPag, nItem, historicalOrder, orderDesc){
		
		if(typeof orderDesc === 'undefined'){ 
			orderDesc = true; 
		}
		
		var c = $q.defer();

		$http.get("/api/v1/scenarios/"+id+"/paged-posts", {
			params: { "nPag": nPag, "nItem": nItem, "historicOrder": historicalOrder, "orderDesc" : orderDesc }}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	
	var getLastPosts = function(id, lastPostId, nItem){
	
		var c = $q.defer();

		$http.get("/api/v1/scenarios/"+id+"/posts", {
			params: { "last": lastPostId, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getLastHistoricPosts = function(id, nItem, order, date, time){
		var first=false;
		if(typeof date === 'undefined'){ 
			first = true; 
		}
		var c = $q.defer();

		if(first){
			$http.get("/api/v1/scenarios/"+id+"/historic-posts", {
				params: {"nItem": nItem, "orderDesc": order}}).then(
						function(response){
							c.resolve(response.data);
						},
						function(reason){
							c.reject(reason);
						}
				);
		}else{
			$http.get("/api/v1/scenarios/"+id+"/historic-posts", {
				params: {"nItem": nItem, "orderDesc": order, "date": date, "time":time}}).then(
						function(response){
							c.resolve(response.data);
						},
						function(reason){
							c.reject(reason);
						}
				);
		}

		return c.promise;
	}
	
	var getLastCharacterPosts = function(scenarioId, characterId, nItem, date, time){
		var first=false;
		if(typeof date === 'undefined'){ 
			first = true; 
		}
		var c = $q.defer();

		if(first){
			$http.get("/api/v1/scenarios/"+scenarioId+"/characters/"+characterId+"/posts", {
				params: {"nItem": nItem}}).then(
						function(response){
							c.resolve(response.data);
						},
						function(reason){
							c.reject(reason);
						}
				);
		}else{
			$http.get("/api/v1/scenarios/"+scenarioId+"/characters/"+characterId+"/posts", {
				params: {"nItem": nItem, "date": date, "time":time}}).then(
						function(response){
							c.resolve(response.data);
						},
						function(reason){
							c.reject(reason);
						}
				);
		}

		return c.promise;
	}
	
	
	var getListOfNewPosts = function(id, listOfPosts){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+id+"/newPosts", listOfPosts).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	
	
	var getPagedRegistrationRequests = function(nPag, nItem){
		
		var c = $q.defer();

		$http.get("/api/v1/getPagedRegistrationRequests", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedLogs = function(start, end, type, nPag, nItem, idUser, idScenario){
		
		var c = $q.defer();
        var s=null; 
        var e = null;
		if(start!=null)
			s=start.getTime();
		if(end!=null)
			e=end.getTime();
		$http.get("/api/v1/log", {
			params: { "start" : s, "end" : e, 
				      "type" : type, "nPag": nPag, "nItem": nItem, "idUser":idUser, "idScenario":idScenario}})
				    .then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedIssues = function(nPag, nItem){
		
		var c = $q.defer();

		$http.get("/api/v1/issues", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedSuggestions = function(nPag, nItem){
		
		var c = $q.defer();

		$http.get("/api/v1/suggestions", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getUsersByFirstNameAndLastName = function(firstName, lastName){
		var c = $q.defer();

		$http.get("/api/v1/userScenarios", {
			params: { "firstName": firstName, "lastName": lastName}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}

	var getPagedTeachers = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/teachers", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedStudents = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/students", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedScenarios = function(nPag, nItem, orderByCreation){
		var c = $q.defer();

		$http.get("/api/v1/scenarios", {
			params: { "nPag": nPag, "nItem": nItem, "orderByCreation": orderByCreation}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedExceptions = function(nPag, nItem){
		var c = $q.defer();

		$http.get("/api/v1/clientException", {
			params: { "nPag": nPag, "nItem": nItem}}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}
	
	var getPagedTeacherByRegex = function(nPag, nItem, regex){
		var c = $q.defer();

		$http.get("/api/v1/searchTeachers", {
			params: {"regex": regex, "nPag": nPag, "nItem": nItem }}).then(
					function(response){
						c.resolve(response.data);
					},
					function(reason){
						c.reject(reason);
					}
			);

		return c.promise;
	}

	var getSingleStatus = function(idScenario, idPost){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/posts/"+idPost).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var addLikeToPost = function(idScenario, idPost){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/likes").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendCommentToPost = function(idScenario, idPost, comment){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/comments",comment).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendMetaCommentToPost = function(idScenario, idPost, comment){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/posts/"+idPost+"/metaComments",comment).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var sendEvent = function(idScenario, event){
		var s = $q.defer();

		$http.post("/api/v1/scenarios/"+idScenario+"/events",event).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var postIssue = function(issue){
		var s = $q.defer();

		$http.post("/api/v1/report",issue).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var postSuggestion = function(suggestion){
		var s = $q.defer();

		$http.post("/api/v1/suggestion",suggestion).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

// var onSuccessGetScenario = function(response){
// scenarios = response.data;
// return scenarios;
// }

// var onErrorGetScenario = function(reason){
// console.log("Error retreaving scenario: "+reason);
// }
	
	/* inizio GESTIONE COMPITI ---------------------------------- */
	var addMissionToScenario = function(idScenario, mission){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/mission", mission).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var deleteMissionToScenario = function(idScenario){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/mission").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var addMissionToCharacter = function(idScenario, idCharacter, mission){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/mission", mission).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}

	var deleteMissionToCharacter = function(idScenario, idCharacter){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/mission").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var postTrustedMediaMetadata = function(idScenario, idMedia, metadata){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta", metadata).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getTrustedMediaMetadata = function(idScenario){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/media/trusted/meta").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var postTrustedMediaMetadata = function(idScenario, idMedia, metadata){
		var s = $q.defer();

		$http.put("/api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta", metadata).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getTrustedMediaMetadata = function(idScenario){
		var s = $q.defer();

		$http.get("/api/v1/scenarios/"+idScenario+"/media/trusted/meta").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getMyMissions = function(){
		var s = $q.defer();

		$http.get("/api/v1/missions").then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var getMyDraft = function(preview){
		var s = $q.defer();
		var url;
		if(preview)
			url="/api/v1/draft?preview=true";
		else
			url="/api/v1/draft";
		$http.get(url).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	
	
	var deleteTrustedMedia = function(idScenario, idMedia){
		var s = $q.defer();

		$http.delete("/api/v1/scenarios/"+idScenario+"/trustedMedia/"+idMedia).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	var deleteMedia = function(idMedia, postId){
		var s = $q.defer();
		var url;
		if(!postId)
			url = "/api/v1/me/media/"+idMedia;
		else
			url = "/api/v1/me/media/"+idMedia+"?postId="+postId;
				
		$http.delete(url).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	
	var getInfoStatistics = function(idUser, idScenario){
		
		if(idUser==null && idScenario==null)
			return;
		
		var url="";
		var s = $q.defer();
		
		if(idUser!=null && idScenario!=null){
		
			url="api/v1/infoStatisticsScenario/"+idScenario+"/user/"+idUser;
			
		}else if(idUser!=null && idScenario==null){
		
			url="api/v1/infoStatisticsUser/"+idUser;

		}else if(idUser==null && idScenario !=null){
			url="api/v1/infoStatisticsScenario/"+idScenario;
			
		}
		$http.get(url).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);

		return s.promise;
		
	}
	var getLastUserNotifications = function(older, num){
		var s = $q.defer();
		var url="api/v1/lastNotifications?num="+num+"&old="+older;
		
		$http.get(url).then(
					function(response){
						s.resolve(response.data);
					},
					function(reason){
						s.reject(reason);
					}
			);

		return s.promise;
	}
	
	/*
	 * NEWSPAPER API START-----------------------------------------------------
	 * 
	 */
	
	var createnewspaper = function(newspaperDTO, idScenario){
		var s = $q.defer();
		$http.post("/api/v1/scenarios/"+idScenario+"/newspapers", newspaperDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var getLastNewspaper = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/newspapers/last").then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	
	var getMyLastNewspaper = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/myNewspapers/last").then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	
	var getnewspaperNumber = function(idScenario, number){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/newspapers/"+number).then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	
	var getmyNewspaperNumber = function(idScenario, number){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/myNewspapers/"+number).then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	var getpublishedNewspapers = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/newspapers").then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	var getMyNewspapers = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/myNewspapers").then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	var lastNewspaperName = function(idScenario){
		var p = $q.defer();
		$http.get('/api/v1/scenarios/'+idScenario+"/lastNewspaperName").then(
				function(response){
					
					p.resolve(response.data);
				},
				function(reason){
					p.reject(reason);
				}
		);
		return p.promise;
	}
	
	var updateNewspaper = function(idScenario, number, newspaperDTOPut){
		var c = $q.defer();
		$http.put("/api/v1/scenarios/"+idScenario+"/newspapers?number="+number, newspaperDTOPut).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}

	var deleteNewspaper = function(idScenario, number){
		var s = $q.defer();
		$http.delete("/api/v1/scenarios/"+idScenario+"/newspapers?number="+number).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var updateArticle = function(idScenario, number, articleDTO){
		var c = $q.defer();
		$http.put("/api/v1/scenarios/"+idScenario+"/newspapers/"+number+"/articles", articleDTO).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	var updateUserJournalist = function(idScenario, idUser){
		var c = $q.defer();
		$http.put("/api/v1/scenarios/"+idScenario+"/journalist/"+idUser).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}
	
	var removeUserFromJournalist = function(idScenario){
		var s = $q.defer();
		$http.delete("/api/v1/scenarios/"+idScenario+"/journalist").then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	/*
	 * NEWSPAPER API END-----------------------------------------------------
	 * 
	 */
	

	return {
		postRegister: postRegister,
		createScenario : createScenario,
		getScenario : getScenario,
		updateScenario : updateScenario,
		addUsersToScenario: addUsersToScenario,
		removeUserFromScenario: removeUserFromScenario,
		addCollaboratorToScenario: addCollaboratorToScenario,
		removeCollaboratorFromScenario: removeCollaboratorFromScenario,
		addCharacterToScenario : addCharacterToScenario,
		updateCharacter: updateCharacter,
		getCharacter : getCharacter,
		deleteScenario: deleteScenario,
		removeCharacterFromScenario: removeCharacterFromScenario,
		getAllCharactersFromScen : getAllCharactersFromScen,
		addUserToCharacter: addUserToCharacter,
		removeUserFromCharacter: removeUserFromCharacter,
		getPagedTeacherByRegex : getPagedTeacherByRegex,
		/* Gesitone post */
		sendStatus: sendStatus,
		updateStatus: updateStatus,
		deletePost: deletePost,
		getPagedPosts : getPagedPosts,
		getPagedIssues : getPagedIssues,
		getPagedSuggestions : getPagedSuggestions,
		getSingleStatus: getSingleStatus,
		addLikeToPost: addLikeToPost,
		sendCommentToPost: sendCommentToPost,
		sendMetaCommentToPost: sendMetaCommentToPost,
		sendEvent: sendEvent,
		addMissionToScenario: addMissionToScenario,
		addMissionToCharacter: addMissionToCharacter,
		deleteMissionToScenario: deleteMissionToScenario,
		deleteMissionToCharacter: deleteMissionToCharacter,
		postIssue: postIssue,
		postSuggestion : postSuggestion,
		getPagedStudents: getPagedStudents,
		getPagedTeachers: getPagedTeachers,
		getPagedScenarios : getPagedScenarios,
		getUsersByFirstNameAndLastName : getUsersByFirstNameAndLastName,
		updateEvent: updateEvent,
		getPagedExceptions: getPagedExceptions,
		getPagedLogs : getPagedLogs,
		getPagedRegistrationRequests : getPagedRegistrationRequests,
		postTrustedMediaMetadata: postTrustedMediaMetadata,
		getTrustedMediaMetadata: getTrustedMediaMetadata,
		deleteTrustedMedia: deleteTrustedMedia,
		getMyMissions : getMyMissions,
		getMyDraft : getMyDraft,
		deleteMedia : deleteMedia, 
		getListOfNewPosts : getListOfNewPosts,
		getLastUserNotifications : getLastUserNotifications,
		getLastPosts : getLastPosts,
		getLastHistoricPosts: getLastHistoricPosts,
		getLastCharacterPosts : getLastCharacterPosts,
		getInfoStatistics : getInfoStatistics,
		/*API Newspaper*/
		createnewspaper : createnewspaper,
		getLastNewspaper : getLastNewspaper,
		getMyLastNewspaper : getMyLastNewspaper,
		getnewspaperNumber : getnewspaperNumber,
		getmyNewspaperNumber : getmyNewspaperNumber,
		getpublishedNewspapers : getpublishedNewspapers,
		getMyNewspapers : getMyNewspapers,
		lastNewspaperName : lastNewspaperName,
		updateNewspaper : updateNewspaper,
		deleteNewspaper : deleteNewspaper,
		updateArticle : updateArticle,
		
		updateUserJournalist : updateUserJournalist,
		removeUserFromJournalist : removeUserFromJournalist
	}



}]);

angular.module('smiled.application').factory('article',
		[ '$http', '$q', '$stateParams', 'apiService', 'CONSTANTS','alertingGeneric', '$sce', function article($http, $q, $stateParams, apiService, CONSTANTS, alertingGeneric, $sce) {

			var idTemplate; 
			var newspaper = {}; 
			
			var articleById = {}; 
			var article = {};
			var scenId = $stateParams.id;
			var newspaperNumber; 
			var numberJustCreated = 0; 
			var nameJustCreated = ""; 
			var publishedNewspaperNumber = 0; 
			var isDraft = false; 
			var isJustDeleted; 
			var isEditing; 
			var idPublishedTemplate = 0; 
			var isPublished = false; 
			var isJournalist;  
			
			//Oggetti articoli --> verranno scaricati da db
			article2col = {}; 
			article1colImg = {};
			article2colImg = {};
			articleColImage = {};
			article1colImgTemp2	= {};
			article2colTemp2 = {};
			article1col = {};
			
			idArticle = 0; 
			idCurrentTemplate = ""; 
			
			headline = {}; 
			headline.title = 'Assegna un nome al giornale';
			headline.date = ''; 
			headline.number = '';
	
				
			article1colImgTemp2.title = "Il punto di vista dell'antagonista";
			article1colImgTemp2.subtitle = ""; 
			article1colImgTemp2.text = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!";		
			article1colImgTemp2.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg';	
			
			articleColImage.title = "L'evento principale dello scenario";
			articleColImage.subtitle = "Sottotitolo dell'articolo"; 
			articleColImage.text = "Qui comparira' il testo dell'articolo. Clicca sul campo che vuoi modificare e inizia a scrivere!"
			articleColImage.city = ""; 
				
			article1col.title = "La societa' nella storia";
			article1col.subtitle = "Sottotitolo dell'articolo";
			article1col.text = "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!";
			article1col.city = "";
			
			article2colTemp2.title = "Articolo di fondo";
			article2colTemp2.subtitle = "";
			article2colTemp2.text = {
					
				col1: "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
				col2: "Qui comparira' il testo dell'articolo. Clicca sul bottone di modifica e inizia a scrivere!",
					
			}
			article2colTemp2.city = ""; 
			
			//SETTAGGIO VALORI DI SUGGERIMENTO ARTICOLI PER GIORNALE APPENA CREATO 
			var setArticleObject = function(id) {
				if(id == 1) 
				{
					article2col.title = 'Articolo di CRONACA';
					article2col.subtitle = "Suggerimenti di scrittura";
					
							
					article2col.text1 ="Questo tipo di articolo e' solitamente collocato in prima pagina ed e' caratterizzato da una narrazione oggettiva su un avvenimento di attualità. In questo spazio potrai raccontare l'evento piu' importante che si e' verificato nel contesto storico dello scenario.",
					article2col.text2 = "Esistono diverse tipologie di cronaca -la cronaca bianca: notizie di eventi di vario tipo; -la cronaca nera:  crimini e delitti -la cronca rosa: sulla vita privata delle persone coinvolte. Clicca sul bottone di modifica e inizia a scrivere l'articolo!",	
					
					article2col.city = "";
				 }
				if (id == 2) {
					article1colImg.title = 'Rubrica del quotidiano';
					article1colImg.subtitle = '';
					article1colImg.text1 = "La Rubrica e' una tipologia di articolo che si trova molto spesso sulla prima pagina dei maggiori quotidiani.  Si tratta di uno spazio in cui il giornalista scrive le proprie riflessioni su un tema specifico:  ad esempio costume, vita politica, societa', inquinamento etc. Viene solitamente trattato un tema legato alla società o all'epoca storica in cui e' ambientata la storia. Clicca sul bottone di modifica e inizia a scrivere! Ricorda di caricare anche un'immagine in questo articolo!";
					article1colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg';
					}
				if (id == 3) {
					 
					article2colImg.title = 'Editoriale e commento';
					article2colImg.subtitle = "Altre tipologie";
					article2colImg.text1 = "L'articolo Editoriale o Commento  sono tipologie di articoli caratterizzati dall'analisi di una tesi a partire da una notizia di cronaca; per sua natura e' spesso scritto da un'opinionista che argomenta il proprio punto di vista. In genere si sceglie un tema di politica interna o estera oppure riflessioni intorno a problemi di particolare rilievo.",
					article2colImg.text2 = 	"Oltre all'editoriale esiste una tipologia di articolo, il Reportage, che puo' essere suddiviso anche in piu' puntate e quindi essere riproposto al prossimo numero. Solitamente si sceglie un avvenimento importante con approfondimenti sul contesto e sulle problematiche legate all'evento.",		
					
					article2colImg.image = 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg'
					article2colImg.city = "";

				}
				
				
				if(id== "4") {article1colImgTemp2 = input;}
				if (id == "5") {articleColImage = input; }
				if(id == "6") {article1col = input; }
				if( id == "7") {article2colTemp2 = input; }
				
			}
			
			var getArticleObject = function(id) {
				if (id == 1) return article2col;
				if (id == 2) return article1colImg;
				if (id == 3) return article2colImg;
				if(id == "4") return article1colImgTemp2; 
				if (id == "5") return articleColImage; 
				if(id == "6") return article1col; 
				if(id == "7") return article2colTemp2; 
				
			}
			
			var getTitle = function() {
				return headline;
			}
			
			var setTitle = function(headlineNewspaper){
				headline = headlineNewspaper; 
			}
			
			//FUNZIONE CHE RICEVE IL CURRENT id dal Newspaper 
			
			var setArticleId = function(id){
				
				if(id == 1) {
					idArticle = id;
				}
				
				if(id == 2){
					
					idArticle = id; 
				}
				
				if(id == 3) {
					
					idArticle = id;
				}
				
				if(id == "4") {
					
					idArticle = id; 
					
				}
				
				if (id == "5") {
					idArticle = id; 
					
				}
				
				if (id == "6") {
					idArticle = id; 
					
				}
				
				if(id == "7"){
					
					idArticle = id; 
					
				}
			}
			
			
			
			var getArticleId = function(){
				
				return idArticle; 
			}
			
			var continueProduction = false; 
			
			
			var getBooleanRedazione = function (){
				
				return continueProduction; 
			}
			
			var setBooleanRedazione = function () {
				
				continueProduction = true; 
				
			}
			
			var getIdCurrentTemplate = function(){
				
				return idCurrentTemplate;
				
			}
			
			var setIdCurrentTemplate = function(id) {
				
				idCurrentTemplate = id; 
				
			}
			
			
			//restituisce l'id del template che lo studente sta utilizzando 

			var getIdTemplate = function(){
				var p = $q.defer();
				var s = apiService.getMyLastNewspaper(scenId); 
				s.then(function(data){
					newspaper = data; 
					p.resolve(newspaper.idTemplate);
				},function(reason){
					p.reject(reason);
					console.log("Errore.");	
				});
				return p.promise;
			}
			
			
			
			
		/*	var getNumberNewspaper = function () {
				
				var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							newspaper = data; 
							idTemplate = newspaper.idTemplate;
							var number = newspaper.number; 
							
						},function(reason){
						
							console.log("Errore.");	
						}
				)

				return newspaper.number; 
				
			}*/
			
			
/*	var getCurrentNewspaper = function () {
				var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							console.log("vengo chiamato ora, scarico giornale"); 
							if(data.status == "DRAFT"){
								newspaper = data; 	
							}
							
							else if (data.status == "PUBLISHED") {
								
								newspaper = {};
								newspaper.name = CONSTANTS.insertHeadline;	
								newspaper.articles = [];
								newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
								
							}

						},function(reason){
							if(reason.status == "500") {
								newspaper = {};
								newspaper.name = CONSTANTS.insertHeadline;	
								newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
									
								alertingGeneric.addWarning("Non e' stato possibile visualizzare gli articoli, ricarica la pagina.");
							}
							
						}
				)
				
			
				return newspaper; 
				
			}*/
	
	
	var setNumberJustCreated = function (number){
		
		numberJustCreated = number; 
		
	}
	
	var getNumberJustCreated = function(){
		
		return numberJustCreated; 
		
		
	}
	

	var setArticle = function(a) {
		article = a;   
	}
	
	var getArticle = function(){
		return article; 
		
	}
	
	var setNameJustCreated = function(headline){
		nameJustCreated = headline; 
	}
	
	var getNameJustCreated = function (){
		
		return nameJustCreated; 
	}
	
	
	var setPublishedNewspaperNumber = function(number){
		publishedNewspaperNumber = number; 
		
		
	}
	
	var getPublishedNewspaperNumber = function (){
		return publishedNewspaperNumber; 
	}
	
	var setIsDraft = function(isNew) {	
		isDraft = isNew; 
	}
	
	var getIsDraft = function(){
		
		return isDraft; 
		
	}
	
	var setIsJustDeleted = function(value){
		isJustDeleted = value; 
		
	}
	
	var getIsJustDeleted = function(){
		
		return isJustDeleted; 
	}
	var setIsEditing = function(isEditingPublished){
		
		isEditing = isEditingPublished; 
		
	}
	
var getIsEditing = function(){
		return isEditing;
		
	}


var setIdPublishedTemplate = function(id) {
	idPublishedTemplate = id; 
	
}

	
var getIdPublishedTemplate = function() {
	
	return idPublishedTemplate; 
	
	
}


var setIsPublished = function(value){
	
	isPublished = value; 
	
}

var getIsPublished = function(){
	
	return isPublished; 
}

var setIsJournalist = function(value){
	
	isJournalist = value;
	
}

var getIsJournalist = function(){
	
	return isJournalist;
	
}
	

		

			return {

				setArticleObject : setArticleObject,
				getArticleObject : getArticleObject, 			
				getTitle : getTitle,
				setTitle : setTitle,
				setArticleId: setArticleId,
				getArticleId: getArticleId,
				setBooleanRedazione: setBooleanRedazione,
				getBooleanRedazione: getBooleanRedazione,
				setIdCurrentTemplate: setIdCurrentTemplate,
				getIdCurrentTemplate: getIdCurrentTemplate,
				getIdTemplate: getIdTemplate,
				/*getCurrentNewspaper: getCurrentNewspaper,*/
				/*getNumberNewspaper: getNumberNewspaper,*/ 
				setNumberJustCreated: setNumberJustCreated,
				getNumberJustCreated:getNumberJustCreated, 
				getArticle: getArticle, 
				setNameJustCreated: setNameJustCreated,
				getNameJustCreated: getNameJustCreated,
				setPublishedNewspaperNumber: setPublishedNewspaperNumber,
				getPublishedNewspaperNumber: getPublishedNewspaperNumber,
				setIsDraft: setIsDraft,
				getIsDraft: getIsDraft,
				setIsJustDeleted: setIsJustDeleted,
				getIsJustDeleted: getIsJustDeleted,
				setIsEditing: setIsEditing,
				getIsEditing: getIsEditing,
				setIdPublishedTemplate: setIdPublishedTemplate,
				getIdPublishedTemplate: getIdPublishedTemplate,
				getIsPublished: getIsPublished,
				setIsPublished: setIsPublished,
				setIsJournalist: setIsJournalist,
				getIsJournalist: getIsJournalist
				}

			

		} ]);

angular.module("smiled.application").constant("CONSTANTS",{
	"realDateFormatWithHour": "d-M-yyyy H:mm",
	"realDateFormatWithSecond": "d-M-yyyy H:mm:ss",
	"realDateFormatWithMinute": "d-M-yyyy H:mm",
	"realDateFormatWithoutHour": "d-M-yyyy",
	
	"realDateFormatOnlyDay" : "d",
	"realDateFormatOnlyMonth" : "MMM",
//	"baseUrl" : "https://localhost:8443/ThesisProject",
	"insertHistoricalDate" : "Data il post", 
	"insertHistoricalDateEvent" : "Data l'evento", 
	"historicalDateOutInterval": "Inserisci una data valida nell'intervallo dello scenario",
	"lengthOfTooltipLikesList" : 10,
	"visibleComment": 3,
	"numberOfPostForScroll" : 10,
	"basicTeacherCover" : "assets/public/img/ic_teacher.png",
	"basicStudentCover" : "assets/public/img/ic_student.png",
//	"regexForSearchTag" : "/\b[A-Z][-'a-zA-Z]+,?\s[A-Z][-'a-zA-Z]{0-19}\b/",
	"urlMeCover" : "api/v1/me/cover",
	"urlMeCoverLarge" : "api/v1/me/coverLarge",
	"urlUserCover" : function(id){
							return "api/v1/users/"+id+"/cover"
						},
	"urlUserCoverLarge" : function(id){
		return "api/v1/users/"+id+"/coverLarge"
	},
	"urlScenarioCover" : function(id){
						 	return "api/v1/scenarios/"+id+"/cover";
	},
	"urlCharacterCover" : function(idScenario, idCharacter){
		 					return "api/v1/scenarios/"+idScenario+"/characters/"+idCharacter+"/cover";
		 				  },
	"urlMediaScenarioPost": function(idScenario){
								return "api/v1/scenarios/"+idScenario+"/media";
	},
	"urlTrustedMediaScenarioPost": function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/trustedMedia";
	},
	"urlMetaMediaScenarioPost": function(idScenario, idMedia){
		return "api/v1/scenarios/"+idScenario+"/media/"+idMedia+"/meta";
	},
	"urlTrustedMediaScenario": function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/media/trusted/meta";
	},
	"urlDeleteTrustedMedia" : function(idScenario, idMedia){
		return "api/v1/scenarios/"+idScenario+"/trustedMedia/"+idMedia;
	},
	"urlMedia" : function(id){
		return "api/v1/media/"+id;
	},
	"urlMediaThumb" : function(id){
		return "api/v1/media/"+id+"?thumb=true";
	},
	"urlPostMedia" : function(idScenario){
		return "api/v1/scenarios/"+idScenario+"/media";
	},
	"urlPost" : function(idScenario, idPost){
			return "api/v1/scenarios/"+idScenario+"/posts/"+idPost;
	},
	"urlToolMap" : function(i){
		return "api/v1/toolMap?version="+i;
	},
	"urlMarker" : "assets/public/img/marker.png",
	"monthString": function(month){
		var m;
		switch(month){
			case 1: {
				m = "gennaio";
				break;
			}
			case 2: {
				m = "febbraio";
				break;
			}
			case 3: {
				m = "marzo";
				break;
			}
			case 4: {
				m = "aprile";
				break;
			}
			case 5: {
				m = "maggio";
				break;
			}
			case 6: {
				m = "giugno";
				break;
			}
			case 7: {
				m = "luglio";
				break;
			}
			case 8: {
				m = "agosto";
				break;
			}
			case 9: {
				m = "settembre";
				break;
			}
			case 10: {
				m = "ottobre";
				break;
			}
			case 11: {
				m = "novembre";
				break;
			}case 12: {
				m = "dicembre";
				break;
			}
		}
		return m;
	},
	"getMonths" : function(lang){
		var months = new Array();
		var month = {};
		if(lang=="it"){
			month = {value : 1, name: "gennaio"};
			months.push(angular.copy(month));
			month = {value : 2, name: "febbraio"};
			months.push(angular.copy(month));
			month = {value : 3, name: "marzo"};
			months.push(angular.copy(month));
			month = {value : 4, name: "aprile"};
			months.push(angular.copy(month));
			month = {value : 5, name: "maggio"};
			months.push(angular.copy(month));
			month = {value : 6, name: "giugno"};
			months.push(angular.copy(month));
			month = {value : 7, name: "luglio"};
			months.push(angular.copy(month));
			month = {value : 8, name: "agosto"};
			months.push(angular.copy(month));
			month = {value : 9, name: "settembre"};
			months.push(angular.copy(month));
			month = {value : 10, name: "ottobre"};
			months.push(angular.copy(month));
			month = {value : 11, name: "novembre"};
			months.push(angular.copy(month));
			month = {value : 12, name: "dicembre"};
			months.push(angular.copy(month));
		}else if(lang=="en"){
			month = {value : 1, name: "January"};
			months.push(angular.copy(month));
			month = {value : 2, name: "February"};
			months.push(angular.copy(month));
			month = {value : 3, name: "March"};
			months.push(angular.copy(month));
			month = {value : 4, name: "April"};
			months.push(angular.copy(month));
			month = {value : 5, name: "May"};
			months.push(angular.copy(month));
			month = {value : 6, name: "June"};
			months.push(angular.copy(month));
			month = {value : 7, name: "July"};
			months.push(angular.copy(month));
			month = {value : 8, name: "Agoust"};
			months.push(angular.copy(month));
			month = {value : 9, name: "September"};
			months.push(angular.copy(month));
			month = {value : 10, name: "October"};
			months.push(angular.copy(month));
			month = {value : 11, name: "November"};
			months.push(angular.copy(month));
			month = {value : 12, name: "December"};
			months.push(angular.copy(month));
		}else
			throw new Error("Not supported language");
		
		return months;
	},
	"getDays" : function(month){
		var days = new Array();
		var numDay;
		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
			numDay=31;
		}else if(month==2){
			numDay=28;
		}else{
			numDay=30;
		}
			
		for(var i=1; i<=numDay; i++){
			var day = {value : i};
			days.push(day);
		}
		return days;
	},
	"dayOfWeekString": function(day){
		var d="";
		switch(day){
		case 0: {
			d="Lun";
			break;
		}
		case 1: {
			d="Mar";
			break;
		}
		case 2: {
			d="Mer";
			break;
		}
		case 3: {
			d="Gio";
			break;
		}
		case 4: {
			d="Ven";
			break;
		}
		case 5: {
			d="Sab";
			break;
		}
		case 6: {
			d="Dom";
			break;
		}
		}
		return d;
	}, 
	
	//newspaper CONSTANTS
	
	"insertHeadline" : "Inserisci un titolo per il giornale",
	"insertHistoricalDateNewspaper" : "Data il giornale", 
	
	
	
});

 angular.module('smiled.application').factory('dateUtil', ['CONSTANTS',
     function apiService(CONSTANTS){
	 
	var julianNumberToDate = function(jd, date){
  		  var l = jd + 68569;
  	      var n = parseInt(( 4 * l ) / 146097);
  	      l = l - parseInt(( 146097 * n + 3 ) / 4);
  	      var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
  	      l = l - parseInt(( 1461 * i ) / 4) + 31;
  	      var j = parseInt(( 80 * l ) / 2447);
  	      date.day = l - parseInt(( 2447 * j ) / 80);
  	      l = parseInt(j / 11);
  	      date.month = j + 2 - ( 12 * l );
  	      date.year = 100 * ( n - 49 ) + i + l;
  	      date.dow = jd%7;
  	}
  	
  	        	
  	var dateToJulianNumber = function(date){
  		 
  		  console.log("dateToJulianNumber: "+date.year);
  		  var jd = parseInt(( 1461 * ( date.year + 4800 + parseInt(( date.month - 14 ) / 12) ) ) / 4) +
            parseInt(( 367 * ( date.month - 2 - 12 *  parseInt(( date.month - 14 ) / 12)  ) ) / 12) -
            parseInt(( 3 * parseInt(( date.year + 4900 + parseInt(( date.month - 14 ) / 12) ) / 100)  ) / 4) +
            date.day - 32075 ;
  		return jd;
  	}
  	
	var getMonthString = function(month){
		return CONSTANTS.monthString(month);
	} 
	
	var getTimeToSeconds=function(timeNumber,t){
		t.hours=parseInt(timeNumber/3600);
		timeNumber=timeNumber%3600;
		t.minutes=parseInt(timeNumber/60);
		timeNumber=timeNumber%60;
		t.seconds=timeNumber;
	}
	
 	var getNumDaysOfMonth = function(month, year){
		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
			return 31;
		else if(month==4 || month==6 || month==9 || month==11)
			return 30;
		else{
			if((year%4==0 && year%100!=0) || (year%400==0))
				return 29;
			else
				return 28;
		}
	}
 	
 	var dateTimeToString = function(jdn,tn){
 		var date = {};
 		var t = {};
 		if(jdn)
 			julianNumberToDate(jdn, date);	
 		if(tn && (typeof tn !== "undefined"))
 			getTimeToSeconds(tn, t);
 		var s="";
 		if(date)
 			s+=date.day+" "+getMonthString(date.month)+" "+Math.abs(date.year);
 		if(date.year<0)
 			s+=" a.C.";
 		
 		if(t && t.hours && t.minutes){
 			if(t.hours<10)
 				s+=" 0"+t.hours;
 			else
 				s+=" "+t.hours;
 			if(t.minutes<10)
 				s+=":0"+t.minutes;
 			else
 				s+=":"+t.minutes;
 		}
 		
 		return s;
 	}
 	
 	var dateTimeToStringShort = function(jdn,tn){
 		var date = {};
 		var t = {};
 		if(jdn)
 			julianNumberToDate(jdn, date);	
 		if(tn && (typeof tn !== "undefined"))
 			getTimeToSeconds(tn, t);
 		var s="";
 		if(date)
 			s+=date.day+"/"+date.month+"/"+Math.abs(date.year);
 		if(date.year<0)
 			s+=" a.C.";
 		
 		if(t && t.hours && t.minutes){
 			if(t.hours<10)
 				s+=" 0"+t.hours;
 			else
 				s+=" "+t.hours;
 			if(t.minutes<10)
 				s+=":0"+t.minutes;
 			else
 				s+=":"+t.minutes;
 		}
 		
 		return s;
 	}
  	
  	return {
  		julianNumberToDate : julianNumberToDate,
  		dateToJulianNumber : dateToJulianNumber,
  		getMonthString : getMonthString,
  		getTimeToSeconds : getTimeToSeconds,
  		getNumDaysOfMonth : getNumDaysOfMonth,
  		dateTimeToString : dateTimeToString,
  		dateTimeToStringShort: dateTimeToStringShort
  	}
	 	
 }]);
angular.module('smiled.application').factory('messageService', [ '$q',
               function messageService($q){
	var messages = [];
	
	
	var newMessage = function(m){
		m.read=false;
		messages.push(m);
	}
	
	
	return {
		newMessage : newMessage
	};
}]);

angular.module('smiled.application').factory('modalService', ['$modal', 'apiService','$anchorScroll','$location',function modalService($modal, apiService, $anchorScroll, $location){
	
		var scenario = {
				
		};
		var attendee = {
				
		};
		var character = {
				
		};
		var collaborator = {
				
		};
		
		var post = {};
		var scenarioMap = "";
		var startDate = {};
		var endDate = {};
		var charName;
		var scenario = {};
		var file = {};
		var registrationToConfirm = {};
		var confirmRegistrationBool = true;
		var newspaper = {}; 
		var scenarioId="";
		var newspaperNumber=0;
		
		var modalInstanceCreateScen;
		var modalInstanceDeleteScen;
		var modalInstanceDeleteAttendee;
		var modalInstanceDeleteCollaborator;
		var modalInstanceSetDate;
		var modalInstanceOpenMap;
		var modalInstanceOpenMapForPost;
		var modalInstanceOldCharacterChangeOnComment;
		var modalInstanceSetHistoryDate;
		var modalInstanceSetHistoryNewsDate; 
		var modalInstanceCreateMission;
		var modalInstanceDeleteResource;
		var modalInstanceDeletePost;
		var modalInstanceConfirmRegistration;
		var modalInstanceConcurrentModPost;
		var modalInstanceCreateTitle; 
		var modalInstanceChooseTemplate;
		var modalInstanceDeleteNewspaper; 
		var modalInstanceAlertNewspaper; 
		var modalInstanceAlertPublicNewspaper; 
		
		
		var optionsChooseTemplate = {
				templateUrl: 'assets/private/partials/chooseTemplate.html',
				controller: 'dialogChooseTemplateCtrl',
				controllerAs: 'dialogChooseTemplate',
				size: 'md',
				
		}
		
		var optionsDeleteNewspaper = {
				templateUrl: 'assets/private/partials/deleteNewspaper.html',
				controller: 'dialogDeleteNewspaperCtrl',
				controllerAs: 'dialogDelete',
				size: 'md',	
				resolve : {
					scenarioId : function(){
						return scenarioId;
					},
					newspaperNumber : function(){
						return newspaperNumber;
					}
				}
		}
		
		var alertCreationNewspaper = {
				
				templateUrl: 'assets/private/partials/alertCreationNewspaper.html',
				/*controller: 'dialogAlertCreationNews',
				controllerAs: 'dialogAlertCreation',*/
				size: 'md',
				
		}
		
		var alertPublicNewspaper = {
				templateUrl: 'assets/private/partials/alertPublicNewspaper.html',	
				size: 'md',		
		}
		
		
		var alertDateNewspaper = {
				templateUrl: 'assets/private/partials/alertDateNewspaper.html',	
				size: 'md',		
		}
		
		
		
		
		var optionsConcurrentModPost = {
				templateUrl: 'assets/private/partials/concurrentModPostTemplate.html',
		}

		
		var optionSetHistoryDate = {
				templateUrl: 'assets/private/partials/customDatePickerTemplate.html',
				controller: 'customDatePickerTemplateCtrl',
				controllerAs: 'customDatePickerTemplate',
				size: 'sm',
				resolve : {
					startDate : function(){
						return startDate;
					},
					endDate : function(){
						return endDate;
					},
					post : function(){
						return post;
					}
				}
		}
		
		
		var optionSetHistoryNewsDate = {
				templateUrl: 'assets/private/partials/customDatePickerTemplateNewspaper.html',
				controller: 'customDatePickerNewspaperCtrl',
				controllerAs: 'customDatePickerNewspaper',
				size: 'sm',
				resolve : {
					startDate : function(){
						return startDate;
					},
					endDate : function(){
						return endDate;
					},
					newspaper : function(){
						return newspaper;
					}
				}
		}
		
		var optionsCreateScen = {
				templateUrl:'assets/private/partials/createScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
				size: 'lg'  //TODO non funziona
				
		};
		
		var optionsDeleteScen = {
				templateUrl:'assets/private/partials/deleteScenario.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
		};
		
		var optionsConfirmRegistration = {
				templateUrl:'assets/private/partials/confirmRegistration.html',
				controller: 'dialogConfirmRegistrationCtrl',
				controllerAs: 'dialogConfirmRegistration',
				resolve : {
					confirmRegistrationBool : function(){
						return confirmRegistrationBool;
					}
				}
		};
		
		
		var optionsDeleteAttendee = {
				templateUrl:'assets/private/partials/deleteAttendee.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
		};
		
		var optionsDeleteCollaborator = {
				templateUrl:'assets/private/partials/deleteCollaborator.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
		};
		
		var optionsDeleteCharacter = {
				templateUrl:'assets/private/partials/deleteCharacter.html',
				controller: 'dialogScenarioCtrl',
				controllerAs: 'dialogScenario',
		};
		
		var optionsSetDateStart = {
				templateUrl:'assets/private/partials/setDate.html',
				controller: 'dialogSetDateCtrl',
				controllerAs: 'dialogSetDate',
				resolve : {
					scen : function(){
						return scenario;
					},
					start : function(){
						return true;
					}
				}
		};
		var optionsSetDateEnd = {
				templateUrl:'assets/private/partials/setDate.html',
				controller: 'dialogSetDateCtrl',
				controllerAs: 'dialogSetDate',
				resolve : {
					scen : function(){
						return scenario;
					},
					start : function(){
						return false;
					}
				}
		};
		
		var optionsOpenMap = {
				templateUrl: 'assets/private/partials/openMap.html',
				controller: 'openMapCtrl',
				controllerAs: 'openMap',
				size: "lg",
				resolve: {
					post : function(){
						return post;
					},
					scenarioMap : function(){
						return scenarioMap;
					}
				}
		}
		
		var optionsOpenMapForPost = {
				templateUrl: 'assets/private/partials/openMapForPost.html',
				controller: 'openMapForPostCtrl',
				controllerAs: 'openMapForPost',
				size: "lg",
				resolve: {
					post : function(){
						return post;
					},
					scenarioMap : function(){
						return scenarioMap;
					}
				}
		}
		
		var optionsOldCharacterChangeOnComment = {
				templateUrl: 'assets/private/partials/oldCharacterChangeOnComment.html',
				controller: 'oldCharacterChangeOnCommentCtrl',
				controllerAs: 'oldCharacterChangeOnComment',
				size: "sm",
				resolve: {
					charName : function(){
						return charName;
					}
				}
		}
		var optionsCreateMission = {
				templateUrl:'assets/private/partials/createMission.html',
				controller: 'dialogMissionCtrl',
				controllerAs: 'dialogMission',
				size: 'lg',
				resolve : {
					scenario : function(){
						return scenario;
					}
				}
				
		};
		
		var optionsDeleteResource = {
				templateUrl:'assets/private/partials/deleteResource.html',
				controller: 'deleteResourceCtrl',
				controllerAs: 'deleteResource',
				size: 'sm',
				resolve : {
					file : function(){
						return file;
					}
				}
				
		};
		
		var optionsDeletePost = {
				templateUrl:'assets/private/partials/deletePost.html',
				size: 'sm'
		};
		
		
		// template MODAL NEWSPAPER 
		
		var showCreateTitle = {
				
				templateUrl: 'assets/private/partials/createTitle.html',
				controller: 'dialogHeadlineCtrl',
				controllerAs: 'dialogHeadline',
				size: 'lg',
				/*windowClass: 'center-modal'*/		
				resolve: {
					newspaper : function(){
						return newspaper;
					}
				}
					
		};
		
			
		var showModalCreateScen = function(){
			modalInstanceCreateScen = $modal.open(optionsCreateScen);
			return modalInstanceCreateScen.result;
			
		}
		
		var closeModalCreateScen = function(){
			modalInstanceCreateScen.close();
		}
		
		var showModalDeleteScen = function(s){
			scenario = s;
			modalInstanceDeleteScen = $modal.open(optionsDeleteScen);
			return modalInstanceDeleteScen.result;
			
		}
		
		var showModalConfirmRegistration = function(l, isConfirm){
			confirmRegistrationBool = isConfirm;
			registrationToConfirm = l;
			modalInstanceConfirmRegistration = $modal.open(optionsConfirmRegistration);
			return modalInstanceConfirmRegistration.result;
		}
		
		
		var showModalDeleteAttendee = function(a){
			attendee = a;
			modalInstanceDeleteAttendee = $modal.open(optionsDeleteAttendee);
			return modalInstanceDeleteAttendee.result;
			
		}
		var showModalDeleteCollaborator = function(c){
			collaborator = c;
			modalInstanceDeleteCollaborator = $modal.open(optionsDeleteCollaborator);
			return modalInstanceDeleteCollaborator.result;
			
		}
		var showModalDeleteCharacter = function(c){
			character = c;
			modalInstanceDeleteCharacter = $modal.open(optionsDeleteCharacter);
			return modalInstanceDeleteCharacter.result;
			
		}
		
		var closeModalDeleteScen = function(){
			modalInstanceDeleteScen.close();
		}
		
		var closeModalDeleteAttendee = function(){
			modalInstanceDeleteAttendee.close();
		}
		
		var closeModalConfirmRegistration = function(){
			modalInstanceConfirmRegistration.close();
		}
		
		var closeModalDeleteCollaborator = function(){
			modalInstanceDeleteCollaborator.close();
		}
		
		var closeModalDeleteCharacter = function(){
			modalInstanceDeleteCharacter.close();
		}
		
		// MODAL NEWSPAPER  
		var showModalCreateTitle = function(news){ 
			newspaper = news; 
			modalInstanceCreateTitle = $modal.open(showCreateTitle);
			return modalInstanceCreateTitle.result; 
		}
		
		var closeModalCreateTitle = function(){
			modalInstanceCreateTitle.close(); 
		}
		
		var showModalDeleteNewspaper = function(scenId, newspaperNum){
			scenarioId = angular.copy(scenId);
			newspaperNumber = angular.copy(newspaperNum);
			console.log(scenId+" ------ "+newspaperNum);
			modalInstanceDeleteNewspaper = $modal.open(optionsDeleteNewspaper); 
			return modalInstanceDeleteNewspaper.result; 	
		}
		
		var closeModalDeleteNewspaper = function(){
			modalInstanceDeleteNewspaper.close(); 
		}
			
		
		var createScenario = function(scenario){
			 var history ={
					 startDate : {
						 year : "",
						 month :"",
						 day : "",
						 afterChrist : "",
					 },
					 endDate : {
						 year : "",
						 month :"",
						 day : "",
						 afterChrist : "",
					 }
			 };
			 history.startDate.year = scenario.startDate.year;
			 history.startDate.month = scenario.startDate.month;
			 history.startDate.day = scenario.startDate.day;
			 history.startDate.afterChrist = scenario.startDate.afterChrist;
			 
			 history.endDate.year = scenario.endDate.year;
			 history.endDate.month = scenario.endDate.month;
			 history.endDate.day = scenario.endDate.day;
			 history.endDate.afterChrist = scenario.endDate.afterChrist;
			 
			 var scenarioDTO = {};
			 scenarioDTO.name = scenario.title;
			 scenarioDTO.history = history;
			 scenarioDTO.showRelationsToAll = scenario.showRelationsToAll;	
			 scenarioDTO.newspaperEnabled = scenario.newspaperEnabled;
			
			 s = apiService.createScenario(scenarioDTO);
			 return s; 
			 
		}
		
		var deleteScenario = function(){
			s = apiService.deleteScenario(scenario.id);
			return s; 
			 
		}
		
		var deleteNewspaper = function(id, number){
			n = apiService.deleteNewspaper(id, number);
			return n; 
			
		}
		
		var deleteAttendee = function(){
			console.log("delete not implemented");
			 
		}
		
		var getScenToDelete = function(){
			return scenario;
		}
		
		var getRegistrationToConfirm = function(){
			return registrationToConfirm;
		}
		
		var getAttendeeToDelete = function(){
			return attendee;
		}
		
		var getCollaboratorToDelete = function(){
			return collaborator;
		}
		
		var getCharacterToDelete = function(){
			return character;
		}
		
		//first serve a specificare (nel caso di set date) se si cerca di modificare la data di inizio o di fine dello scenario

		var showPopUpSetDate = function(s, first){
			scenario = s;
			if(first==true)
				modalInstanceSetDate = $modal.open(optionsSetDateStart);
			else
				modalInstanceSetDate = $modal.open(optionsSetDateEnd);
			return modalInstanceSetDate.result;
		}
		
		var closeModalSetDate = function(){
			modalInstanceSetDate.close();
		}
		
		var showModalOpenMap = function(p, sMap){
			post = p;
			scenarioMap = sMap;
			modalInstanceOpenMap = $modal.open(optionsOpenMap);
			return modalInstanceOpenMap.result;
		}
	
		var closeModalOpenMap = function(){
			modalInstanceOpenMap.close();
		}
		
		var showModalOpenMapForPost = function(p, sMap){
			post = p;
			scenarioMap = sMap;
			modalInstanceOpenMapForPost = $modal.open(optionsOpenMapForPost);
			return modalInstanceOpenMapForPost.result;
		}
	
		var closeModalOpenMapForPost = function(){
			modalInstanceOpenMapForPost.close();
		}
		
		var showModalOldCharacterChangeOnComment = function(characterName){
			charName = characterName;
			modalInstanceOldCharacterChangeOnComment = $modal.open(optionsOldCharacterChangeOnComment);
			return modalInstanceOldCharacterChangeOnComment.result;
		}
	
		var closeModalOldCharacterChangeOnComment = function(){
			modalInstanceOldCharacterChangeOnComment.close();
		}
		
		
		var showModalSetHistoryDate = function(sDate, eDate, p){
			startDate = sDate;
			endDate = eDate;
			post = p;
			modalInstanceSetHistoryDate = $modal.open(optionSetHistoryDate);
			return modalInstanceSetHistoryDate.result;
		}
		
		
		//datePicker Headline
		var showModalSetHistoryNewspaperDate = function(sDate, eDate, n){
			startDate = sDate;
			endDate = eDate;
			newspaper = n; 
			modalInstanceSetHistoryNewsDate = $modal.open(optionSetHistoryNewsDate);
			return modalInstanceSetHistoryNewsDate.result;
		}
	
		var closeModalSetHistoryDate = function(){
			modalInstanceSetHistoryDate.close();
		}
		
		var closeModalSetHistoryDateNewspaper = function() {
			modalInstanceSetHistoryNewsDate.close();
			
		}
		
		var showAlertNewspaper = function(){
			
			modalInstanceAlertNewspaper = $modal.open(alertCreationNewspaper);
			return modalInstanceAlertNewspaper; 
			
		}
		
		var showAlertPublicNewspaper = function(reason) {
			if(reason == "numeroArticoli"){
				modalInstanceAlertPublicNewspaper = $modal.open(alertPublicNewspaper); 
			} else if(reason == "data") {
				
				modalInstanceAlertPublicNewspaper = $modal.open(alertDateNewspaper); 
				
			}
			
			
		}
		
		
		var showModalCreateMission = function(scen){
			scenario = scen;
			modalInstanceCreateMission = $modal.open(optionsCreateMission);
			return modalInstanceCreateMission.result;
			
		}
		
		var closeModalCreateMission = function(){
			modalInstanceCreateMission.close();
		}
		
		var createMission = function(mission){
			console.log("CREATE MISSION -----------------------");
			 //BOZZA
			 s = apiService.createMission(mission.scenId,mission);
			 return s; 
			 
		}
		
		var showModalDeleteResource = function(resource){
			file = resource;
			modalInstanceDeleteResource = $modal.open(optionsDeleteResource);
			return modalInstanceDeleteResource.result;
		}
	
		var closeModalDeleteResource = function(){
			modalInstanceDeleteResource.close();
		}
		
		var showModalDeletePost = function(){
			modalInstanceDeletePost = $modal.open(optionsDeletePost);
			return modalInstanceDeletePost.result;
		}
	
		var closeModalDeletePost = function(){
			modalInstanceDeletePost.close();
		}
		
		var showConcurrentModPost = function(){
			modalInstanceConcurrentModPost = $modal.open(optionsConcurrentModPost);
			return modalInstanceConcurrentModPost.result;
			
		}
		
		var closeModalConcurrentModPost = function(){
			modalInstanceConcurrentModPost.close();
		}
		
		
		
		var showChooseTemplate = function(){
			modalInstanceChooseTemplate = $modal.open(optionsChooseTemplate);
			return modalInstanceChooseTemplate.result;
			
		}
		
		var closeModalShowChooseTemplate = function(){
			modalInstanceChooseTemplate.close();
			
		}
		
			
		return {
			createScenario : createScenario,
			deleteScenario : deleteScenario,
			showModalCreateScen : showModalCreateScen,
			closeModalCreateScen: closeModalCreateScen,
			showModalDeleteScen : showModalDeleteScen,
			closeModalDeleteScen: closeModalDeleteScen,
			showModalDeleteAttendee : showModalDeleteAttendee,
			closeModalDeleteAttendee: closeModalDeleteAttendee,
			showModalDeleteCollaborator : showModalDeleteCollaborator,
			closeModalDeleteCollaborator : closeModalDeleteCollaborator,
			showModalDeleteCharacter : showModalDeleteCharacter,
			closeModalDeleteCharacter: closeModalDeleteCharacter,
			getScenToDelete : getScenToDelete,
			getAttendeeToDelete: getAttendeeToDelete,
			getCollaboratorToDelete: getCollaboratorToDelete,
			getCharacterToDelete: getCharacterToDelete,
			showPopUpSetDate : showPopUpSetDate,
			closeModalSetDate : closeModalSetDate,
			showModalOpenMap : showModalOpenMap,
			closeModalOpenMap : closeModalOpenMap,
			showModalOpenMapForPost: showModalOpenMapForPost,
			closeModalOpenMapForPost: closeModalOpenMapForPost,
			showModalOldCharacterChangeOnComment: showModalOldCharacterChangeOnComment,
			closeModalOldCharacterChangeOnComment: closeModalOldCharacterChangeOnComment,
			showModalSetHistoryDate: showModalSetHistoryDate,
			closeModalSetHistoryDate: closeModalSetHistoryDate,
			createMission : createMission,
			showModalCreateMission : showModalCreateMission,
			closeModalCreateMission: closeModalCreateMission,
			showModalDeleteResource : showModalDeleteResource,
			closeModalDeleteResource : closeModalDeleteResource,
			showModalDeletePost : showModalDeletePost,
			closeModalDeletePost : closeModalDeletePost,
			showModalConfirmRegistration : showModalConfirmRegistration,
			getRegistrationToConfirm : getRegistrationToConfirm,
			closeModalConfirmRegistration : closeModalConfirmRegistration,
			showConcurrentModPost: showConcurrentModPost,
			closeModalConcurrentModPost : closeModalConcurrentModPost,
			//MODAL NEWSPAPER
			showChooseTemplate: showChooseTemplate,
			closeModalShowChooseTemplate: closeModalShowChooseTemplate,
			showModalCreateTitle : showModalCreateTitle,
			closeModalCreateTitle : closeModalCreateTitle,
			showModalSetHistoryNewspaperDate: showModalSetHistoryNewspaperDate,
			closeModalSetHistoryDateNewspaper: closeModalSetHistoryDateNewspaper,
			showModalDeleteNewspaper: showModalDeleteNewspaper,
			closeModalDeleteNewspaper: closeModalDeleteNewspaper,
			deleteNewspaper: deleteNewspaper,
			showAlertNewspaper: showAlertNewspaper,
			showAlertPublicNewspaper: showAlertPublicNewspaper,
			
		}
}]);





angular.module('smiled.application').factory('notifyService', [ '$q','$cookies','$rootScope', 'apiService',
               function notifyService($q, $cookies, $rootScope, apiService){

	
	var me = $cookies.get('myMescholaId');
	var newPosts = [];
    var actualScenarioId="";
    var actualNotify={};
    var observerReloadListOfPost = {};
	var observerReloadAssociationCallbacks = {};
   
    var sendAckNCallback = {};
    
    var inEditPost = [];
    var toReload = [];
    var setActualScenarioId = function(id){
    	actualScenarioId=id;		
    }
        
	var resetActualScenarioId = function(){
		actualScenarioId="";	
		inEditPost = [];
		toReload = [];
	}
	
	var newNotifyOrPost = function(n){
		
		if(n.verb=="OPEN_SCENARIO" || n.verb=="CLOSE_SCENARIO" ){ //eventi da dare a tutte le dashboard
			$rootScope.$broadcast('dashboard.reloadDashboard');
		}
		else if(n.verb=="NEW_MOD" || n.verb=="DEL_MOD"){ //eventi da dare alla dashboard teacher
			$rootScope.$broadcast('dashboardTeacher.reloadDashboard');
		}
		else if((n.verb=="NEW_ASSOCIATION" && n.objectId==me) || n.verb=="DEL_ASSOCIATION" || n.verb=="NEW_ATTENDEE" || n.verb=="DEL_ATTENDEE"){  //eventi da dare alla dashboard student
			$rootScope.$broadcast('dashboardStudent.reloadDashboard');
		}else if(n.verb=="NEW_PERSONAL_MISSION" || n.verb=="NEW_GLOBAL_MISSION"){
			$rootScope.$broadcast('dashboardStudent.reloadMission');
		}
		
		if(n.sender!=me){
			
			if(n.verb=="NEW_POST"){
				if(n.scenarioId==actualScenarioId){
					newPosts.unshift(n.objectId);
					$rootScope.$broadcast('notification.newPostEvent');
				}
			}else if(n.verb=="UPD_POST"){
				if(n.scenarioId==actualScenarioId && !isInEditPost(n.objectId)){
					$rootScope.$broadcast('notification.updPostEvent',{id:n.objectId});
				}else{
					toReload.push(n.objectId);
					$rootScope.$broadcast('notification.generateAlertUpd',{id:n.objectId});
				}
			}else if(n.verb=="UPD_NEW_COMMENT"){
				if(n.scenarioId==actualScenarioId){
					$rootScope.$broadcast('notification.updNewComment',{notification : n});
				}
			}else if(n.verb=="UPD_NEW_META"){
				if(n.scenarioId==actualScenarioId){
					$rootScope.$broadcast('notification.updNewMetaComment',{notification : n});
				}
			}
			else{
				$rootScope.$broadcast('notification.newNotificationEvent', {notification: n});
			}
		}
		//else --> non fare niente perchè è una notifica generata da me
		
	}
	var getAllNewPosts = function(){
		var nP = angular.copy(newPosts);
		newPosts = [];
		return nP;
	}
	
	
	var readOldNotifications = function(older, num){
		return apiService.getLastUserNotifications(older, num);
	}
	
	


	
//	var notifyReloadAssociationObservers = function(n){
//		if(observerReloadAssociationCallbacks)
//			observerReloadAssociationCallbacks(n);
//	};
	
	//register an observer
	var registerObserverReloadList = function(callback){
		
		observerReloadListOfPost = callback;
	}
	var resetObserverReloadList = function(){
		observerReloadListOfPost=null;
	}
	
	//register an observer
	var registerObserverAssociation = function(callback){
		observerReloadAssociationCallbacks = callback;
	}
	var resetObserverAssociation = function(){
		observerReloadAssociationCallbacks=null;
	}
	
	
	var notifyReloadListObservers = function(){ //do a scenarioPostController la lista di nuovi post da scaricarsi
		if(observerReloadListOfPost)
			observerReloadListOfPost(newPosts);
	}
	

	
	var reloadList = function(){
		
		notifyReloadListObservers(); 
		newPosts = [];
	}
	
	var reloadAssociation = function(){
		if(observerReloadAssociationCallbacks){
			observerReloadAssociationCallbacks();
		}
	}
	
	var addToInEditPost = function(idPost){
		if(inEditPost.indexOf(idPost)<0)
			inEditPost.push(idPost);
	}
	
	var removeToInEditPost = function(idPost){
		var i = inEditPost.indexOf(idPost);
		if(i>=0){
			inEditPost.splice(i,1);
			var j = toReload.indexOf(idPost);
			if(j>=0){
				$rootScope.$broadcast('notification.updPostEvent',{id:idPost});
				toReload.splice(j,1);
			}
		}
	}
	
	var isInEditPost = function (idPost){
		if(inEditPost.indexOf(idPost)<0)
			return false;
		else
			return true;
	}
	
	  
    var onLoginListener = $rootScope.$on('meschola.login', function (event, data) {
    	console.log(data.id);
    	me = data.id;
    });
    
    var onLogoutListener = $rootScope.$on('meschola.logout', function () {
    	me = "";
    });
	
    $rootScope.$on("$destroy", function() {
		onLoginListener();
		onLogoutListener();
	});
	
	return {
		newNotifyOrPost : newNotifyOrPost,
		getAllNewPosts : getAllNewPosts,
		registerObserverReloadList : registerObserverReloadList,
		resetObserverReloadList : resetObserverReloadList,
		notifyReloadListObservers : notifyReloadListObservers,
		reloadList : reloadList,
		reloadAssociation : reloadAssociation,
		registerObserverAssociation : registerObserverAssociation,
		resetObserverAssociation : resetObserverAssociation,
		setActualScenarioId : setActualScenarioId,
		resetActualScenarioId : resetActualScenarioId,
		readOldNotifications : readOldNotifications,
		addToInEditPost : addToInEditPost,
		removeToInEditPost : removeToInEditPost,
		isInEditPost : isInEditPost
	};

}]);

 angular.module('smiled.application').factory('socialGraphSketch', ['userService',
     function socialGraphSketch(userService){
	 
	return function(p5){
		var nodi={};
		var archi=[];
		var ranks={}; //stato dei nodi al tempo corrente;
		var events = [];

		var w;
		var h;
		//Nodi soggetti a trasformazione
		var dragged=null;
		var inside=null;
		var flashing=null;
		var flashingRadius=0;

		var draggingBar=false;
		var barra=0;

		//Variabili legate alla simulazione fisica delle particelle
		var t=0.1; //agitazione termica;
		var dt=0.1; //intervallo di integrazione
		var k=0.5; //coefficiente elastico
		var q=400000; //forza elettrica
		var l0=0;
		var g=80; //forza di gravità
		var friction=0.5;

		//TODO modificare prelievo id - url da service
		
		p5.preload = function() {
		  var id = userService.getScenarioId();
		  var url = '/api/v1/scenarios/'+id+'/socialGraph';
		  events = p5.loadJSON(url);
		  var container = angular.element(document.querySelector('#container-graph'));
		  w = container.width();
		  h = parseInt((w*3)/4);
		}
		
		var createNodeState = function() {
		  var ns={};
		  ns.links={};
		  for(var id in nodi){
			  ns.links[id]=0;
		  }
		  ns.posts=0;
		  ns.getRadius = function() {
		    return (p5.log(ns.posts+1)/p5.log(1.2)+10)*0.75;
		  }
		  return ns;
		}
		
		var createNode = function(id, name) {
			  var node= {
			    id:id, 
			    name:name, 
			    x: [p5.random(0,p5.width) ,0,0,0,0], 
			    y: [p5.random(0,p5.height),0,0,0,0],
			    targets: [],
			    vx: 0.0,
			    vy: 0.0,
			    ax: 0.0,
			    ay: 0.0,
			    phase: p5.random(0,p5.TWO_PI)
			  };
			  node.setX= function(x) {
			    var xs=p5.shorten(node.x);
			    node.x=p5.splice(xs,x,0);    
			  }
			  node.setY= function(y) {
			    var ys=p5.shorten(node.y);
			    node.y=p5.splice(ys,y,0);
			  }
			  node.getX= function() {
			    return node.x[0];
			  }
			  node.getY= function() {
			    return node.y[0];
			  }
			  node.getLastX= function() {
			    return node.x[4];
			  }
			  node.getLastY= function() {
			    return node.y[4];
			  }
			  node.getName=function() {
			    return node.name;
			  }
			  node.getId=function() {
			    return node.id;
			  }
			  node.getTargets=function() {
			    return node.targets;
			  }
			  node.addTarget=function(id) {
			    node.targets.push(id);
			  }
			  node.draw = function(drawHistory) {
			    var nodeState=ranks[id];
			    var r=nodeState.getRadius()*2;
			    var start=drawHistory? node.x.length-1:0;
			    for (var i=start; i>=0; i--) {
			      var sat=255-128/p5.pow(p5.sq(node.vx)+p5.sq(node.vy)+1,0.3);
			      p5.push();
			        p5.colorMode(p5.RGB);
			        var alpha=p5.map(i, node.x.length,0,0,1);
			        alpha=p5.pow(alpha,3)*255;
			        p5.stroke(64,75,65,alpha);
//			        p5.colorMode(p5.HSB);
			        p5.fill(137,177,81,alpha);
			        var r1=p5.map(i,0,node.x.length,r,0);
			        p5.ellipse(node.x[i],node.y[i],r1,r1);
			      p5.pop();
			    }
			  }
			  node.flash = function() {
				p5.push();
			      var ns=ranks[node.id];
			      var r=ns.getRadius()*2;
			      p5.fill(250,215,123,128);
			      p5.noStroke();
			      p5.ellipse(node.getX(),node.getY(),flashingRadius*r,flashingRadius*r);
			    p5.pop();
			  }
			  return node;
			}
		
		p5.setup = function() {
			p5.createCanvas(w,h);
			  for (var i in events) {
			    var e=events[i];
			    var autore=e.author;
			    autore.x=p5.random(0,p5.width);
			    autore.y=p5.random(0,p5.height);
			    var id=autore.id;
			    if (nodi[id]!=={}) {
			      nodi[id]=createNode(id,autore.name);
			      ranks[id]=createNodeState();
			    }
			    switch (e.action) {
			      case "POST":
			        archi.push({from:id, to:id})
			        break;
			      case "TAG":
			      case "LIKE":
			      case "COMMENT":
			        var oggetto=e.object;
			        var id1=oggetto.id;
			        if (nodi[id1]!=={}) {
			          nodi[id1]=createNode(id1,oggetto.name);
			          ranks[id1]=createNodeState();
			        }
			        archi.push({from:id, to:id1})
			        break;
			    }
			  }
			}
		
		p5.draw =function() {
			if(p5.touchIsDown){
				p5.mouseX=p5.touchX;
				p5.mouseY=p5.touchY;
			}
			  flashingRadius*=0.95;
			  if (draggingBar) {
			    barra=p5.map(p5.mouseX,20,p5.width-20,0,archi.length);
			    barra=p5.floor(p5.constrain(barra,0,archi.length));
			    flashingRadius=3;
			  } else if (dragged!==null) {
			    dragged.setX(p5.mouseX);    
			    dragged.setY(p5.mouseY);
			  }
			  
			  p5.background(245,242,234);
			  p5.stroke(64,75,65);
			  
			  var dx=0;
			  var dy=0;
			  var dx0=0;
			  var dy0=0;
			  var ns=null;
			  var f=0;
			  
			  for (var i in nodi) {
			    var nodo=nodi[i];
			    var targets=nodo.getTargets();
			    //calcolo d0, distanza del nodo dal centro del canvas e applico la forza di gravità
			    dx0=nodo.getX()-p5.width/2;
			    dy0=nodo.getY()-p5.height/2;
			    var d0=p5.sqrt(p5.sq(dx0)+p5.sq(dy0));
			    if (d0<1) d0=1;
			    var mass=1;
			    ns=ranks[nodo.getId()];
			    if (ns) mass+=ns.posts/3;
			    nodo.ax= -g*mass*dx0/d0;
			    nodo.ay= -g*mass*dy0/d0;
			    //calcolo la forza di repulsione reciproca tra tutte le particelle
			    for (var j in nodi) {
			      if (i==j) continue;
			      var m=nodi[j];
			      dx=nodo.getX()-m.getX();
			      dy=nodo.getY()-m.getY();
			      var d=p5.pow(p5.sq(dx)+p5.sq(dy),1.5);
			      if (d<10) {
			        //se i due nodi quasi coincidono, genero una forza intensa in una direzione casuale
//			        var a=p5.TWO_PI*p5.noise(p5.frameCount*0.01);
//			        dx=p5.cos(a);
//			        dy=p5.sin(a);
			        d=10;
			      }
			      f=q*(mass+1);
			      nodo.ax+=f*dx/d;
			      nodo.ay+=f*dy/d;
			    }
			  }
			  ranks={};
			  for (i in nodi) {
			    ranks[i]=createNodeState();
			  }
			  for (i=0; i<barra; i++) {
			    var arco=archi[i];
			    var n1=nodi[arco.from];
			    var m1=nodi[arco.to];
			    ns=ranks[arco.from];
			    if (arco.from!==arco.to) {
			      ns.links[arco.to]++;
			      flashing=null;
			    } else {
			      flashing=n1;
			      ns.posts++;
			    }
			    ranks[arco.from]=ns;
			    var ms=ranks[arco.to];
			    if (arco.from!==arco.to) ms.links[arco.from]++;
			    ranks[arco.to]=ms;
			    dx=n1.getX()-m1.getX();
			    dy=n1.getY()-m1.getY();
			    //disegno l'arco da n1 a m1 come curva di bezier di tipo quadratico
			    p5.push();
			      p5.noFill();
			      p5.strokeWeight((p5.log(ns.links[arco.to])+1)/p5.log(2));
			      var xa=(n1.getLastX()+m1.getLastX())*0.5;
			      var ya=(n1.getLastY()+m1.getLastY())*0.5;
			      p5.bezier(n1.getX(),n1.getY(), xa,ya, xa,ya, m1.getX(),m1.getY());
			    p5.pop();
			    //applico la forza elastica di attrazione lungo l'arco
			    n1.ax+= -k*dx;
			    n1.ay+= -k*dy;
			    m1.ax+=  k*dx;
			    m1.ay+=  k*dy;
			  }
			  f=p5.frameCount*p5.sqrt(t)/p5.TWO_PI;
			  for (var i18 in nodi) {
			    var n2=nodi[i18];
			    if (flashing===n2) n2.flash();
			    n2.draw(n2!==dragged);
			    
			    //aggiorno la velocità
			    n2.vx+=n2.ax*dt;
			    n2.vy+=n2.ay*dt;

			    //introduco l'attrito
			    n2.vx*=friction;
			    n2.vy*=friction;
			    
			    //agitazione termica
			    n2.vx+=t*p5.sin(f+n2.phase);
			    n2.vy+=t*p5.cos(f+n2.phase);
			    
			    //aggiorno la posizione
			    n2.setX(n2.getX()+n2.vx*dt);
			    n2.setY(n2.getY()+n2.vy*dt);
			  
			    //forzo le particelle dentro il canvas
			    if (n2.getX()<5) {
			      n2.setX(5);
			      n2.vx*= -1;
			    } else if (n2.getX()>p5.width-5) {
			      n2.setX(p5.width-5);
			      n2.vx*= -1;
			    }
			    if (n2.getY()<5) {
			      n2.setY(5);
			      n2.vy*= -1;
			    } else if (n2.getY()> p5.height-5) {
			      n2.setY(p5.height-5);
			      n2.vy*= -1;
			    }
			  }
			  if (inside) {
				p5.push();
				  p5.fill(224);
				  p5.stroke(128);
				  p5.rect(inside.getX()+10, inside.getY()+10,10+p5.textWidth(inside.getName()),25);
				  p5.fill(0);
				  p5.text(inside.getName(), inside.getX()+15, inside.getY()+28);
				p5.pop();
			  }
			  //disegno lo slider
			  p5.push();
			    p5.stroke(255);
			    p5.strokeWeight(3);
			    p5.line(20,p5.height-20,p5.width-20,p5.height-20);
			    p5.stroke(0);
			    p5.strokeWeight(1);
			    p5.line(20,p5.height-20,p5.width-20,p5.height-20);
			    var x4=p5.map(barra,0,archi.length,20, p5.width-20);
			    var y4=p5.height-20;
			    p5.stroke(0);
			    p5.colorMode(p5.HSB,255);
			    p5.fill(36,120,196);
			    p5.ellipse(x4,y4,20,20);
			    p5.noStroke();
			    for (i=10; i>0; i--) {
			      p5.fill(36,120,226-3*i);
			      p5.ellipse(x4-2,y4-2,i,i);
			    }
		            p5.colorMode(p5.RGB);
			  p5.pop();
			}
		
		p5.mousePressed = function() {
			  var x=p5.map(barra,0,archi.length,20,p5.width-20);
			  var y=p5.height-20;
			  var dx=p5.mouseX-x;
			  var dy=p5.mouseY-y;
			  var d=p5.sq(dx)+p5.sq(dy);
			  if (d<400) 
			    draggingBar=true;
			  

			  for (var i in nodi) {
			    var nodo=nodi[i];
			    dx=p5.mouseX-nodo.getX();
			    dy=p5.mouseY-nodo.getY();
			    d=p5.sq(dx)+p5.sq(dy);
			    var id=nodo.getId();
			    var r=25;
			    var ns=ranks[id];
			    if (ns) 
			      r=ns.getRadius();
			    if (d<r*r) {
			      dragged=nodo;
			      return;
			    }
			  }
			}
		
		p5.touchStarted = function() {
			  var x=p5.map(barra,0,archi.length,20,p5.width-20);
			  var y=p5.height-20;
			  var dx=p5.touchX-x;
			  var dy=p5.touchY-y;
			  var d=p5.sq(dx)+p5.sq(dy);
			  if (d<1000) 
			    draggingBar=true;
			  

			  for (var i in nodi) {
			    var nodo=nodi[i];
			    dx=p5.touchX-nodo.getX();
			    dy=p5.touchY-nodo.getY();
			    d=p5.sq(dx)+p5.sq(dy);
			    var id=nodo.getId();
			    var r=25;
			    var ns=ranks[id];
			    if (ns) 
			      r=ns.getRadius();
			    if (d*0.25<r*r) {
			      dragged=nodo;
			      return true;
			    }
			  }
			  
			  return true;
			}
		
		p5.mouseMoved = function() {
			  inside=null;
			  for (var id in nodi) {
			    var n=nodi[id];
			    var ns=ranks[id];
			    if (!ns) ns=createNodeState();
			    var r=ns.getRadius();
			    var dx=p5.mouseX-n.getX();
			    var dy=p5.mouseY-n.getY();
			    var d=p5.sq(dx)+p5.sq(dy);
			    if (d<r*r) {
			      inside=n;
			      break;
			    }
			  }
			}
		
		p5.touchMoved = function() {
			  inside=null;
			  for (var id in nodi) {
			    var n=nodi[id];
			    var ns=ranks[id];
			    if (!ns) ns=createNodeState();
			    var r=ns.getRadius();
			    var dx=p5.touchX-n.getX();
			    var dy=p5.touchY-n.getY();
			    var d=p5.sq(dx)+p5.sq(dy);
			    if (d*0.25<r*r) {
			      inside=n;
			      break;
			    }
			  }
			  return true;
			}
		
		p5.mouseReleased = function() {
			  dragged=null;
			  draggingBar=false;
			}
		
		p5.touchEnded = function() {
			  dragged=null;
			  draggingBar=false;
			  return true;
			}

		var shuffleNodes = function() {
			  for (var id in nodi) {
			    var nodo=nodi[id]
			    nodo.setX(p5.random(0,p5.width));
			    nodo.setY(p5.random(0,p5.height));
			  }
			}
		
		p5.keyTyped = function() {
			  switch (p5.key) {
			    case ' ':
			    case '+':
			      barra=p5.constrain(barra+1,0,archi.length);
			      flashingRadius=3;
			      break;
			    case '-':
			      barra=p5.constrain(barra-1,0,archi.length);
			      flashingRadius=3;
			      break;
			    case 'c':
			    case 'C':
			      barra=0;
			      flashingRadius=0;
			      break;  
			    case 's':
			    case 'S':
			      shuffleNodes();
			      break;
			    case 'h':
			    case 'H':
			      t=p5.min(10,t*1.25);
			      break;
			    case 'l':
			    case 'L':
			      t=p5.max(0,t/1.25);
			  }
			  return false;
			}


	}
 }]);
	 

angular.module("smiled.application").service('unauthorizedInterceptor', ['$rootScope', '$q',                                                                  
 function($rootScope,$q) {
	
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


angular.module('smiled.application').factory('userService', [ '$http', '$q', '$cookies', '$rootScope',
               function userService($http, $q, $cookies, $rootScope){


	var lastScenarioId = "";
	var lastMe = {};
	
	var setScenarioId = function(id){
		lastScenarioId = id;
	}
	
	var getScenarioId = function(){
		return lastScenarioId;
	}
	
	var getLastMe = function(){
		return lastMe;
	}
	
	
	var getMe = function(){
		var u = $q.defer();
		$http.get('/api/v1/me').then(
			function(response){
				u.resolve(response.data);
				$cookies.put('myMescholaId', response.data.id);
				lastMe=response.data;
				$rootScope.$broadcast("meschola.login",{id : response.data.id});
			},
			function(reason){
				u.reject(reason);
				lastMe={};
			}
		);
		return u.promise;
	}
	
	var getUserByEmail = function(email){
		var u = $q.defer();
		$http.get('/api/v1/userByEmail?email='+ email).then(
			function(response){
				u.resolve(response.data);
				
			},
			function(reason){
				u.reject(reason);
			}
		);
		return u.promise;
	}
		
	var confirmRegisterTeacher = function (token, email){
		var e = $q.defer();
		$http.put("/api/v1/confirmRegisterTeacher?token="+ token +"&email="+ email).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					console.log(reason);
					e.reject(reason);
				}
		);
		return e.promise;
	}
	
	var deleteRegisterTeacher = function (token, email){
		var e = $q.defer();
		$http.delete("/api/v1/deleteRegisterTeacher?token="+ token +"&email="+ email).then(
				function(response){
					e.resolve(response.data);
				},
				function(reason){
					console.log(reason);
					e.reject(reason);
				}
		);
		return e.promise;
	}
	
	var getUser = function(id){
		var u = $q.defer();
		$http.get('/api/v1/users/'+id).then(
			function(response){
			
				u.resolve(response.data);
			},
			function(reason){
				u.reject(reason);
			}
		);
		return u.promise;
	}
	
	var updateMe = function(updateUserDTO){
		
		var c = $q.defer();
		$http.put("/api/v1/me/", updateUserDTO).then(
				function(response){
					c.resolve(response.data);
				},
				function(reason){
					c.reject(reason);
				}
		);
		return c.promise;
	}



	var logout = function(){
		var log = $q.defer()
		$http({
			url: '/apiLogout',
			method: 'POST',
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(
				function(data){
					lastMe={};
					$cookies.remove('myMescholaId');
					log.resolve(data);
					$rootScope.$broadcast("meschola.logout");
				},
				function(reason){
					console.log("Logout failed: "+reason);
					log.reject(reason);
				}
			);
		return log.promise;
	}
	
	var login = function(email, password){
		var log = $q.defer();
		var e=encodeURIComponent(email);
		var p=encodeURIComponent(password);
//		"&_spring_security_remember_me=true"+
		$http({
			url: '/apiLogin',
			method: 'POST',
			data: 'j_username='+e+'&j_password='+p+"&submit=",
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(
				function(data){
					log.resolve(data);
				},
				function(reason){
					console.log("Authentication failed: ");
					console.log(reason);
					log.reject(reason);
				}
		);
		return log.promise;
	}
	
	var observerChangePersonalCoverCallbacks = [];
	
	//register an observer
	var registerObserverPersonalCover = function(callback){
		observerChangePersonalCoverCallbacks.push(callback);
	};
	  
	//call this when you know 'foo' has been changed
	var notifyPersonalCoverObservers = function(){
		angular.forEach(observerChangePersonalCoverCallbacks, function(callback){
			callback();
		});
	};
	
	var changePassword = function(passwordDTO){
		var s = $q.defer();
		$http.put("/api/v1/password", passwordDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var changeFirstPassword = function(firstPasswordDTO){
		var s = $q.defer();
		$http.put("/api/v1/firstPassword", firstPasswordDTO).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var forgotPasswordRequest = function(email){
		var s = $q.defer();
		$http.post("/api/v1/forgotPasswordRequest", email).then(
				function(response){
					s.resolve(response.data);
				},
				function(reason){
					s.reject(reason);
				}
		);
		return s.promise;
	}
	
	var getMeForPermission = function(){
		if(lastMe.hasOwnProperty('id')){
			var s = $q.defer();
			s.resolve(lastMe);
			return s.promise;
		}else
			return getMe();
	}
	
	return {
		login: login,
		logout: logout,
		getMe : getMe, 
		getLastMe : getLastMe,
		getUser: getUser,
		registerObserverPersonalCover: registerObserverPersonalCover,
		notifyPersonalCoverObservers: notifyPersonalCoverObservers,
		setScenarioId : setScenarioId,
		getScenarioId : getScenarioId,
		changePassword : changePassword,
		changeFirstPassword : changeFirstPassword,
		updateMe : updateMe,
		confirmRegisterTeacher : confirmRegisterTeacher,
		forgotPasswordRequest : forgotPasswordRequest,
		deleteRegisterTeacher : deleteRegisterTeacher,
		getUserByEmail : getUserByEmail,
		getMeForPermission : getMeForPermission
	}

	

}]);

angular.module('smiled.application').factory('webSocketService', [ '$timeout','messageService', 'notifyService', '$rootScope',
               function webSocketService($timeout, messageService, notifyService, $rootScope){

	var service = {};
	
	var socket = null;
	var exp=0;
	var logged=true;

	
	service.RECONNECT_TIMEOUT = 1000;
	service.START_AFTER_TIME_TO_SETUP=700;
	service.SOCKET_URL = "/websocket/messages";
	//service.CHAT_TOPIC = "/topic/message";
	//service.CHAT_BROKER = "/app/chat";
	 
	var getTimeout = function(){
		var base;
		if(exp!=0)
			base=exp*service.RECONNECT_TIMEOUT;
		else
			base=service.RECONNECT_TIMEOUT;
		
		return base+(Math.random()*1000);
	}
	
	var resetTimeout = function(){
		console.log("ON OPEN!!!!!!!!");
		exp=0;
	}
	
	//Data usually are ACK_N, VIEW_N, ACK_M, VIEW_M, or USER_MESSAGE 
	var send = function(data){
		socket.send(JSON.stringify(data));
	}

	 
	var reconnect = function() {
		if(logged){
			$timeout(function() {
				retry();
		    }, getTimeout());  //aggiungere un meccanismo di backoff esponenziale per la riconnessione
		}
	};
	
	var retry = function(){
		if(exp==0)
			exp=1;
		else if(exp<256)
			exp=exp*2;
		initialize();
	}
	
	var initialize = function() {
		socket = new SockJS(service.SOCKET_URL);
		console.log(socket);

		console.log('open ws connection on webSocketService!!!!');
		
		socket.onopen = function(){
			resetTimeout();
		}
		
		socket.onmessage = function(e) {
	 	   	var msg = JSON.parse(e.data);
	 	    if(msg.type=="NOTIFICATION"){ 	    	
	 	    	notifyService.newNotifyOrPost(msg);
	 	    }else{
	 	    	console.log("message is a message");
	 	    }
		};
		
		socket.onclose = function() {
			socket = null;
	 	    console.log('close ws connection on webSocketService');
	 	    reconnect();
	 	};
	};
	
	
	if(!socket || socket==null){
		console.log("WEB SOCKET SERVICE INITIALIZING after load of webSocketService...");
		initialize();
	}
	
	
    var onLoginListener = $rootScope.$on('meschola.login', function () {
    	logged=true;
    	if(!socket || socket==null){
    		console.log("WEB SOCKET SERVICE INITIALIZING after onLoginListener...");
    		initialize();
    	}
    });
    
    var onLogoutListener = $rootScope.$on('meschola.logout', function () {
    	logged=false;
    });
	
	$rootScope.$on("$destroy", function() {
		onLoginListener();
		onLogoutListener();
	});
	
	
//	$timeout(function() {
//		initialize();
//      }, service.START_AFTER_TIME_TO_SETUP);
//	
	
	return {
		send : send
	};

}]);

angular.module("smiled.application").directive("alertArticle", [ 
                                                              function(){
                         	return {
                         		restrict: 'E',
                         		templateUrl: "assets/public/partials/alertArticle.html",
                         		scope : {
                         			 message: '=',
                         				
                         			
                         		},
                         		bindToController: true,
                         		controller: ['$scope', function($scope){
                         			var self = this;
                         			self.messageTitle = "Attento, titolo troppo lungo";
                         			
                         		}],
                         		
                         		controllerAs: "alertArticle"
                         		
                         	}
                         }]);
angular.module("smiled.application").directive('alertgeneric',['alertingGeneric', function(alertingGeneric) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingGeneric.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingGeneric.currentAlerts;
            }
        };

}]);
angular.module("smiled.application").directive('alertlogin',['alertingLogin', function(alertingLogin) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingLogin.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingLogin.currentAlerts;
            }
        };

}]);
angular.module("smiled.application").directive('alertregistration',['alertingRegistration', function(alertingRegistration) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingRegistration.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingRegistration.currentAlerts;
            }
        };

}]);
angular.module("smiled.application").directive('alertscenario',['alertingScenario', function(alertingScenario) {

        return {
            restrict: "AE",
            templateUrl: "assets/public/partials/alerts.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingScenario.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingScenario.currentAlerts;
            }
        };

}]);
angular.module("smiled.application").directive('articleColumnImage', ['article', '$state',
                                     function(article, $state){
	
	return {
		
		templateUrl: "assets/private/partials/article-column-image.html",
		restrict: "E",
		scope: {
			
			
		},
		
		controller: ['$scope',function($scope){
			var self = this;
			self.idTemplate = article.getIdCurrentTemplate();
			self.article = {};
			
			self.loadArticle = function(idTemplate) {
				
				switch (idTemplate) {
				case "id2":
				self.idArticle = "5";
				self.article = article.getArticleObject(self.idArticle);
				console.log("ERROR" + " " + self.idTemplate);
				console.log(self.article);
				break;
				

				default:
				console.log("ERROR" + " " + self.idTemplate);
					
				}	
				
			}
			
			
			self.loadArticle("id" + self.idTemplate);
			
			self.goToDraft = function (){
				
				//PROVVISORIO per caricamento dati corretti articolo 
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticleSimple');
				console.log(self.idArticle + "ID-ARTICLE");
				
			}
		}],
		
		controllerAs: "articleColumnImage"
		
		
	}
	
	
	
}]);
angular.module("smiled.application").directive('articleOneColumn', ['article', '$state',
                                     function(article, $state){

	return {
		
		templateUrl: "assets/private/partials/article-one-column.html",
		restrict: "E",
		scope: {
			
			
		},
		
		controller: ['$scope',function($scope){
		var self = this;
		self.idTemplate = article.getIdCurrentTemplate();
		self.article = {}; 
		
		self.loadArticle = function(idTemplate) {
			
			switch (idTemplate) {
			case "id2":
			self.idArticle = "6";
			self.article = article.getArticleObject(self.idArticle);
			break;
			

			default:
			console.log("ERROR" + " " + self.idTemplate);
				
			}	
			
		}
		
		
		self.loadArticle("id" + self.idTemplate);
			
		
		self.goToDraft = function(){
			
			//PROVVISORIO per caricamento dati corretti articolo 
			article.setArticleId(self.idArticle);
			$state.go('logged.scenario.draftArticleSimple');
			
		}
		
		
		
		self.closeWarning = function (s){
			
			switch (s) {
			
			case "title":
			self.showWarningTitle = false;
			break;
			
			case "col1":
			self.showWarningTextCol1 = false; 
			break;
			
			
			default:
			console.log("ERROR");
				
			}
		}
			
		
	}],
		
		controllerAs: "articleOneColumn"
		
		
	}
	
	
	
	
}]);
angular.module("smiled.application").directive('articleOneColumnImg', ['article', '$state', 'apiService', '$stateParams','alertingGeneric', 'CONSTANTS', 'modalService',
                                     function(article, $state, apiService, $stateParams,alertingGeneric, CONSTANTS, modalService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-one-column-img.html",
		//isolated scope 
		scope: {
			newspaper: "=?"
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			var scenId = $stateParams.id;
			self.showWarningTitle = false; 
			self.showWarningText = false;  
			self.idArticle = 0;
			self.article = {};
			self.isSubtitle = false;
			self.currentHeadline = {}; 
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.isImage = true; 
			
			//initialize variable
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.publishedNewsNumber = article.getPublishedNewspaperNumber(); 
			self.isPublished; 
			self.isFirst; 
			self.isDraft = article.getIsDraft(); 
			self.isJustDeleted = article.getIsJustDeleted(); 
			self.articles = []; 
			self.article = {};
			var oldName = angular.copy($scope.newspaper.name);
			
			/*-------------------------- ARTICOLO PER GIORNALE PUBBLICATO ---------------------------------*/			
			self.loadArticlePublished = function(newsNumber){
				apiService.getpublishedNewspapers(scenId).then (
						function(data) {
							self.publishedNewspapers = data;  
							var found = false;
							for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
								if(self.publishedNewspapers[i].number == newsNumber) { 
									for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
										self.newspaper = self.publishedNewspapers[i]; 
										console.log("GIORNALE PUBBLICATO"); 
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 2){
											self.article = self.publishedNewspapers[i].articles[j];
											self.article.image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
											self.article.author = self.publishedNewspapers[i].articles[j].user.firstname + " " + self.publishedNewspapers[i].articles[j].user.lastname;
											console.log(self.article); 
											found = true;
											break; 

										}

									}

								}

							}
							}
						,function(reason){	
						}	
						);	
			}
			
			/*-------------------------- ARTICOLO PER GIORNALE IN BOZZA ---------------------------------*/
			//GET article 
			self.loadArticle = function(idTemplate) { 
				switch (idTemplate) {
				
				//se template 1 carico articolo relativo a quel template
				case 1:
					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){
						
						self.newspaper = data; 
						self.articles = self.newspaper.articles;  
						 
						//se non ci sono articoli scritti 
						
						if(self.articles.length == 0) {
							self.idArticle = 2;
							article.setArticleObject(self.idArticle);
							self.article = article.getArticleObject(self.idArticle);
							
						} 
						else {
						
							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){
								if(self.articles[i].idArticleTemplate == 2){
									self.article = self.articles[i];
									
									if(self.article.imageId == null) {
										self.article.image = null; 
									} else {
										
										self.article.image = CONSTANTS.urlMedia(self.article.imageId);
									}
									
									
									self.idArticle = 2;  
									break; 
									
								} else {
									
									self.idArticle = 2;
									article.setArticleObject(self.idArticle);
									self.article = article.getArticleObject(self.idArticle);
								
								}
					
							}
					}
						},
						
					  function(reason){
					
						console.log("Errore recupero articolo.");	
					}
			)
				break; //fine case 1	
				
					
				case 2:
					
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;
					
					
				default:
					console.log("ERROR" + " " + self.idTemplate);	
				}	
				
			}
			

			
			self.loadArticleFirst = function(idTemplate) {
				self.isFirst = true; 
				switch (idTemplate) {
				case "id1":
				self.idArticle = 2; 
				article.setArticleObject(self.idArticle);
				self.article = article.getArticleObject(self.idArticle);
				break;
				
				case "id2":
				
				self.idArticle = "4";
				self.article = article.getArticleObject(self.idArticle);
				break;

				default:
				console.log("ERROR" + " " + self.idTemplate);
					
				}	
				
			}

			
			
			//caricamento template in base all'esistenza o meno di un giornale in bozza 
			
			if($state.current.name == 'logged.scenario.template1') {
				self.isPublished = false; 
			if($scope.newspaper.status == undefined && self.isDraft == false || $scope.newspaper.status  == 'PUBLISHED' 
				|| self.isJustDeleted == true && self.isDraft == false ) {
				
				self.loadArticleFirst("id"+self.idChoosenTemplate);		
			} 
			else if($scope.newspaper.status == 'DRAFT' || oldName == $scope.newspaper.name)
				{
				article.getIdTemplate().then(
					function(data){
						self.idTemplate = data;
						console.log(self.idTemplate); 
						self.loadArticle(self.idTemplate);
					},
					function(reason) {
						console.log(reason);
					}
				);
				
				}
		
			}
			
			
			if($state.current.name == 'logged.scenario.newspublished'){
				self.isPublished = true; 
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
				self.loadArticlePublished(self.publishedNewsNumber); 
							
			}		
			}
			
			
	
			self.goToDraft = function(){
				
				
				self.currentHeadline = article.getNameJustCreated();  
				 
				if(self.currentHeadline == "" && self.newspaper.status == undefined || self.isJustDeleted == true){
					//modalService.showModalCreateTitle(self.newspaper);
					modalService.showAlertNewspaper();
				} else {
					
					console.log(self.idArticle); 
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticleSimple');
					
				}
				
				
			}
			
			
			self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "text":
				self.showWarningText = false; 
				break;
				
				default:
				console.log("ERROR");
					
				}
			}
			
			
			
		}],
		
		controllerAs: "articleOneColumnImg",
		link : function(scope,elem,attrs,ctrl){
			/*controllo titolo */
			scope.$watch('articleOneColumnImg.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>25) {
				ctrl.showWarningTitle = true;
				console.log ("ATTENZIONE");
				
			} else
				{
				ctrl.showWarningTitle = false; 
				console.log ("VA BENE");
				
				}
				}
			
			});	
			
			
			
			scope.$watch('articleOneColumnImg.article.text1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>1159) {
					ctrl.showWarningText = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningText = false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
	
			
		}


} 
}]);

angular.module("smiled.application").directive('articleTwoColumns', ['article', '$state', 'apiService', '$stateParams', 'alertingGeneric', 'modalService', 'CONSTANTS', 'userService',
                                     function(article, $state, apiService, $stateParams, alertingGeneric, modalService, CONSTANTS, userService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns.html",
		scope: {
			loggedUser: '=?',
			scenario: '=?',
			newspaper: "=?"
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
		
			self.showWarningTitle = false; 
			self.showWarningSubtitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			var scenId = $stateParams.id; 
			
			/*self.lastNewspaper = article.getCurrentNewspaper();*/
			
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.currentHeadline = article.getNameJustCreated(); 
			console.log(self.idChoosenTemplate); 
			self.idArticle = 0;
			/*self.idTemplate = article.getIdTemplate();*/
			
			/*self.newspaper = {};*/ 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.isPublished; 
			self.isJournalist; 
			self.isFirst; 
			self.isJustDeleted = article.getIsJustDeleted(); 
			self.isDraft = article.getIsDraft(); 
			self.articles = []; 
			self.article = {};
			self.publishedNewsNumber = article.getPublishedNewspaperNumber(); 
			//variabile che mi serve per un controllo sul caricamento degli articoli 
			//subito dopo che un giornale è stato cancellato
			var oldName = angular.copy($scope.newspaper.name); 
			
			
		
	/*-------------------------- ARTICOLO PER GIORNALE PUBBLICATO ---------------------------------*/

			self.loadArticlePublished = function(newsNumber){
				
				apiService.getpublishedNewspapers(scenId).then (
						
						function(data) {
							self.publishedNewspapers = data;
							var found = false;
							for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
								if(self.publishedNewspapers[i].number == newsNumber) {
									for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 1){
											self.article = self.publishedNewspapers[i].articles[j];
											self.article.author = self.publishedNewspapers[i].articles[j].user.firstname + " " + self.publishedNewspapers[i].articles[j].user.lastname; 
											
											console.log(self.article); 
											found = true;
											break; 

										}
									}

								}

							}
							}
						,function(reason){	
						}	
						);	
			}
	/*-------------------------- ARTICOLO PER GIORNALE IN BOZZA ---------------------------------*/
			//GET article 
			self.loadArticle = function(idTemplate) { 

				switch (idTemplate) {

				//se template 1 carico articolo relativo a quel template
				case 1:

					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){

						self.newspaper = data; 
						self.articles = self.newspaper.articles;  

						//non ci sono articoli scritti 

						if(self.articles.length == 0) {
							self.idArticle = 1;
							article.setArticleObject(self.idArticle);
							self.article = article.getArticleObject(self.idArticle);


						} else {

							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){

								if(self.articles[i].idArticleTemplate == 1){
									self.article = self.articles[i];
									self.idArticle = 1;  
									break; 

								} else {	
									
									self.idArticle = 1; 
									article.setArticleObject(self.idArticle);
									self.article = article.getArticleObject(self.idArticle);
											
								}

							}
						}
					},

					function(reason){
						$state.go("logged.scenario.editorial"); 
						console.log("Errore recupero articolo.");	
					}
					)
					break; 	


				case 2:
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;


				default:
					console.log("ERROR" + " " + self.idTemplate);	
				}


			}
			
			self.loadArticleFirst = function(idTemplate){
				self.isFirst = true; 
				switch (idTemplate) {
				case "id1":
					self.idArticle = 1;
					article.setArticleObject(self.idArticle);
					self.article = article.getArticleObject(self.idArticle);
					console.log(self.article);
					break;

				case "id2":
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;


				default:
					console.log("ERROR" + " " + self.idTemplate);
				}
			}
	
			//caricamento template in base all'esistenza o meno di un giornale in bozza 
			if($state.current.name == 'logged.scenario.template1') {
				
				self.isPublished = false; 

				console.log(self.isDraft); 
				if($scope.newspaper.status == undefined && self.isDraft == false || 
					$scope.newspaper.status  == 'PUBLISHED' || self.isJustDeleted == true && self.isDraft == false ) {
					self.loadArticleFirst("id"+self.idChoosenTemplate);		
				} 
				
				
				else if($scope.newspaper.status == 'DRAFT' || self.isDraft == true)
					
				{
					var s = apiService.getMyLastNewspaper(scenId); 
					s.then(function(data){
						self.idTemplate = data.idTemplate;  
						console.log("PASSO DI QUI PER SCARICARE ARTICOLO"); 
						self.loadArticle(self.idTemplate);
					},function(reason){
					
						console.log("Errore.");	
					}
			)
					
				
				}	
			}
			
			if($state.current.name == 'logged.scenario.newspublished'){
				console.log("PASSO DI QUI, GIORNALE PUBBLICATO"); 
				self.isPublished = true;
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
					console.log("PASSO DI QUI PER CHIAMARE IL METODO DI CARICAMENTO" + self.publishedNewsNumber); 
					self.loadArticlePublished(self.publishedNewsNumber); 

				}		
			}
			//vai alle bozze
			self.goToDraft = function(){
				//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
				self.currentHeadline = article.getNameJustCreated(); 
			
				if(self.currentHeadline == "" && $scope.newspaper.status == undefined || self.isJustDeleted == true){
					modalService.showAlertNewspaper();

				} 

				else {
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticle2col');

				}

			}

			//chiusura warning 
			self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "subtitle":
				self.showWarningSubtitle = false;
				break;
				
				case "col1":
				self.showWarningTextCol1 = false; 
				break;
				
				case "col2":
				self.showWarningTextCol2 = false;
				break;
				
				default:
				console.log("ERROR");
					
				}
			}
		
			
			
			
		}],
		
		controllerAs: "articleTwoColumns",
		link : function(scope,elem,attrs,ctrl){
			
		
			
			/*controllo testo titolo */
			scope.$watch('articleTwoColumns.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>25) {
				ctrl.showWarningTitle = true;
				console.log ("ATTENZIONE");
				
			} else
				{
				ctrl.showWarningTitle = false; 
				console.log ("VA BENE");
				
				}
				}
			
			});	
			
			
			
			/*controllo testo sottotitolo */
			
			scope.$watch('articleTwoColumns.article.subtitle', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>27) {
					ctrl.showWarningSubtitle = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
			/*controllo testo prima colonna */
			
			scope.$watch('articleTwoColumns.article.text1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
					ctrl.showWarningTextCol1 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});

			/*controllo testo seconda colonna */
			
			scope.$watch('articleTwoColumns.article.text2', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
					ctrl.showWarningTextCol2 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol2= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
		}


} 
}]);

angular.module("smiled.application").directive('articleTwoColumnsImg', ['article', '$state','apiService','$stateParams', 'alertingGeneric','CONSTANTS','modalService', 
                                                                        function( article, $state, apiService, $stateParams, alertingGeneric, CONSTANTS, modalService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns-img.html",
		scope: {
			
			newspaper: "=?"
		},

		controller: ['$scope',function($scope){

			var self = this;
			var scenId = $stateParams.id;
			self.showWarningTitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			self.showWarningSubtitle = false; 
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			
			self.currentHeadline = article.getNameJustCreated();
			self.isImage = true; 
			self.idArticle = 0;

			self.newspaper = {}; 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.publishedNewsNumber = article.getPublishedNewspaperNumber();
			self.isPublished;
			self.isJustDeleted = article.getIsJustDeleted();
			self.isDraft = article.getIsDraft(); 
			self.isFirst; 
			self.articles = []; 
			self.article = {};

			var oldName = angular.copy($scope.newspaper.name);


			/*-------------------------- ARTICOLO PER GIORNALE PUBBLICATO ---------------------------------*/			
			self.loadArticlePublished = function(newsNumber){
				apiService.getpublishedNewspapers(scenId).then (
						function(data) {
							self.publishedNewspapers = data;
							var found = false;
							for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
								if(self.publishedNewspapers[i].number == newsNumber) { 
									
									for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 3){
											self.newspaper = self.publishedNewspapers[i]; 
											self.article = self.publishedNewspapers[i].articles[j];
											self.article.image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
											self.article.author = self.publishedNewspapers[i].articles[j].user.firstname + " " + self.publishedNewspapers[i].articles[j].user.lastname; 
											console.log(self.article); 
											found = true;
											break; 
										}

									}

								}

							}
						}
						,function(reason){	
						}	
				);	
			}

			/*--------------------------------------- GET ARTICLE  ----------------------------------------------*/



			self.loadArticle = function(idTemplate) { 
				switch (idTemplate) {

				//se template 1 carico articolo relativo a quel template
				case 1:
					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){

						self.newspaper = data; 
						self.articles = self.newspaper.articles;  
						
						//non ci sono articoli scritti 
						if(self.articles.length == 0) {
							self.idArticle = 3;
							article.setArticleObject(self.idArticle);
							self.article = article.getArticleObject(self.idArticle);


						} else {

							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){
								if(self.articles[i].idArticleTemplate == 3){
									self.article = self.articles[i];
									
									if(self.article.imageId == null) {
										self.article.image = null; 
									} else {
										
										self.article.image = CONSTANTS.urlMedia(self.article.imageId); 	
										
									}

									self.idArticle = 3;  
									break; 

								} else {			
									self.idArticle = 3;
									article.setArticleObject(self.idArticle);
									self.article = article.getArticleObject(self.idArticle);			
								}

							}
						}
					},

					function(reason){

						console.log("Errore recupero articolo.");	
					}
					)
					break; //fine case 1	


				case 2:
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;


				default:
					console.log("ERROR" + " " + self.idTemplate);	

				}

			}

			self.loadArticleFirst = function(idTemplate){
				self.isFirst = true; 
				switch (idTemplate) {
				case "id1":
					self.idArticle = 3;
					article.setArticleObject(self.idArticle);
					self.article = article.getArticleObject(self.idArticle);
					console.log(self.article); 
					break;

				case "id2":

					break;


				default:
					console.log("ERROR" + " " + self.idTemplate);
				}
			}

			//caricamento template in base all'esistenza o meno di un giornale in bozza 


			if($state.current.name == 'logged.scenario.template1') {
				self.isPublished = false; 
				if($scope.newspaper.status == undefined && self.isDraft == false || $scope.newspaper.status  == 'PUBLISHED' 
					|| self.isJustDeleted == true && self.isDraft == false ) {
					self.loadArticleFirst("id"+self.idChoosenTemplate);		
				} 
				else if($scope.newspaper.status == 'DRAFT'  || oldName == $scope.newspaper.name)
				{
					article.getIdTemplate().then(
						function(data){
							self.idTemplate = data;
							console.log(self.idTemplate); 
							self.loadArticle(self.idTemplate);
						},
						function(reason) {
							console.log(reason);
						}
					);
				}
			}

			if($state.current.name == 'logged.scenario.newspublished'){
				self.isPublished = true; 
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
					self.loadArticlePublished(self.publishedNewsNumber); 

				}		
			}

			self.goToDraft = function(){
				//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 

				self.currentHeadline = article.getNameJustCreated();  

				if(self.currentHeadline == "" && $scope.newspaper.status == undefined || self.isJustDeleted == true){
					//modalService.showModalCreateTitle(self.newspaper);
					modalService.showAlertNewspaper();
				} else {
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticle2col');
				}		
			}


			self.closeWarning = function (s){

				switch (s) {

				case "title":
					self.showWarningTitle = false;
					break;

				case "subtitle":
					self.showWarningSubtitle = false;
					break;

				case "col1":
					self.showWarningTextCol1 = false; 
					break;

				case "col2":
					self.showWarningTextCol2 = false;
					break;

				default:
					console.log("ERROR");

				}
			}
		}],

		/*----------------------  LINK FUNCTION - WATCH ON CHARACTERS  ---------------------*/


		controllerAs: "articleTwoColumnsImg",
		link : function(scope,elem,attrs,ctrl){
			/*controllo titolo */
			scope.$watch('articleTwoColumnsImg.article.title', function(newVal, oldVal){
				if(newVal){	
					if(newVal.length>28) {
						ctrl.showWarningTitle = true;
						console.log ("ATTENZIONE");

					} else
					{
						ctrl.showWarningTitle = false; 
						console.log ("VA BENE");

					}
				}

			});	



			/*controllo testo sottotitolo */

			scope.$watch('articleTwoColumnsImg.article.subtitle', function(newVal, oldVal){
				if(newVal){	
					if(newVal.length>26) {
						ctrl.showWarningSubtitle = true;
						console.log ("ATTENZIONE");

					} else
					{
						ctrl.showWarningTextCol1= false; 
						console.log ("VA BENE");

					}

				}
			});

			/*controllo testo prima colonna */

			scope.$watch('articleTwoColumnsImg.article.text1', function(newVal, oldVal){
				if(newVal){	
					if(newVal.length>594) {
						ctrl.showWarningTextCol1 = true;
						console.log ("ATTENZIONE");

					} else
					{
						ctrl.showWarningTextCol1= false; 
						console.log ("VA BENE");

					}

				}
			});


			scope.$watch('articleTwoColumnsImg.article.text2', function(newVal, oldVal){
				if(newVal){	
					if(newVal.length>594) {
						ctrl.showWarningTextCol2 = true;
						console.log ("ATTENZIONE");

					} else
					{
						ctrl.showWarningTextCol2= false; 
						console.log ("VA BENE");

					}

				}
			});



		}


	} 
}]);

angular.module("smiled.application").directive('blurElement',[
    function(){
		return {
			scope : {
				open : "="
			},
            restrict: 'A',
			link : function(scope,elem,attrs,ctrl){
				scope.$watch("open", function(currentValue, previousValue) {
					if (currentValue === true && !previousValue) {
						elem[0].focus();
					}else if (currentValue === false && previousValue === true) {
						elem[0].blur();
					}
				})
			}
		};
}]);
angular.module("smiled.application").directive('bsSwitch', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope : {
    	onCustomText : "@",
    	offCustomText : "@"
    },
    controller : function($scope) {
    	$scope.state;
    },
    controllerAs: "bsSwitch",
    link: function(scope, element, attrs, ngModelCtrl) {
      $(element).bootstrapSwitch({
        onSwitchChange: function(event, state) {
          scope.state = state;
          scope.$apply(function() {
        	 
            ngModelCtrl.$setViewValue(state);
          });
        }
      });
      $(element).bootstrapSwitch("onText", scope.onCustomText);
      $(element).bootstrapSwitch("offText", scope.offCustomText);
      $(element).bootstrapSwitch("labelText", "<span class='glyphicon glyphicon-resize-horizontal'></span>");

 }
  }
});
angular.module("smiled.application").directive('commentTo',[ 'apiService', 'CONSTANTS', 'modalService', 'notifyService',
    function(apiService, CONSTANTS, modalService, notifyService){
		return {
			templateUrl: "assets/private/partials/comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				currentCharacter : "=",
				scenarioId : "@",
				loggedUser : "="
			},
			controller : ['$scope' , function($scope){
				
				var numVisibleComment = CONSTANTS.visibleComment;
				var self = this;
				
				var charId = self.currentCharacter.id;
				var charName = self.currentCharacter.name;
				
				self.showViewOthers = false;
				self.showInsert = true;
				self.atLeastOneCommentWasSended = false;
				if(!self.currentCharacter || !self.currentCharacter.id)
					self.showInsert = false;
				
				self.visibleComments = new Array();
//				self.post.comments.reverse();
				
				var i=0;
				while(i<self.post.comments.length && i<numVisibleComment){
					self.visibleComments.unshift(self.post.comments[i]);
					i++;
				}
				
				if(self.post.comments.length>numVisibleComment)
					self.showViewOthers = true;
				
				self.openViewOthers = function(){
					
					self.visibleComments = angular.copy(self.post.comments);
					self.visibleComments.reverse();
//					for(var j=i; j<self.post.comments.length; j++){
//						self.visibleComments.unshift(self.post.comments[i]);
//					}
					self.showViewOthers = false;
				}
//				var onDestroy = function(){
////					if(self.atLeastOneCommentWasSended)
////						self.post.comments.reverse();
//				}
//				$scope.$on("$destroy", function(){
//					onDestroy();
//				});
//				
				
				
				self.addCommentToPost = function(){
					if(self.post.newComment){
						var comment = {};
						comment.text=self.post.newComment;
						comment.characterId = charId;
						//aggiungo commento al post
						apiService.sendCommentToPost(self.scenarioId, self.post.id, comment).then(
								function(data){
									comment.creationDate = new Date();
									comment.character = {};
									comment.character.id = self.currentCharacter.id;
									comment.character.firstname = self.currentCharacter.name;
									comment.user = {};
									comment.user.id = self.loggedUser.id;
									comment.user.firstname = self.loggedUser.firstName;
									comment.user.lastname = self.loggedUser.lastName;
									self.post.comments.splice(0,0,comment);
									self.post.newComment="";

									//prendo dal server nuovamente il post a cui ho aggiunto il commento
//									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
//											function(data){
//												self.post = data;
//												self.post.newComment="";
//												var numVisible = self.visibleComments.length;
//												
//												self.visibleComments = self.post.comments;
//												
//												self.showViewOthers = false;
//												self.atLeastOneCommentWasSended = true;
////												for(var i=0; i<self.posts.length; i++){
////													if(self.posts[i].id==data.id){
////														data.newComment="";
////														if(data.imageId)
////															data.imageUrl = CONSTANTS.urlMedia(data.imageId);
////														data.character.cover = CONSTANTS.urlCharacterCover(self.scen.id,data.character.id);
////														//self.posts.splice(i,1,data);
////														self.posts[i] = data;
////														
////													}
////												}
//												
//											},
//											function(reason){
//												console.log("error in insert new post in array");
//											}
//									);
								},
								function(reason){
									console.log("fail to send comment: "+reason);
									if(reason.status=="403"){
									modalService.showModalOldCharacterChangeOnComment(charName);	
									}
								}
						);
					}
				}
			}],
			controllerAs: "commentTo",
			bindToController: true,
			link : function(scope,elem,attrs,ctrl){
				scope.$watch('commentTo.post.comments.length', function(newVal, oldVal){
					if(newVal!=oldVal && newVal>0){
						if(ctrl.showViewOthers){
							ctrl.visibleComments.push(ctrl.post.comments[0]);
						}else
							ctrl.openViewOthers();

//						ctrl.visibleComments.reverse();
//						ctrl.atLeastOneCommentWasSended = true;
					}
				});
				
				scope.$watch('commentTo.post.newComment.length', function(newVal, oldVal){
					if(newVal>0 && (oldVal==0 || oldVal==undefined)){
						notifyService.addToInEditPost(ctrl.post.id);
					}else if((newVal==0 || newVal==undefined) && oldVal>0){
						notifyService.removeToInEditPost(ctrl.post.id);
					}
				});
				
				scope.$on('$destroy', function(){
					ctrl.post.newComment="";
					notifyService.removeToInEditPost(ctrl.post.id);
				});
			}
		};
}]);
angular.module("smiled.application").directive("customDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/private/partials/customDatePicker.html",
        scope: {
        	startDateNumber : "=?",
        	endDateNumber : "=?",
        	dateNumber : "=?",
        	date : "=?",
        	startDate : "=?",
        	endDate : "=?",
        	dateString : "=?",
        	timeNumber : "=?"
        },
        controller : function (){
        	var self = this;
        	
        	var selected={};
        	
//        	if(!self.timeNumber){
//        		self.timeNumber=0;
//        	}
        	if(self.startDate){
        		self.startDate.day=parseInt(self.startDate.day);
        		self.startDate.month=parseInt(self.startDate.month);
        		self.startDate.year=parseInt(self.startDate.year);
        	}
         	
        	if(self.endDate){
        		self.endDate.day=parseInt(self.endDate.day);
        		self.endDate.month=parseInt(self.endDate.month);
        		self.endDate.year=parseInt(self.endDate.year);
        	}
        	/*Se non viene passata una data iniziale il datepicker prende come valore minimo assumibile il minimo
        	 * rappresentabile da un Julian Day Number (di seguito JDN), ovvero il 24 novembre del 4713 A.C. */
        	if(!self.startDate && !self.startDateNumber){
        		self.startDateNumber=0;
        		self.startDate = {};
        	}
        		
        	/*Se non viene passata una data finale il datepicker prende come valore massimo assumibile un valore di JDN
        	 * che rappresenta l'anno 100.000 D.C */
        	if(!self.endDateNumber && !self.endDate){
        		self.endDateNumber=38245427;
        		self.endDate = {};
        	}
        
        	
        	self.currentMonthDate = {};
        	self.days;
        	var years = new Array();
        	var yearPage=0;
        	var yearPageSize=16;
        	var maxPage=0;
        	var yearMatrixSize=4;
        	self.showDays=true;
        	self.yearMatrix = new Array();
        	for(var i=0;i<yearMatrixSize;i++){
            	self.yearMatrix[i] = new Array();
        	}


        	var emptyYearMatrix = function(){
        		for(var i=0; i<yearMatrixSize;i++)
        			for(var j=0; j<yearMatrixSize;j++)
        				self.yearMatrix[i][j]="";
        	}
        	
        	var julianNumberToDate = function(jd, date){
        		  var l = jd + 68569;
        	      var n = parseInt(( 4 * l ) / 146097);
        	      l = l - parseInt(( 146097 * n + 3 ) / 4);
        	      var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
        	      l = l - parseInt(( 1461 * i ) / 4) + 31;
        	      var j = parseInt(( 80 * l ) / 2447);
        	      date.day = l - parseInt(( 2447 * j ) / 80);
        	      l = parseInt(j / 11);
        	      date.month = j + 2 - ( 12 * l );
        	      date.year = 100 * ( n - 49 ) + i + l;
        	      date.dow = jd%7;
        	}
        	
        	        	
        	var dateToJulianNumber = function(date){
        		 
        		  var jd = parseInt(( 1461 * ( date.year + 4800 + parseInt(( date.month - 14 ) / 12) ) ) / 4) +
                  parseInt(( 367 * ( date.month - 2 - 12 *  parseInt(( date.month - 14 ) / 12)  ) ) / 12) -
                  parseInt(( 3 * parseInt(( date.year + 4900 + parseInt(( date.month - 14 ) / 12) ) / 100)  ) / 4) +
                  date.day - 32075 ;
        		return jd;
        	}
        	
        	var getMonthString = function(month){
        		return CONSTANTS.monthString(month);
        	} 
        	
        	if(self.dateNumber){
        		self.currentDate = {};
        		julianNumberToDate(self.dateNumber, self.currentDate);
        	}
        	
        	if(self.startDateNumber)
        		julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
        	else
        		self.startDateNumber=dateToJulianNumber(self.startDate);
        	if(self.endDateNumber)
        		julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
        	else
        		self.endDateNumber=dateToJulianNumber(self.endDate);

        	if(self.dateNumber){
        		julianNumberToDate(self.dateNumber-(self.currentDate.day-1),self.currentMonthDate);
        	}else
        		julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
        		

//        	if(!self.startDate)
//        		julianNumberToDate(parseInt(self.startDateNumber), self.startDate);
//        	else
//        	{
//        		self.startDateNumber = dateToJulianNumber(self.startDate);
//        	}
//        	
//        	if(!self.endDate)
//        		julianNumberToDate(parseInt(self.endDateNumber), self.endDate);
//        	else{
//        		self.endDateNumber = dateToJulianNumber(self.endDate);
//        	}
//
//        	if(!self.dateNumber && !self.date)
//           		julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
//           	else if(!self.date)
//           		julianNumberToDate(self.dateNumber,self.currentMonthDate);
//           	else{
//           		var nDate = dateToJulianNumber(self.date);
//           		if(nDate)
//           			julianNumberToDate(nDate-(self.startDate.day-1),self.currentMonthDate);
//           		else
//           			julianNumberToDate(self.startDateNumber-(self.startDate.day-1),self.currentMonthDate);
//           	}
           		

        	
        	var getTimeToSeconds=function(timeNumber,t){
        		t.hours=parseInt(timeNumber/3600);
        		timeNumber=timeNumber%3600;
        		t.minutes=parseInt(timeNumber/60);
        		timeNumber=timeNumber%60;
        		t.seconds=timeNumber;
        	}
        	
        	var writeStringCurrent = function(){
        		var era = self.currentMonthDate.year > 0 ? "" : " a.C.";
        		var s = getMonthString(self.currentMonthDate.month) + " "+ Math.abs(self.currentMonthDate.year) + era;
        		self.currentMonthDate.title=s;
        	}
        	
        	writeStringCurrent();
           	
           	var st=angular.copy(self.startDate);
           	var en=angular.copy(self.endDate);
           	var k=0;
    		while(st.year<=en.year){
    			years[k]=st.year;
    			st.year++;
    			k++;
    		}

        	var getNumDaysOfMonth = function(month, year){
        		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
        			return 31;
        		else if(month==4 || month==6 || month==9 || month==11)
        			return 30;
        		else{
        			if((year%4==0 && year%100!=0) || (year%400==0))
        				return 29;
        			else
        				return 28;
        		}
        	}
        	
        	var elaborateDaysOfMonth = function(currentMonthDate){
        		selected = {};
	        	var numDaysOfMonth = getNumDaysOfMonth(currentMonthDate.month, currentMonthDate.year);
	        	var inserted=1;
	        	var passed=1;
	        	self.days = new Array();
	        	for(var i=0; i<5; i++){
	        		self.days[i] = new Array();
	        		for(var j=0; j<7; j++){
	        			if(currentMonthDate.dow>=passed){
	        				self.days[i][j]="";
	        			}else{
	        				if(inserted<=numDaysOfMonth){
	        					self.days[i][j] = {};
	        					self.days[i][j].val=inserted;
	        					self.days[i][j].selected=false;
	        					if((currentMonthDate.year==self.startDate.year && currentMonthDate.month<self.startDate.month) ||
	        							(currentMonthDate.year==self.startDate.year && currentMonthDate.month==self.startDate.month && inserted<self.startDate.day) ||
	        							(currentMonthDate.year==self.endDate.year && currentMonthDate.month>self.endDate.month) ||
	        							(currentMonthDate.year==self.endDate.year && currentMonthDate.month==self.endDate.month && inserted>self.endDate.day)){
	        						self.days[i][j].inactive=true;
	        					}
	        					if(self.currentDate && self.currentDate.year==currentMonthDate.year && self.currentDate.month==currentMonthDate.month && self.currentDate.day==inserted){
	        						self.days[i][j].selected=true;
	        						selected=self.days[i][j];
	        					}
	        					
	        					inserted++;
	        				}
	        			}
	        			passed++;
	        		}
	        	}
	        	if(inserted<=numDaysOfMonth){
	        		self.days[5] = new Array();
	        		for(var k=0; inserted<=numDaysOfMonth; k++){
	        			self.days[5][k] = {};
	        			self.days[5][k].val = inserted;
    					self.days[5][k].selected=false;
	        			if((currentMonthDate.year==self.startDate.year && currentMonthDate.month<self.startDate.month) ||
    							(currentMonthDate.year==self.startDate.year && currentMonthDate.month==self.startDate.month && inserted<self.startDate.day) ||
    							(currentMonthDate.year==self.endDate.year && currentMonthDate.month>self.endDate.month) ||
    							(currentMonthDate.year==self.endDate.year && currentMonthDate.month==self.endDate.month && inserted>self.endDate.day)){
    						self.days[5][k].inactive=true;
    					}
	        			if(self.currentDate && self.currentDate.year==currentMonthDate.year && self.currentDate.month==currentMonthDate.month && self.currentDate.day==inserted){
    						self.days[5][k].selected=true;
    						selected=self.days[5][k];
	        			}
	        			inserted++;
	        		}
	        	}
	        	
	        	writeStringCurrent();
	        	
        	}
        	elaborateDaysOfMonth(self.currentMonthDate);
           
        	
        	
        	self.getDayOfWeekString = function(day){
        		return CONSTANTS.dayOfWeekString(day);
        	}
        	
        	self.nextMonth =function(){
        		if(self.showDays){

	        		var n = dateToJulianNumber(self.currentMonthDate);
	        		n+=getNumDaysOfMonth(self.currentMonthDate.month,self.currentMonthDate.year);
	        		if(n<=self.endDateNumber){
	        			julianNumberToDate(n,self.currentMonthDate);
	        			elaborateDaysOfMonth(self.currentMonthDate);
	        		}
	        		
        		}else{
            		var index = self.yearMatrix[yearMatrixSize-1][yearMatrixSize-1]+1-self.startDate.year;
            		if(index<years.length && index>0){
	        			emptyYearMatrix();
	        			if(years[index]>=0)
	        				self.yearsInterval = ""+years[index]+" d.C.";
	        			else
	        				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";

	    				for(var i=0; i<yearMatrixSize; i++)
	            			for(var j=0; j<yearMatrixSize && index<years.length && index>0; j++){
	            				self.yearMatrix[i][j]=years[index];
	            				index++;
	            			}
	    				if(years[index-1]>=0)
	    					self.yearsInterval +=" - "+years[index-1]+" d.C.";
	        			else
	    					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";
	            		
            		}
        		}
        	}
        	
        	self.prevMonth = function(){
        		if(self.showDays){
	        		var n = dateToJulianNumber(self.currentMonthDate);
	        		n-=getNumDaysOfMonth(self.currentMonthDate.month-1,self.currentMonthDate.year);
	        		if(n>=self.startDateNumber){
	            		julianNumberToDate(n,self.currentMonthDate);
	        			elaborateDaysOfMonth(self.currentMonthDate);
	        		}else{
	        			n+=self.startDate.day;
	        			if(n>=self.startDateNumber){
		            		julianNumberToDate(n,self.currentMonthDate);
		        			elaborateDaysOfMonth(self.currentMonthDate);
		        		}else{
		        			//TODO cambiare classe freccia sx per non renderla più cliccabile	        			
		        		}
	        		}
        		}else{
            		var index = self.yearMatrix[0][0]-(yearMatrixSize*yearMatrixSize)-self.startDate.year;
            		if(index<0)
            			index=0;
            		if(index<years.length){
	        			emptyYearMatrix();
	        			if(years[index]>=0)
	        				self.yearsInterval = ""+years[index]+" d.C.";
	        			else
	        				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";	    				
	        			for(var i=0; i<yearMatrixSize; i++)
	            			for(var j=0; j<yearMatrixSize && index<years.length && index>=0; j++){
	            				self.yearMatrix[i][j]=years[index];
	            				index++;
	            			}    
	        				if(years[index-1]>=0)
		    					self.yearsInterval +=" - "+years[index-1]+" d.C.";
		        			else
		    					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";            		}
        		}

        	}
        	
        	self.selectDate = function(row, col){
        		if(!self.days[row][col].inactive){
        			if(selected)
        				selected.selected = false;
	        		var date = {};
	        		date.day = self.days[row][col].val;
	        		date.month = self.currentMonthDate.month;
	        		date.year = self.currentMonthDate.year;
	        		self.dateNumber=dateToJulianNumber(date);
	        		self.days[row][col].selected=true;
	        		selected = self.days[row][col];
	        		self.dateString=self.days[row][col].val+" "+self.currentMonthDate.title;
	        		var t = {};
	        		getTimeToSeconds(self.timeNumber,t);
	        		self.dateString+=" "+t.hours+":";
	        		if(t.minutes<10)
	        			self.dateString+="0"+t.minutes;
	        		else
	        			self.dateString+=t.minutes;
	        	}
        	}
        	
        	self.switchToShowYears = function(){
        		self.showDays=false;
        		emptyYearMatrix();
        		var index = self.currentMonthDate.year-self.startDate.year;
        		if(years[index]>=0)
    				self.yearsInterval = ""+years[index]+" d.C.";
    			else
    				self.yearsInterval = ""+Math.abs(years[index])+" a.C.";	    		        		
        		for(var i=0; i<yearMatrixSize; i++)
        			for(var j=0; j<yearMatrixSize && index<years.length; j++){
        				self.yearMatrix[i][j]=years[index];
        				index++;
        			}
        		if(years[index-1]>=0)
					self.yearsInterval +=" - "+years[index-1]+" d.C.";
    			else
					self.yearsInterval +=" - "+Math.abs(years[index-1])+" a.C.";
        	}
        	
        	self.switchToShowDays = function(){
        		self.showDays=true;
        	}
        	
        	self.selectYear = function(row,col){
        		self.currentMonthDate.year = self.yearMatrix[row][col];
        		if(self.currentMonthDate.year==self.startDate.year)
        			self.currentMonthDate.month==self.startDate.month;
        		else
        			self.currentMonthDate.month = 1;
        		self.currentMonthDate.day = 1;
        		self.switchToShowDays();
    			elaborateDaysOfMonth(self.currentMonthDate);
        	}
        	
        	
        	/*TIMEPICKER*/
        	
        	var getSecondsOfTime = function(date){
        		var hour = date.getHours();
        		var minute = date.getMinutes();
        		var seconds = date.getSeconds();
        		
        		self.timeNumber=seconds+minute*60+hour*3600;
        	}
        	if(!self.timeNumber){
        		self.myTime = new Date();
            	getSecondsOfTime(self.myTime);
        	}
        	else{
        		var d = new Date();
        		var t = {};
        		getTimeToSeconds(self.timeNumber,t);
        		self.myTime = new Date(d.getFullYear(),d.getMonth(),d.getDay(), t.hours, t.minutes, t.seconds);
        	}
        	self.changed = function () {
        		getSecondsOfTime(self.myTime);
        	};
        	/**/
        },
        controllerAs: 'vm',
        bindToController: true
    };
}]);
angular.module("smiled.application").directive('editDraftPost',[ 'apiService', 'CONSTANTS', 'modalService', 'Upload', '$state', '$q',
    function(apiService, CONSTANTS, modalService, Upload, $state, $q){
		return {
			templateUrl: "assets/private/partials/edit-draft-post-directive.html",
			scope : {
				posts : "=",
				postId : "@",
				user : "=",
			},
			controller : ['$scope' , function($scope){
				var self = this;
				self.scenario = {};
				self.date={};		
				self.colorMapMarker = {};
				self.colorImageMarker = {};
				self.colorFileMarker = {};
				self.realDateFormat = CONSTANTS.realDateFormatWithHour;
				self.sendPostEnable = true;
				self.post = {};
				if(self.postId && self.posts){
					for(var i=0;i<self.posts.length; i++){
						if(self.posts[i].id==self.postId){
							self.post = self.posts[i];
							if(self.post.character){
								self.post.character.cover = CONSTANTS.urlCharacterCover(self.post.scenarioId, self.post.character.id);
							}
							break;
						}
					}
				}
				self.newPost = angular.copy(self.post);
				self.newPost.image = new Array();
				self.newPost.file  = new Array();
				self.newPost.tags = new Array();
				self.newPost.toDeleteImage = new Array();
				self.newPost.toDeleteFile = new Array();
				
				var calculateType = function(uploadedFile){
					var split = uploadedFile.name.split(".");
					var type = split[split.length-1];
					uploadedFile.fileType =  null;
					if(type == 'jpg' || type == 'jpeg' || type == 'png' || type=='gif'){
						uploadedFile.fileType = 'img';
					}else if(type == 'pdf'){
						uploadedFile.fileType = 'pdf';
					}else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
						uploadedFile.fileType = 'doc';
					}else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
						uploadedFile.fileType = 'ppt';
					}else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
						uploadedFile.fileType = 'excel';
					}
				}

				var updateMediaAndTagOnStart = function(){
					if(self.post.imagesMetadata){
						for(var i=0; i<self.post.imagesMetadata.length; i++){
							var s = {};
							s.id = self.post.imagesMetadata[i].id;
							s.name = self.post.imagesMetadata[i].originalName;
							self.newPost.image.push(angular.copy(s));
						}
					}
					
					if(self.post.filesMetadata){
						for(var i=0; i<self.post.filesMetadata.length; i++){
							var s = {};
							s.id = self.post.filesMetadata[i].id;
							s.name = self.post.filesMetadata[i].originalName;
							calculateType(s);
							self.newPost.file.push(angular.copy(s));
						}
					}
					
					if(self.post.tags){
						for(var i=0; i<self.post.tags.length; i++){
							var s = {};
							s.id = self.post.tags[i].id;
							s.name = self.post.tags[i].firstname;
							if(self.post.tags[i].lastname){
								s.name+=" "+self.post.tags[i].lastname;
							}
							self.newPost.tags.push(angular.copy(s));
						}
					}
				}
				
				updateMediaAndTagOnStart();
				
				apiService.getScenario(self.post.scenarioId).then(
						function(data){
							self.scenario = data;
							self.startDate = angular.copy(self.scenario.history.startDate);
							if(!self.startDate.afterChrist)
								self.startDate.year*=-1;
							self.endDate = angular.copy(self.scenario.history.endDate);
							if(!self.endDate.afterChrist)
								self.endDate.year*=-1;
						},
						function(reason){
							console.log("Impossibile recuperare lo scenario");
							console.log(reason);
						}
				);
				
				/*Variable and function to switch open/closed historicalDatePicker*/
				self.showDatePicker = false;
				self.setDateNewPost = function(){
//					self.showDatePicker = !self.showDatePicker;
					modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.newPost);
				}
				
				/*Function to show/hide tag box*/
				self.colorTagsMarker = {};
				self.stringTags="";
				self.tagIsSet = false;
				self.showTagBox=false;
				self.switchShowTagBox =function(){
					self.showTagBox=!self.showTagBox;
				}
				self.hideTagBox =function(){
					self.showTagBox=false;
				}
				
				/*-----------------------------*/
							
				var getMonthString = function(month){
					return CONSTANTS.monthString(month);
				} 

				var julianNumberToDate = function(jd, date){
					var l = jd + 68569;
					var n = parseInt(( 4 * l ) / 146097);
					l = l - parseInt(( 146097 * n + 3 ) / 4);
					var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
					l = l - parseInt(( 1461 * i ) / 4) + 31;
					var j = parseInt(( 80 * l ) / 2447);
					date.day = l - parseInt(( 2447 * j ) / 80);
					l = parseInt(j / 11);
					date.month = j + 2 - ( 12 * l );
					date.year = 100 * ( n - 49 ) + i + l;
					date.dow = jd%7;
				}
				
				
				var getTimeToSeconds=function(timeNumber,t){
	        		t.hours=parseInt(timeNumber/3600);
	        		timeNumber=timeNumber%3600;
	        		t.minutes=parseInt(timeNumber/60);
	        		timeNumber=timeNumber%60;
	        		t.seconds=timeNumber;
	        	}
				
				self.formatDate = function(jd, timeNumber){
					julianNumberToDate(jd, self.date);
					var era = self.date.year > 0 ? "" : " a.C.";
					var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
					var f = self.date.day+" "+s;
					if(timeNumber){
						var t = {};
						getTimeToSeconds(timeNumber, t);
						f+=" "+t.hours+":";
						if(t.minutes<10)
		        			f+="0"+t.minutes;
		        		else
		        			f+=t.minutes;
					}
					return f;
				}
				
				if(self.newPost.julianDayNumber)
					self.newPost.formattedDate = self.formatDate(self.newPost.julianDayNumber, self.newPost.timeNumber);
				else
					self.newPost.formattedDate = CONSTANTS.insertHistoricalDate;
				
				
				self.updatePositionPost = function(){
					var map=null;
					if(self.scenario.history.mapId)
						map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
					
					modalService.showModalOpenMap(self.newPost,map);
				}
				
				
				
				/*Public function to add/remove new image to status*/
				self.addImageToNewPost = function(file){
					uploadMediaToPost(file,true);
				}
				
				self.removeImage =function(image){
					var id = angular.copy(image.id)
					modalService.showModalDeleteResource(image).then(
							function(data){
								apiService.deleteMedia(id, self.post.id).then(
										function(data){
											for(var i=0; i<self.newPost.image.length; i++){
												if(self.newPost.image[i].id==id){
													self.newPost.image.splice(i,1);
												}
											}
										},
										function(reason){
											console.log("Impossibile eliminare immagine");
										}
								);
							},
							function(reason){
								console.log("Eliminazione annullata");
							}
					);
				}
				self.getMedia = function(id){
					return CONSTANTS.urlMediaThumb(id);
				}
				/*------------------------------------------*/
				
				/*Public function to add/remove new file to status*/
				self.addFileToNewPost = function(file){
					uploadMediaToPost(file,false);
				}
				self.removeFile =function(file){
					var id = angular.copy(file.id);
					modalService.showModalDeleteResource(file).then(
							function(data){
								apiService.deleteMedia(id, self.post.id).then(
										function(data){
											for(var i=0; i<self.newPost.file.length; i++){
												if(self.newPost.file[i].id==id){
													self.newPost.file.splice(i,1);
												}
											}
										},
										function(reason){
											console.log("Impossibile eliminare file");
										}
								);
							},
							function(reason){
								console.log("Eliminazione annullata");
							}
					);
				
				}
				/*------------------------------------------*/
				
				/*Private function used to upload media*/
				var uploadMediaToPost = function(file,isImage){
					if(file && file.length){
						Upload.upload({
				            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
				            headers : {
				                'Content-Type': file.type
				            },
				            file: file
				        })
//				            .progress(function (evt) {
//				            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//				            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//				        })
				        .then(function (response) {
				           if(isImage){
					           var uploadedFile = {};
				        	   uploadedFile.id = response.data.id;
				        	   uploadedFile.name = response.config.file[0].name;
				        	   self.newPost.image.push(uploadedFile);
				           }else{
					           var uploadedFile = {};
					           uploadedFile.id = response.data.id;
					           uploadedFile.name = response.config.file[0].name;
				        	   calculateType(uploadedFile);
				        	   self.newPost.file.push(uploadedFile);
				           }
				        }, function(reason){
				        	console.log("Impossibile effettuare l'upload");
				        	//TODO aggiungere alert
				        });
					}
				}
				/*-----------------------------------------------------*/
				
				/*Function to pass to autocomplete of tag-input-directive*/
				self.search = function($query,isChar){
					var selectable;
					self.suggestions = new Array();
					if(isChar)
						selectable=self.scenario.characters;
					else{
						if(self.scenario.attendees)
							selectable=self.scenario.attendees;
						if(self.scenario.collaborators)
							selectable.push.apply(self.scenario.collaborators);
						selectable.push(self.scenario.teacherCreator);
					}
					var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
					if(selectable){
						if(!isChar){
							for(var i=0; i<selectable.length; i++){
								if(regex.test(selectable[i].firstname) || regex.test(selectable[i].lastname)){
									var suggestion = {};
									suggestion.name=selectable[i].lastname+" "+selectable[i].firstname;
									suggestion.id=selectable[i].id;
									suggestion.cover=CONSTANTS.urlUserCover(selectable[i].id);
									self.suggestions.push(suggestion);
								}
							}
						}else if(isChar){
							

							if(!self.scenario.id){
								throw new Error("Unsupported type");
							}
							for(var i=0; i<selectable.length; i++){
							
								if(regex.test(selectable[i].name)){
									var suggestion = {};
									suggestion.name=selectable[i].name;
									suggestion.id=selectable[i].id;
									suggestion.cover=CONSTANTS.urlCharacterCover(self.scenario.id,selectable[i].id);
									self.suggestions.push(suggestion);
								}

							}
						}else
							throw new Error("Unsupported type");
					}
					var result = $q.defer();
					result.resolve(self.suggestions);
					return result.promise;
				}
				
				
				
				var validateDate = function(){
					
					if(self.newPost.julianDayNumber && self.newPost.timeNumber)
						return true;
					else 
						return false;
				}
				
				
				/*--------------Create draft post start------------------------------------------*/
				
				/*AGGIUNGERE CONTROLLO DATE - guarda validateDAte()*/
				self.draftNewPost = function(publish){
					var savable=true;
					var toSendPost = {};

					if(publish){
						if(!validateDate()){
							self.setDateNewPost();
							savable=false;
						}
						else{
							toSendPost.status = "PUBLISHED";
						}
					}
					else
						toSendPost.status = "DRAFT";
					
					if(savable && self.sendPostEnable && self.newPost.text){
						self.sendPostEnable=false;
						toSendPost.text = self.newPost.text;
						toSendPost.julianDayNumber = self.newPost.julianDayNumber;
						toSendPost.timeNumber = self.newPost.timeNumber;
						toSendPost.place = self.newPost.place;
						toSendPost.imageMetaId = new Array();
						toSendPost.fileMetaId = new Array();
						toSendPost.tags = new Array();
						
						for(var i=0; i<self.newPost.image.length; i++){
							toSendPost.imageMetaId.push(self.newPost.image[i].id);
						}
							
						for(var i=0; i<self.newPost.file.length; i++){
							toSendPost.fileMetaId.push(self.newPost.file[i].id);
						}
						
						for(var i=0; i<self.newPost.tags.length; i++){
							toSendPost.tags.push(self.newPost.tags[i].id);
						}
						
						if(self.post.character){
							apiService.updateStatus(self.scenario.id, self.post.id, toSendPost).then(
									function(data){
										self.sendPostEnable= true;
										self.post = data;
										for(var i=0; i<self.posts.length; i++){
											if(self.posts[i].id==self.post.id){
												self.posts[i] = self.post;
												self.posts[i].character.cover = CONSTANTS.urlCharacterCover(self.posts[i].scenarioId, self.posts[i].character.id);
												break;
											}
										}
										if(publish){
											$state.go("logged.scenario.posts", {"id" : self.scenario.id});
										}
									},
									function(reason){
										self.sendPostEnable=true;
										console.log("error in send status: "+reason);
									}
							);
						}else{
							apiService.updateEvent(self.scenario.id, self.post.id, toSendPost).then(
									function(data){
										self.sendPostEnable= true;
										self.post = data;
										for(var i=0; i<self.posts.length; i++){
											if(self.posts[i].id==self.post.id){
												self.posts[i] = self.post;
												break;
											}
										}
										if(publish){
											$state.go("logged.scenario.posts", {"id" : self.scenario.id});
										}
									},
									function(reason){
										self.sendPostEnable=true;
										console.log("error in send status: "+reason);
									}
							);
						}
						
					}else{
						angular.element(document.querySelector('#textContentStatus')).focus();
					}	
				}
				/*--------------Create draft post end------------------------------------------*/
				
				self.deletePost = function(){
					modalService.showModalDeletePost().then(
							function(data){
								apiService.deletePost(self.scenario.id, self.post.id).then(
										function(data){
											for(var i=0; i<self.posts.length; i++){
												if(self.posts[i].id==self.post.id){
													self.posts.splice(i,1);
													break;
												}
											}
											$state.go("logged.dashboard.draft");
										}
								);
							},
							function(reason){
								console.log("DELETE CANCELED");
							}
					);
				}
				
				
			}],
			controllerAs: "editDraftPost",
			bindToController: true,
			link : function(scope, elem, attrs, ctrl){
				scope.$watch('editDraftPost.newPost.image.length', function(val){
					if(val>0){
						ctrl.colorImageMarker = {'color': '#89b151'};
					}else{
						ctrl.colorImageMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('editDraftPost.newPost.file.length', function(val){
					if(val>0){
						ctrl.colorFileMarker = {'color': '#89b151'};
					}else{
						ctrl.colorFileMarker = {'color': 'dark grey'};
					}
				});
				scope.$watch('editDraftPost.newPost.place', function(newVal, oldVal){
					if(newVal && newVal.x && newVal.y){
						ctrl.colorMapMarker = {'color': '#89b151'};
					}else{
						ctrl.colorMapMarker = {'color': 'dark grey'};
					}
				});
				
				scope.$watch('editDraftPost.newPost.tags.length', function(val){
					if(val>0){
						ctrl.tagIsSet=true;
						ctrl.colorTagsMarker = {'color': '#89b151'};						
						ctrl.stringTags="";
						for(var i=0;i<val;i++){
							if(i>=2){						
								ctrl.stringTags+=" e altri personaggi";
								break;
							}else{
								if(i<val-1)
									ctrl.stringTags+=""+ctrl.newPost.tags[i].name+", ";
								else
									ctrl.stringTags+=""+ctrl.newPost.tags[i].name;
							}
							
						}
					}else{
						ctrl.colorTagsMarker = {'color': 'dark grey'};
						ctrl.stringTags="";
						ctrl.tagIsSet=false;
					}
				});
			}
		};
}]);
angular.module("smiled.application").directive('errSrc',[ function() {

  return {
    link: function(scope, element, attrs) {
    	element.bind('error', function() {
    		if (attrs.src != attrs.errSrc) {
    			attrs.$set('src', attrs.errSrc);
    		}
    	});
    }
  }
}]);

angular.module("smiled.application").directive('forminput',['$compile', function($compile) {

	
		var setupDom= function(element){
			var input = element.querySelector("input, textArea, select");
			var type = input.getAttribute("type");
			var name = input.getAttribute("name");
			if(type!== "checkbox" && type!== "radio"){
				input.classList.add("form-control");
			}else{
				
			}
//			var label = element.querySelector("label");
//			label.classList.add("control-label");
			//element.classlist.add("form-group");
			return name;
		};
		
		var watcherFor= function (form, name){
			return function(){
				if( name && form[name]){
					if(form[name].$invalid && form[name].$dirty)
						return form[name].$invalid;
				}
				//otherwise just return undefined
			};
		};
		
		var updaterFor = function(element){
			//angular passa a questa funzione il valore che il watcher ritorna, quindi hasError è un flag che mi dice se l'input ha un errore
			return function(hasError){
				if(hasError){
					element.removeClass("has-success").addClass("has-error");
				}else{
					element.removeClass("has-error").addClass("has-success");
				}
			};
		};
		
		var addMessages = function(form, element, name, $compile, scope){
			
			var messages = "<div class='help-block' ng-messages='" + form.$name + "."+
				name + ".$error" + "' ng-messages-include='assets/public/partials/messages.html'></div>";
			element.append($compile(messages)(scope));
			//scope-$watch guarda all'invalid flag associato al form e chiama l'updater se il watcher restituisce true
			scope.$watch(watcherFor(form, name), updaterFor(element));
		};
	
		var link = function($compile){
			return function(scope, element, attributes, form){
				var name = setupDom(element[0]);
				addMessages(form, element, name, $compile, scope);
			};
		};
        return {
            restrict: "A",
            require:"^form",
            link: link($compile)
        }

}]);
angular.module("smiled.application").directive('headlineNewspaper', ['article', 'modalService','apiService', '$stateParams', 'CONSTANTS', '$state',
                                     function(article, modalService, apiService, $stateParams, CONSTANTS, $state){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/headline-newspaper.html",
		scope: {
			newspaper: '=?',
			scenario: '=',
			isJournalist: '=?'
			
		},
		bindToController: true,
		controller: ['$scope',function($scope){
			var self = this;
			if(self.isJournalist==undefined){
				self.isJournalist=true;
			}
			self.showWarning = false;
			var scenId = $stateParams.id; 
			self.isFirst; 
			self.isPublished = article.getIsPublished(); 
			self.date = {}; 
			self.isPublished = article.getIsPublished();
	
			if($state.current.name == 'logged.scenario.newspublished'){
			/*	apiService.getpublishedNewspapers(scenId).then (
						function(data) {
							self.publishedNewspapers = data; 
							self.publishedNewspaperNumber = article.getPublishedNewspaperNumber(); 
							console.log(self.publishedNewspaperNumber); 
							console.log("numero"); 
							var found = false;
							for(var i=0; !found && i<self.publishedNewspapers.length; i++) {
								if(self.publishedNewspapers[i].number = self.publishedNewspaperNumber) { 
									self.newspaper = self.publishedNewspapers[i];
									console.log(self.newspaper.name);
									console.log("NOME GIORNALE PUBBLICATO"); 
									
									found = true;
									break; 
								}
							}
						},function(reason){	
						}	
						);*/
		}
			
			if($state.current.name == 'logged.scenario.template1') {
			if(self.newspaper.status == 'DRAFT' || self.newspaper.status == undefined){
				
				/*Initialize dates variable*/
				self.startDate = angular.copy(self.scenario.history.startDate);
				if(!self.startDate.afterChrist)
					self.startDate.year*=-1;
				self.endDate = angular.copy(self.scenario.history.endDate);
				if(!self.endDate.afterChrist)
					self.endDate.year*=-1;
				self.newspaper.historicalDate=CONSTANTS.insertHistoricalDateNewspaper; 	
			}
			}
			

			self.showPopUpCreationTitle = function (){
			modalService.showModalCreateTitle(self.newspaper);	
			};
			
			
			
			self.setDateNewspaper = function(){
				if(self.newspaper!=null && self.newspaper.status!=undefined){
					modalService.showModalSetHistoryNewspaperDate(self.startDate, self.endDate, self.newspaper);
				}else{
					modalService.showAlertNewspaper();
				}
			}
			
			//format date
			
			self.formatDate = function(jd, timeNumber){
				julianNumberToDate(jd, self.date);
				var era = self.date.year > 0 ? "" : " a.C.";
				var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
				var f = self.date.day+" "+s;
				if(timeNumber){
					var t = {};
					getTimeToSeconds(timeNumber, t);
					f+=" "+t.hours+":";
					if(t.minutes<10)
	        			f+="0"+t.minutes;
	        		else
	        			f+=t.minutes;
				}
				return f;
			}
			
			
			var julianNumberToDate = function(jd, date){
				var l = jd + 68569;
				var n = parseInt(( 4 * l ) / 146097);
				l = l - parseInt(( 146097 * n + 3 ) / 4);
				var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
				l = l - parseInt(( 1461 * i ) / 4) + 31;
				var j = parseInt(( 80 * l ) / 2447);
				date.day = l - parseInt(( 2447 * j ) / 80);
				l = parseInt(j / 11);
				date.month = j + 2 - ( 12 * l );
				date.year = 100 * ( n - 49 ) + i + l;
				date.dow = jd%7;
			}
			
			var getTimeToSeconds=function(timeNumber,t){
        		t.hours=parseInt(timeNumber/3600);
        		timeNumber=timeNumber%3600;
        		t.minutes=parseInt(timeNumber/60);
        		timeNumber=timeNumber%60;
        		t.seconds=timeNumber;
        	}
			
			var getMonthString = function(month){
				return CONSTANTS.monthString(month);
			}	
			
		}],
		
		controllerAs: "headlineNewspaper",

		link : function(scope,elem,attrs,ctrl){
		scope.$watch('headlineNewspaper.newspaper.font', function(newVal, oldVal){
			if(newVal){	
				if(ctrl.newspaper.font == 'Rakkas'){
					ctrl.newspaper.font = {'font-family': 'Rakkas' };
					console.log(ctrl.newspaper.font);	
				} else

					if(ctrl.newspaper.font == 'Patrick Hand') {
						console.log(ctrl.newspaper.font);
						ctrl.newspaper.font = {'font-family': 'Patrick Hand'};		
					} else 
						if (ctrl.newspaper.font == 'Abril Fatface'){

							ctrl.newspaper.font = {'font-family': 'Abril Fatface'};		

						} else 
							if (ctrl.newspaper.font == 'Katibeh'){

								ctrl.newspaper.font = {'font-family': 'Katibeh'};	

							}

							else 
								if (ctrl.newspaper.font == undefined){

									ctrl.newspaper.font = oldVal;	

								}

			} else {
			
			ctrl.newspaper.font = oldVal;	
			
		}
			
			
			});
		}
		
} 
}]);

angular.module('smiled.application').directive('hideOnHoverParent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.hide();
            });
            element.parent().bind('mouseleave', function() {
                 element.show();
            });
       }
   };
});
angular.module("smiled.application").directive('historicaldate',[ function() {

        return {
            restrict: "AE",
            templateUrl: "assets/private/partials/historicalDate.html",
            scope: true,
            controller: function($scope) {
                $scope.removeAlert = function (alert) {
                	alertingGeneric.removeAlert(alert);
                };
            },
            link: function (scope) {
                scope.currentAlerts = alertingGeneric.currentAlerts;
            }
        };

}]);
angular.module("smiled.application").directive("historicalDatePicker",[ 'CONSTANTS', function(CONSTANTS){
	return {
		restrict: "AE",
        templateUrl: "assets/public/partials/historicalDatePicker.html",
        scope: {
        	date: "="
        },
        controller : function (){
        	var self = this;
        	self.months = CONSTANTS.getMonths("it");
        	self.getDays = function(){
            	self.days = CONSTANTS.getDays(self.date.month);
        	}
        	if(self.date && self.date.month){
	        	self.days = CONSTANTS.getDays(self.date.month);
        	}else{
        		self.days = CONSTANTS.getDays(1);
        	}
        },
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope,element,attr){
        	
        	scope.$watch('vm.date', function(newValue,oldValue){
        		if(newValue && newValue.year && newValue.month && newValue.day){
        			var era;
        			if(newValue.afterChrist)
        				era="D.C.";
        			else
        				era="A.C.";
        			
        			newValue.formatted=newValue.day+" "+CONSTANTS.monthString(newValue.month)+" "+newValue.year+" "+era;
        		}
        	},true);
        }
    };
}]);
angular.module("smiled.application").directive("insertEvent", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService', 'alertingScenario', 
                                     function(CONSTANTS, apiService, Upload, $q, modalService, alertingScenario){
	return {
		templateUrl: "assets/private/partials/insert-event-template.html",
		scope : {
			posts: "=",
			scenario: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			/*Initialize newPost variable*/
			self.startDate = angular.copy(self.scenario.history.startDate);
			if(!self.startDate.afterChrist)
				self.startDate.year*=-1;
			self.endDate = angular.copy(self.scenario.history.endDate);
			if(!self.endDate.afterChrist)
				self.endDate.year*=-1;
			self.newPost = {};
//			self.newPost.date = {};
//			self.newPost.date.afterChrist = true;
			self.newPost.julianDayNumber="";
			self.newPost.timeNumber="";
			self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;

			self.newPost.image = new Array();
			self.newPost.file  = new Array();
			self.newPost.tags = new Array();
			self.showViewToSelectType = false;
			self.newPost.type = null;
			self.sendPostEnable = true;
			/*--------------------------*/
			
			/*Variable and function to switch open/closed historicalDatePicker*/
			self.showDatePicker = false;
			self.setDateNewPost = function(){
//				self.showDatePicker = !self.showDatePicker;
				modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.newPost);
			}
			/*----------------------------------------------------------------*/
			
			var validateDate = function(){
				
				if(self.newPost.julianDayNumber && self.newPost.timeNumber)
					return true;
				else 
					return false;
//				var outStart=true;
//				var outEnd=true;
//				
//				if(self.newPost.date.year==self.scenario.history.startDate.year){
//					if(self.newPost.date.month==self.scenario.history.startDate.month){
//						if(self.newPost.date.day>=self.scenario.history.startDate.day){
//							outStart=false;
//						}
//					}else if(self.newPost.date.month>self.scenario.history.startDate.month){
//						outStart=false;
//					}
//				}else if(self.newPost.date.year>self.scenario.history.startDate.year){
//					outStart=false;
//				}else{
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}
//				
//				if(self.newPost.date.year==self.scenario.history.endDate.year){
//					if(self.newPost.date.month==self.scenario.history.endDate.month){
//						if(self.newPost.date.day<=self.scenario.history.endDate.day){
//							outEnd=false;
//						}
//					}else if(self.newPost.date.month<self.scenario.history.endDate.month){
//						outEnd=false;
//					}
//				}else if(self.newPost.date.year<self.scenario.history.endDate.year){
//					outEnd=false;
//				}
//				
//				if(outStart || outEnd){
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}else
//					return true;
			}
			
			/*Create new Event*/
			self.savePost = function(){
				if(!validateDate())
					self.setDateNewPost();
				else{
					if(self.sendPostEnable && self.newPost.content){
						self.sendPostEnable = false;
						var toSendPost = {};
						toSendPost.text = self.newPost.content;
						toSendPost.julianDayNumber = self.newPost.julianDayNumber;
						toSendPost.timeNumber = self.newPost.timeNumber;
						toSendPost.status = "PUBLISHED";
						toSendPost.type = self.newPost.type;
						toSendPost.imageMetaId = new Array();
						toSendPost.fileMetaId = new Array();
						toSendPost.tags = new Array();
						toSendPost.place = self.newPost.place;
						for(var i=0; i<self.newPost.image.length; i++){
							toSendPost.imageMetaId.push(self.newPost.image[i].id);
						}
							
						for(var i=0; i<self.newPost.file.length; i++){
							toSendPost.fileMetaId.push(self.newPost.file[i].id);
						}
						
						for(var i=0; i<self.newPost.tags.length; i++){
							toSendPost.tags.push(self.newPost.tags[i].id);
						}
						
						apiService.sendEvent(self.scenario.id, toSendPost).then(
								function(data){
									self.newPost.content="";
									self.newPost.image=[];
									self.newPost.file=[];
									self.newPost.place=null;
									self.newPost.tags = [];
									self.newPost.date="";
									self.newPost.julianDayNumber="";
									self.newPost.timeNumber="";
									self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
									self.sendPostEnable = true;
									//getSingleStatus in realtà ritorna un singolo post non un singolo status (ricorda che status è una specializzazione di post, come anche event)
									apiService.getSingleStatus(self.scenario.id, data.id).then(
											function(data){
												self.posts.unshift(data);
												if(self.posts[0].imageMetaId){
													self.posts[0].imagesUrl = new Array();
													for(var i=0; i<self.posts[0].imageMetaId.length; i++){
														self.posts[0].imagesUrl[i].push(CONSTANTS.urlMedia(self.posts[0].imageMetaId[i]));
													}
												}
											},
											function(reason){
												console.log("error in insert new event in array");
											}
									);
								},
								function(reason){
									self.sendPostEnable = true;
									console.log("error in send event: "+reason);
								}
						);
					}else{
						angular.element(document.querySelector('#textContentStatus')).focus();
					}
				}			
			}
			/*----------------------------------------------------------------*/

			/*--------------Create draft post start------------------------------------------*/
			self.draftNewPost = function(){
				if(self.sendPostEnable && self.newPost.content){
					self.sendPostEnable=false;
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.julianDayNumber = self.newPost.julianDayNumber;
					toSendPost.timeNumber = self.newPost.timeNumber;
					toSendPost.status = "DRAFT";
					toSendPost.place = self.newPost.place;
					toSendPost.imageMetaId = new Array();
					toSendPost.fileMetaId = new Array();
					toSendPost.tags = new Array();
					
					for(var i=0; i<self.newPost.image.length; i++){
						toSendPost.imageMetaId.push(self.newPost.image[i].id);
					}
						
					for(var i=0; i<self.newPost.file.length; i++){
						toSendPost.fileMetaId.push(self.newPost.file[i].id);
					}
					
					for(var i=0; i<self.newPost.tags.length; i++){
						toSendPost.tags.push(self.newPost.tags[i].id);
					}
					apiService.sendEvent(self.scenario.id, toSendPost).then(
							function(data){
								self.newPost.content="";
								self.newPost.image=[];
								self.newPost.file=[];
								self.newPost.julianDayNumber="";
								self.newPost.timeNumber="";
								self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
								self.sendPostEnable= true;
								self.newPost.place = null;
								self.newPost.tags = [];
								

								alertingScenario.addSuccess("Bozza salvata con successo.");
							},

							function(reason){
								self.sendPostEnable=true;
								console.log("error in send status: "+reason);
								alertingScenario.addWarning("Impossibile salvare la bozza. Riprova per favore.");
							}
					);
				}else{
					angular.element(document.querySelector('#textContentEvent')).focus();
				}	
			}
			/*--------------Create draft post end------------------------------------------*/
			
			
			/*Public function to add/remove new image to status*/
			self.addImageToNewPost = function(file){
				uploadMediaToPost(file,true);
			}
			
			self.removeImage =function(image){
				var id = angular.copy(image.id)
				apiService.deleteMedia(id).then(
					function(data){
						for(var i=0; i<self.newPost.image.length; i++){
							if(self.newPost.image[i].id==id){
								self.newPost.image.splice(i,1);
							}
						}
					},
					function(reason){
						console.log("Impossibile eliminare immagine");
					}
				);
			}
			/*------------------------------------------*/
			
			/*Public function to add/remove new file to status*/
			self.addFileToNewPost = function(file){
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				var id = angular.copy(file.id);
				apiService.deleteMedia(id).then(
						function(data){
							for(var i=0; i<self.newPost.file.length; i++){
								if(self.newPost.file[i].id==id){
									self.newPost.file.splice(i,1);
								}
							}
						},
						function(reason){
							console.log("Impossibile eliminare file");
						}
				);			
			}
			/*------------------------------------------*/
			
			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				if(file && file.length){
					if(isImage && !(file[0].type=="image/png") && !(file[0].type=="image/gif") && !(file[0].type=="image/jpg") && !(file[0].type=="image/jpeg")){
						alertingScenario.addWarning("Formato non valido per le immagini.");
					}else{
						Upload.upload({
				            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
				            headers : {
				                'Content-Type': file.type
				            },
				            file: file
				        })
	//			            .progress(function (evt) {
	//			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	//			        })
				        .then(
				        function (response) {
				           if(isImage){
				        	   var uploadedFile = {};
				        	   uploadedFile.id = response.data.id;
				        	   uploadedFile.name = response.config.file[0].name;
				        	   self.newPost.image.push(uploadedFile);
				           }else{
				        	   var uploadedFile = {};
				        	   uploadedFile.id = response.data.id;
				        	   uploadedFile.name = response.config.file[0].name;
				        	   var split = uploadedFile.name.split(".");
				        	   var type = split[split.length-1];
				        	   uploadedFile.fileType =  null;
				        	   if(type == 'jpg' || type == 'jpeg' || type == 'png' || type == "gif"){
				        		   uploadedFile.fileType = 'img';
				        	   }else if(type == 'pdf'){
				        		   uploadedFile.fileType = 'pdf';
				        	   }else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
				        		   uploadedFile.fileType = 'doc';
				        	   }else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
				        		   uploadedFile.fileType = 'ppt';
				        	   }else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
				        		   uploadedFile.fileType = 'excel';
				        	   }
				        	   self.newPost.file.push(uploadedFile);
				           }
				        },function(reason){
				        	if(reason.status=="400" || reason.status=="406"){
								alertingScenario.addWarning("Formato non supportato.");
				        	}else{
				        		alertingScenario.addWarning("C'è stato un errore, non è stato possibile caricare il file. Riprova per favore.");
				        	}
				        });
					}
				}
			}
			/*-----------------------------------------------------*/
			
			
			/*Function to pass to autocomplete of tag-input-directive*/
			self.search = function($query,isChar){
				var selectable;
				self.suggestions = new Array();
				if(isChar)
					selectable=self.scenario.characters;
				else{
					if(self.scenario.attendees)
						selectable=self.scenario.attendees;
					if(self.scenario.collaborators)
						selectable.push.apply(self.scenario.collaborators);
					selectable.push(self.scenario.teacherCreator);
				}
				var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
				if(selectable){
					if(!isChar){
						for(var i=0; i<selectable.length; i++){
							if(regex.test(selectable[i].firstname) || regex.test(selectable[i].lastname)){
								var suggestion = {};
								suggestion.name=selectable[i].lastname+" "+selectable[i].firstname;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlUserCover(selectable[i].id);
								self.suggestions.push(suggestion);
							}
						}
					}else if(isChar){
				

						if(!self.scenario.id){
							throw new Error("Unsupported type");
						}
						for(var i=0; i<selectable.length; i++){
						
							if(regex.test(selectable[i].name)){
								var suggestion = {};
								suggestion.name=selectable[i].name;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlCharacterCover(self.scenario.id,selectable[i].id);
								self.suggestions.push(suggestion);
							}

						}
					}else
						throw new Error("Unsupported type");
				}
				var result = $q.defer();
				result.resolve(self.suggestions);
				return result.promise;
			}
			/*-------------------------------------------------------*/
			/*Function to show images*/
			self.getMedia = function(id){
				return CONSTANTS.urlMedia(id);
			}
			
			/*Function to show/hide tag box*/
			self.colorTagsMarker = {};
			self.stringTags="";
			self.tagIsSet = false;
			self.showTagBox=false;
			self.switchShowTagBox =function(){
				self.showTagBox=!self.showTagBox;
			}
			self.hideTagBox =function(){
				self.showTagBox=false;
			}
			
			/*-----------------------------*/
			
			/*Function to open map*/
			self.colorMapMarker = {};
			self.setPositionNewPost = function(){
//				var mapsArray = [];
//				mapsArray.push(map);
//				Lightbox.openModal(mapsArray,0);
				var map;
				if(self.scenario.history.mapId) 
					map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)+".jpg"};
				else
					map = null;
				modalService.showModalOpenMap(self.newPost,map);
			}
			/*--------------------*/
			/*Function to show/hide type box*/
			self.showSelectType = function(){
				self.showViewToSelectType = !self.showViewToSelectType;
			}
			self.hideType = function(){
				self.showViewToSelectType = false;
			}

		}],
		controllerAs: "insertEvent",
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('insertEvent.newPost.image.length', function(val){
				if(val>0){
					ctrl.colorImageMarker = {'color': '#89b151'};
				}else{
					ctrl.colorImageMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertEvent.newPost.file.length', function(val){
				if(val>0){
					ctrl.colorFileMarker = {'color': '#89b151'};
				}else{
					ctrl.colorFileMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertEvent.newPost.place', function(val){
				if(val && val.x && val.y){
					ctrl.colorMapMarker = {'color': '#89b151'};
				}else{
					ctrl.colorMapMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertEvent.newPost.date', function(val){
				if(val && val.x && val.y){
					ctrl.colorMapMarker = {'color': '#89b151'};
				}else{
					ctrl.colorMapMarker = {'color': 'dark grey'};
				}
			});
			
			scope.$watch('insertEvent.newPost.tags.length', function(val){
				if(val>0){
					ctrl.colorTagsMarker = {'color': '#89b151'};
					ctrl.tagIsSet=true;
					ctrl.stringTags="";
					for(var i=0;i<val;i++){
						if(i>=2){						
							ctrl.stringTags+=" e altri personaggi";
							break;
						}else{
							if(i<val-1)
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name+", ";
							else
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name;
						}
					}
				}else{
					ctrl.colorTagsMarker = {'color': 'dark grey'};
					ctrl.tagIsSet=false;
					ctrl.stringTags="";
				}
			});
			scope.$watch('insertEvent.newPost.type.length', function(val){
				if(val>0){
					ctrl.colorTypeMarker = {'color': '#89b151'};					
				}else{
					ctrl.colorTypeMarker = {'color': 'dark grey'};					
				}
			});
			
		}
	}
}]);


angular.module("smiled.application").directive("insertMission", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService', '$timeout',
                                     function(CONSTANTS, apiService, Upload, $q, modalService, $timeout){
	return {
		templateUrl: "assets/private/partials/insert-mission-template.html",
		scope : {
			idScenarioVeloce: "@?",  //mi serve per visualizzare la cover dello scenario
			scenario: "=",
			character: "=?",
			isModerator: "=",
			isCreator: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.dirty = false;
			self.realDateFormat = CONSTANTS.realDateFormatWithHour;
			
			if(self.isModerator || self.isCreator){
				self.formMission = false;
			}else{
				self.formMission = true;
			}
			
			
			self.openFormMission = function(){
				self.formMission = true;
			}
			
			self.closeFormMission = function(){
				self.formMission = false;
			}
			
			if(self.character){
				if(self.character.mission){
					self.mission= self.character.mission;
					self.newMission = angular.copy(self.mission);
					
				}else{
					self.mission=null;
					self.newMission = null;
				}
				self.urlCover = "url('"+CONSTANTS.urlCharacterCover(self.scenario.id,self.character.id)+"'),url('assets/public/img/icon/pg.png')";
			}else{
				self.urlCover = "url('"+CONSTANTS.urlScenarioCover(self.idScenarioVeloce)+"'),url('assets/public/img/icon/ic_scen.png')";
				
				if(self.scenario.mission){
					self.mission= self.scenario.mission;
					self.newMission = angular.copy(self.mission);
				}else{
					self.mission=null;
					self.newMission=null;
				}
					
			}
			
			
			self.saveMission = function(){
				if(self.character){
					
					apiService.addMissionToCharacter(self.scenario.id, self.character.id, self.newMission).then(
							function(data){
								self.character = data;
								self.mission = self.character.mission;
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							},
							function(reason){
								console.log("error in add mission to character");
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							}
					);
				}else{
					
					apiService.addMissionToScenario(self.scenario.id, self.newMission).then(
							function(data){
								self.scenario = data;
								self.mission = self.scenario.mission;
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							},
							function(reason){
								console.log("error in add mission to scenario");
								self.newMission = angular.copy(self.mission);
								self.dirty=false;
							}
					);
				}
				
			}
			
			self.deleteModifyMission = function(){
				self.newMission = angular.copy(self.mission);
				$timeout(function(){self.dirty=false;},200);
				
			}
			
			self.deleteMission = function(){
				if(self.character){
					apiService.deleteMissionToCharacter(self.scenario.id, self.character.id).then(
							function(data){
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							},
							function(reason){
								console.log("error in delete mission to character");
								self.newMission = null;
								self.dirty=false;
							}
					);
				}else{
					apiService.deleteMissionToScenario(self.scenario.id).then(
							function(data){
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							},
							function(reason){
								console.log("error in delete mission to scenario");
								self.mission = null;
								self.newMission = null;
								self.dirty=false;
							}
					);
				}
				
			}
			


		}],
		controllerAs: "insertMission",
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('insertMission.newMission.title', function(newVal, oldVal){
				if(newVal && newVal!=oldVal)
					ctrl.dirty=true;
			});
			
			scope.$watch('insertMission.newMission.description', function(newVal, oldVal){
				if(newVal && newVal!=oldVal)
					ctrl.dirty=true;
			});
			
			scope.$watch('insertMission.scenario.mission.title', function(newVal, oldVal){
				if(newVal && newVal!=oldVal && !ctrl.character){
					ctrl.mission.title = newVal;
					ctrl.newMission.title = newVal;
				}
			});
			
			scope.$watch('insertMission.scenario.mission.description', function(newVal, oldVal){
				if(newVal && newVal!=oldVal && !ctrl.character){
					ctrl.mission.description = newVal;
					ctrl.newMission.description = newVal;
				}
			});
		}
	}
}]);


angular.module("smiled.application").directive("insertPost", [
                                     function(){
	return {
		templateUrl: "assets/private/partials/insert-post-template.html",
		scope : {
			character: "=",
			posts: "=",
			scenario: "=",
			hasCharacter: "=",
			isModerator: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.showBoxEvent = true;
			
		}],
		
		controllerAs: "insertPost"
		
	}
}]);


angular.module("smiled.application").directive("insertStatus", [ 'CONSTANTS', 'apiService', 'Upload', '$q', 'modalService', 'alertingScenario',
                                     function(CONSTANTS, apiService, Upload, $q, modalService, alertingScenario){
	return {
		templateUrl: "assets/private/partials/insert-status-template.html",
		scope : {
			character: "=",
			posts: "=",
			scenario: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			self.startDate = angular.copy(self.scenario.history.startDate);
			if(!self.startDate.afterChrist)
				self.startDate.year*=-1;
			self.endDate = angular.copy(self.scenario.history.endDate);
			if(!self.endDate.afterChrist)
				self.endDate.year*=-1;
			/*Initialize newPost variable*/
			self.newPost = {};
			self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
			self.newPost.julianDayNumber="";
			self.newPost.timeNumber="";
			self.newPost.image = new Array();
			self.newPost.file  = new Array();
			self.newPost.tags = new Array();
			self.sendPostEnable = true;
			
			/*--------------------------*/
			
			
			/*Check character presence. If absent don't show template*/
			if(self.character && self.character.id){
				self.showInsertStatus = true;
			}else{
				self.showInsertStatus = false;
			}
			/*--------------------------------------------------------*/
			
			/*Variable and function to switch open/closed historicalDatePicker*/
			self.showDatePicker = false;
			self.setDateNewPost = function(){
//				self.showDatePicker = !self.showDatePicker;
				modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.newPost);
			}
			/*----------------------------------------------------------------*/
			
			var validateDate = function(){
				
				if(self.newPost.julianDayNumber && self.newPost.timeNumber)
					return true;
				else 
					return false;
//				var outStart=true;
//				var outEnd=true;
//				
//				if(self.newPost.date.year==self.scenario.history.startDate.year){
//					if(self.newPost.date.month==self.scenario.history.startDate.month){
//						if(self.newPost.date.day>=self.scenario.history.startDate.day){
//							outStart=false;
//						}
//					}else if(self.newPost.date.month>self.scenario.history.startDate.month){
//						outStart=false;
//					}
//				}else if(self.newPost.date.year>self.scenario.history.startDate.year){
//					outStart=false;
//				}else{
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}
//				
//				if(self.newPost.date.year==self.scenario.history.endDate.year){
//					if(self.newPost.date.month==self.scenario.history.endDate.month){
//						if(self.newPost.date.day<=self.scenario.history.endDate.day){
//							outEnd=false;
//						}
//					}else if(self.newPost.date.month<self.scenario.history.endDate.month){
//						outEnd=false;
//					}
//				}else if(self.newPost.date.year<self.scenario.history.endDate.year){
//					outEnd=false;
//				}
//				
//				if(outStart || outEnd){
//					self.newPost.date = {};
//					self.newPost.date.afterChrist=true;
//					self.newPost.date.formatted = CONSTANTS.historicalDateOutInterval;
//					return false;
//				}else
//					return true;
			}
			
			/*Create new Status*/
			self.savePost = function(){
				if(!validateDate())
					self.setDateNewPost();
				else{
					if(self.sendPostEnable && self.newPost.content){
						self.sendPostEnable=false;
						var toSendPost = {};
						toSendPost.text = self.newPost.content;
						toSendPost.julianDayNumber = self.newPost.julianDayNumber;
						toSendPost.timeNumber = self.newPost.timeNumber;
						toSendPost.status = "PUBLISHED";
						toSendPost.place = self.newPost.place;
						toSendPost.imageMetaId = new Array();
						toSendPost.fileMetaId = new Array();
						toSendPost.tags = new Array();
						
						for(var i=0; i<self.newPost.image.length; i++){
							toSendPost.imageMetaId.push(self.newPost.image[i].id);
						}
							
						for(var i=0; i<self.newPost.file.length; i++){
							toSendPost.fileMetaId.push(self.newPost.file[i].id);
						}
						
						for(var i=0; i<self.newPost.tags.length; i++){
							toSendPost.tags.push(self.newPost.tags[i].id);
						}
						
						apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
								function(data){
									self.newPost.content="";
									self.newPost.image=[];
									self.newPost.file=[];
									self.newPost.julianDayNumber="";
									self.newPost.timeNumber="";
									self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
									self.sendPostEnable= true;
									self.newPost.place = null;
									self.newPost.tags = [];
									apiService.getSingleStatus(self.scenario.id, data.id).then(
											function(data){
												self.posts.unshift(data);
												if(self.posts[0].imageMetaId){
													self.posts[0].imagesUrl = new Array();
													for(var i=0; i<self.posts[0].imageMetaId.length; i++){
														self.posts[0].imagesUrl[i].push(CONSTANTS.urlMedia(self.posts[0].imageMetaId[i]));
													}
												}
												self.posts[0].character.cover = CONSTANTS.urlCharacterCover(self.scenario.id,self.posts[0].character.id);
											},
											function(reason){
												console.log("error in insert new post in array"+reason);
											}
									);
								},
								function(reason){
									self.sendPostEnable=true;
									console.log("error in send status: "+reason);
								}
						);
					}else{
						angular.element(document.querySelector('#textContentStatus')).focus();
					}
				}
			}
			/*--------------Create new post end------------------------------------------*/
			
			/*--------------Create draft post start------------------------------------------*/
			
			/*AGGIUNGERE CONTROLLO DATE - guarda validateDAte()*/
			self.draftNewPost = function(){
				if(self.sendPostEnable && self.newPost.content){
					self.sendPostEnable=false;
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.julianDayNumber = self.newPost.julianDayNumber;
					toSendPost.timeNumber = self.newPost.timeNumber;
					toSendPost.status = "DRAFT";
					toSendPost.place = self.newPost.place;
					toSendPost.imageMetaId = new Array();
					toSendPost.fileMetaId = new Array();
					toSendPost.tags = new Array();
					
					for(var i=0; i<self.newPost.image.length; i++){
						toSendPost.imageMetaId.push(self.newPost.image[i].id);
					}
						
					for(var i=0; i<self.newPost.file.length; i++){
						toSendPost.fileMetaId.push(self.newPost.file[i].id);
					}
					
					for(var i=0; i<self.newPost.tags.length; i++){
						toSendPost.tags.push(self.newPost.tags[i].id);
					}
					apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
							function(data){
								self.newPost.content="";
								self.newPost.image=[];
								self.newPost.file=[];
								self.newPost.julianDayNumber="";
								self.newPost.timeNumber="";
								self.newPost.formattedDate=CONSTANTS.insertHistoricalDate;
								self.sendPostEnable= true;
								self.newPost.place = null;
								self.newPost.tags = [];
								
								alertingScenario.addSuccess("Bozza salvata con successo.");
					},
							function(reason){
								self.sendPostEnable=true;
								console.log("error in send status: "+reason);
								alertingScenario.addWarning("Impossibile salvare la bozza. Riprova per favore.");
							}
					);
				}else{
					angular.element(document.querySelector('#textContentStatus')).focus();
				}	
			}
			/*--------------Create draft post end------------------------------------------*/
			
			/*Public function to add/remove new image to status*/
			self.addImageToNewPost = function(file){
				uploadMediaToPost(file,true);
			}
			
			self.removeImage =function(image){
				var id = angular.copy(image.id)
				apiService.deleteMedia(id).then(
					function(data){
						for(var i=0; i<self.newPost.image.length; i++){
							if(self.newPost.image[i].id==id){
								self.newPost.image.splice(i,1);
							}
						}
					},
					function(reason){
						console.log("Impossibile eliminare immagine");
					}
				);
			}
			
			self.getMedia = function(id){
				return CONSTANTS.urlMedia(id);
			}
			/*------------------------------------------*/
			
			/*Public function to add/remove new file to status*/
			self.addFileToNewPost = function(file){
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				var id = angular.copy(file.id);
				apiService.deleteMedia(id).then(
						function(data){
							for(var i=0; i<self.newPost.file.length; i++){
								if(self.newPost.file[i].id==id){
									self.newPost.file.splice(i,1);
								}
							}
						},
						function(reason){
							console.log("Impossibile eliminare file");
						}
				);			
			}
			/*------------------------------------------*/
			
			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				if(file && file.length){
					if(isImage && !(file[0].type=="image/png") && !(file[0].type=="image/gif") && !(file[0].type=="image/jpg") && !(file[0].type=="image/jpeg")){
						alertingScenario.addWarning("Formato non valido per le immagini.");
					}else{
						Upload.upload({
				            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
				            headers : {
				                'Content-Type': file.type
				            },
				            file: file
				        })
//				            .progress(function (evt) {
//				            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//				        })
				        .then(
				        function (response) {
				           if(isImage){
					           var uploadedFile = {};
				        	   uploadedFile.id = response.data.id;
				        	   uploadedFile.name = response.config.file[0].name;
				        	   self.newPost.image.push(uploadedFile);
				           }else{
					           var uploadedFile = {};
					           uploadedFile.id = response.data.id;
					           uploadedFile.name = response.config.file[0].name;
				        	   var split = uploadedFile.name.split(".");
				        	   var type = split[split.length-1];
				        	   uploadedFile.fileType =  null;
				        	   if(type == 'jpg' || type == 'jpeg' || type == 'png' || type=='gif'){
				        		   uploadedFile.fileType = 'img';
				        	   }else if(type == 'pdf'){
				        		   uploadedFile.fileType = 'pdf';
				        	   }else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
				        		   uploadedFile.fileType = 'doc';
				        	   }else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
				        		   uploadedFile.fileType = 'ppt';
				        	   }else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
				        		   uploadedFile.fileType = 'excel';
				        	   }
				        	   self.newPost.file.push(uploadedFile);
				           }
				        },function(reason){
				        	if(reason.status=="400" || reason.status=="406"){
								alertingScenario.addWarning("Formato non supportato.");
				        	}else{
				        		alertingScenario.addWarning("C'è stato un errore, non è stato possibile caricare il file. Riprova per favore.");
				        	}				        
				        });
					}
					
				}
			}
			/*-----------------------------------------------------*/
			
			
			/*Function to pass to autocomplete of tag-input-directive*/
			self.search = function($query,isChar){
				var selectable;
				self.suggestions = new Array();
				if(isChar)
					selectable=self.scenario.characters;
				else{
					if(self.scenario.attendees)
						selectable=self.scenario.attendees;
					if(self.scenario.collaborators)
						selectable.push.apply(self.scenario.collaborators);
					selectable.push(self.scenario.teacherCreator);
				}
				var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
				if(selectable){
					if(!isChar){
						for(var i=0; i<selectable.length; i++){
							if(regex.test(selectable[i].firstname) || regex.test(selectable[i].lastname)){
								var suggestion = {};
								suggestion.name=selectable[i].lastname+" "+selectable[i].firstname;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlUserCover(selectable[i].id);
								self.suggestions.push(suggestion);
							}
						}
					}else if(isChar){
					

						if(!self.scenario.id){
							throw new Error("Unsupported type");
						}
						for(var i=0; i<selectable.length; i++){
						
							if(regex.test(selectable[i].name)){
								var suggestion = {};
								suggestion.name=selectable[i].name;
								suggestion.id=selectable[i].id;
								suggestion.cover=CONSTANTS.urlCharacterCover(self.scenario.id,selectable[i].id);
								self.suggestions.push(suggestion);
							}

						}
					}else
						throw new Error("Unsupported type");
				}
				var result = $q.defer();
				result.resolve(self.suggestions);
				return result.promise;
			}
			/*-------------------------------------------------------*/
			
			/*Function to show/hide tag box*/
			self.colorTagsMarker = {};
			self.stringTags="";
			self.tagIsSet = false;
			self.showTagBox=false;
			self.switchShowTagBox =function(){
				self.showTagBox=!self.showTagBox;
			}
			self.hideTagBox =function(){
				self.showTagBox=false;
			}
			
			/*-----------------------------*/
			
			/*Function to open map*/
			self.colorMapMarker = {};
			self.setPositionNewPost = function(){
				var map;
				if(self.scenario.history.mapId) 
					map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
				else
					map = null;
				
				modalService.showModalOpenMap(self.newPost,map);

			}
			/*--------------------*/


		}],
		controllerAs: "insertStatus",
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('insertStatus.newPost.image.length', function(val){
				if(val>0){
					ctrl.colorImageMarker = {'color': '#89b151'};
				}else{
					ctrl.colorImageMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertStatus.newPost.file.length', function(val){
				if(val>0){
					ctrl.colorFileMarker = {'color': '#89b151'};
				}else{
					ctrl.colorFileMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('insertStatus.newPost.place', function(newVal, oldVal){
				if(newVal && newVal.x && newVal.y){
					ctrl.colorMapMarker = {'color': '#89b151'};
				}else{
					ctrl.colorMapMarker = {'color': 'dark grey'};
				}
			});
			
			scope.$watch('insertStatus.newPost.tags.length', function(val){
				if(val>0){
					ctrl.tagIsSet=true;
					ctrl.colorTagsMarker = {'color': '#89b151'};						
					ctrl.stringTags="";
					for(var i=0;i<val;i++){
						if(i>=2){						
							ctrl.stringTags+=" e altri personaggi";
							break;
						}else{
							if(i<val-1)
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name+", ";
							else
								ctrl.stringTags+=""+ctrl.newPost.tags[i].name;
						}
						
					}
				}else{
					ctrl.colorTagsMarker = {'color': 'dark grey'};
					ctrl.stringTags="";
					ctrl.tagIsSet=false;
				}
			});
			
		}
	}
}]);


angular.module("smiled.application").directive('likeTo', [ 'apiService',

	function(apiService){
		return{
			templateUrl : "assets/private/partials/like-to-template.html",
			scope : {
				liker : "=",
				post : "=",
				scenarioId : "@"
			},
			controller : function(){

				var self = this;
				self.numLike = self.post.likes.length;
				self.likePost = function(s){
					
					if(self.liker.id){
						apiService.addLikeToPost(self.scenarioId, self.post.id).then(
								function(data){
									if(!s.youLike){
										s.likes.push(self.liker);
										self.numLike++;
									}else{
										for(var i=0; i<s.likes.length; i++){
											if(s.likes[i].id==self.liker.id){
												s.likes.splice(i,1);
												self.numLike--;
												break;
											}
										}
									}
									s.youLike = !s.youLike;
								},
								function(reason){
									console.log("Error in like");
								}
						);
					}
				}
			},
			controllerAs: "likeTo",
			bindToController: true
		}
}]);
angular.module("smiled.application").directive('mapPostView', [ 'CONSTANTS',
                                                                function(CONSTANTS){
	return {
		restrict : "A",
		scope : {
			post : "=",
			map : "@"
		},
		link : function(scope, element, attrs){
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO adattare la dimensione del canvas a quella del modal???
			canvas.width = 700;
			var map = new Image();
			map.src = scope.map;
			var lastX = -1;
			var lastY = -1;
			
			//TODO anche per la dimensione del marker sarebbe da evitare il valore cablato
			var markerDim= 40;
			var original;
			
			map.onload = function(){
				var mapRatio = map.width / map.height;
				var newHeight = (map.height*canvas.width)/map.width;
				canvas.height = newHeight;
				ctx.drawImage(map, 0, 0, map.width, map.height, 0, 0, canvas.width, newHeight);
				original = ctx.getImageData(0,0,canvas.width, canvas.height);
				
				if(scope.post.place){
					var x = (scope.post.place.x*canvas.width)-(markerDim/2);
					var y = (scope.post.place.y*canvas.height)-(markerDim);
					ctx.drawImage(marker, x, y, markerDim, markerDim);
					lastX=x;
					lastY=y;
				}
			};
			
//			marker.onload = function(){
//				
//			}
		}
	}
}]);

angular.module("smiled.application").directive('mapScenario', [ 'CONSTANTS', '$timeout','$document', 'dateUtil',
                                                                function(CONSTANTS, $timeout,$document, dateUtil){
	return {
		restrict : "A",
		scope : {
			posts : "=",
			slideNumber : "=",
			map : "@",
			start : "=",
			end : "=",
			bars : "=",
			actual : "="
		},
		controller : function(){
			var self = this;
			self.toShowPost = new Array();
			var mapPost;
			var compare = function(p1, p2){
				var d1 = parseInt(p1.julianDayNumber);
				var d2 = parseInt(p2.julianDayNumber);
				if(p1.timeNumber)
					var t1 = parseInt(p1.timeNumber);
				else
					var t1 =0;
				if(p2.timeNumber)
					var t2 = parseInt(p2.timeNumber);
				else
					var t2 = 0;
				
				if(d1<d2)
					return -1;
				else if(d1>d2)
					return 1;
				else{
					if(t1<t2)
						return -1;
					else if(t1>t2)
						return 1;
					else
						return 0;
				}
			}
			
			var elaborate = function(){
				if(mapPost.length){
					mapPost.sort(compare);
					self.start = dateUtil.dateTimeToStringShort(mapPost[0].julianDayNumber, mapPost[0].timeNumber);
					self.end = dateUtil.dateTimeToStringShort(mapPost[mapPost.length-1].julianDayNumber, mapPost[mapPost.length-1].timeNumber);
					var startDate = 0;
					if(mapPost[0].timeNumber){
						startDate+=parseInt(mapPost[0].timeNumber/60);
					}
					var endDate = (mapPost[mapPost.length-1].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
					if(mapPost[mapPost.length-1].timeNumber){
						endDate+=parseInt(mapPost[mapPost.length-1].timeNumber/60);
					}
					
					var actualStep = (endDate-startDate)/100;
					var step = actualStep;
				
					var i=0;
					var index=0;
					while(index<100 && i<mapPost.length){
						
						var col=0;
						self.toShowPost[index]=new Array();
						var actualDate = (mapPost[i].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
						if(mapPost[i].timeNumber)
							actualDate+=parseInt(mapPost[i].timeNumber/60);
					
						while(actualDate<=(startDate+actualStep)){
							self.toShowPost[index][col]=mapPost[i];
							col++;
							i++;
							if(i<mapPost.length){
								actualDate = (mapPost[i].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
								if(mapPost[i].timeNumber)
									actualDate+=parseInt(mapPost[i].timeNumber/60);
							}else
								break;
						}
//						if(index==99){
//							self.toShowPost[index].push(mapPost[mapPost.length-1]);
//						}
						index++;
						actualStep+=step;						
					}
				}
				self.bars = new Array();
				for(var i=0; i<100; i++){
					if(self.toShowPost[i])
						self.bars[i]=self.toShowPost[i].length;
					else
						self.bars[i]=0;
				}
				
			}
			
			self.posts.then(
					function(data){
						mapPost = angular.copy(data.content);
						elaborate();
					},
					function(reason){
						console.log("Error in retrieve post");
					}
			);
			
		
			
			
						
		},
		controllerAs: "dirMapScenario",
		bindToController : true,
		link : function(scope, element, attrs,ctrl){
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO adattare la dimensione del canvas a quella del modal???
//			canvas.width = 700;
			
			canvas.style.width ='100%';
			canvas.style.height='100%';
			
			var container = angular.element(document.querySelector('#container-canvas'));
			canvas.width  = container.width();
			canvas.height = container.height();
			var map = new Image();
			map.src = ctrl.map;
			var lastX = -1;
			var lastY = -1;
			
			//TODO anche per la dimensione del marker sarebbe da evitare il valore cablato
			var markerDim= 40;
			var original;
			
			map.onload = function(){
				var mapRatio = map.width / map.height;
				var newHeight = (map.height*canvas.width)/map.width;
				canvas.height = newHeight;
				ctx.drawImage(map, 0, 0, map.width, map.height, 0, 0, canvas.width, newHeight);
				original = ctx.getImageData(0,0,canvas.width, canvas.height);
			};	
				
			
			
			var drawMarker = function(n){
				if(ctrl.toShowPost){
					for(var i=0;i<n;i++){
						if(ctrl.toShowPost[i]){
							var alpha = Math.exp((i-n+1)*0.0135);
							ctx.globalAlpha=alpha;
							for(var j=0; j<ctrl.toShowPost[i].length;j++){
								if(ctrl.toShowPost[i][j].place){
									var x = (ctrl.toShowPost[i][j].place.x*canvas.width)-(markerDim/2);
									var y = (ctrl.toShowPost[i][j].place.y*canvas.height)-(markerDim);
									ctx.drawImage(marker, x, y, markerDim, markerDim);
								}
							}
							ctx.globalAlpha=1;
						}
					}
					if(ctrl.toShowPost && ctrl.toShowPost[n-1]){
						if(ctrl.toShowPost[n-1][0]){
							ctrl.actual = dateUtil.dateTimeToStringShort(ctrl.toShowPost[n-1][0].julianDayNumber,ctrl.toShowPost[n-1][0].timeNumber);
							ctrl.actual += " ("+ctrl.toShowPost[n-1].length+")";
						}
						else
							ctrl.actual="";
					}
					else
						ctrl.actual="";
				}
			}
			
//			var drawMarkerDelay = function(n){
//				if(ctrl.toShowPost){
//					for(var i=0;i<n;i++){
//						if(ctrl.toShowPost[i])
//							for(var j=0; j<ctrl.toShowPost[i].length;j++){
//								if(ctrl.toShowPost[i][j].place){
//									var x = (ctrl.toShowPost[i][j].place.x*canvas.width)-(markerDim/2);
//									var y = (ctrl.toShowPost[i][j].place.y*canvas.height)-(markerDim);
//									$timeout(ctx.drawImage(marker, x, y, markerDim, markerDim),1550);
//								}
//							}
//					}
//				}
//			}
			
			scope.$watch('dirMapScenario.slideNumber', function(newVal, oldVal){
				if(oldVal){
					ctx.putImageData(original,0,0);
					if(newVal!=0 && newVal>oldVal){
						drawMarker(newVal);
					}else if(newVal!=0 && newVal<oldVal){
						drawMarker(newVal);
					}
				}
			});
			
//			marker.onload = function(){
//				
//			}
		}
	}
}]);

angular.module("smiled.application").directive('metaCommentTo', [ 'apiService', 'CONSTANTS', 'notifyService',
	function(apiService, CONSTANTS, notifyService){
		return {
			templateUrl : "assets/private/partials/meta-comment-to-template.html",
			scope : {
				post : "=",
				writer : "=",
				scenarioId : "@",
				loggedUser : "="
			},
			controller : ['$scope' , function($scope){
				var self = this;
				var numVisibleComment = CONSTANTS.visibleComment;
				var self = this;
				self.showViewOthers = false;
				self.atLeastOneCommentWasSended = false;
				self.visibleComments = new Array();
//				self.post.metaComments.reverse();
				var i=0;
				while(i<self.post.metaComments.length && i<numVisibleComment){
					self.visibleComments.unshift(self.post.metaComments[i]);
					i++;
				}
				if(self.post.metaComments.length>numVisibleComment)
					self.showViewOthers = true;
				
				self.openViewOthers = function(){
					self.visibleComments = angular.copy(self.post.metaComments);
					self.visibleComments.reverse();
					self.showViewOthers = false;
				}
//				
//				var onDestroy = function(){
//					if(self.atLeastOneCommentWasSended)
//						self.post.metaComments.reverse();
//				}
//				$scope.$on("$destroy", function(){
//					onDestroy();
//				});
				self.addMetaCommentToPost = function(){
					if(self.post.newMetaComment){
						var metaComment = {};
						metaComment.text=self.post.newMetaComment;
						//aggiungo commento al post
						apiService.sendMetaCommentToPost(self.scenarioId, self.post.id, metaComment).then(
								function(data){
									metaComment.creationDate = new Date();
									metaComment.user = {};
									metaComment.user.id = self.loggedUser.id;
									metaComment.user.firstname = self.loggedUser.firstName;
									metaComment.user.lastname = self.loggedUser.lastName;
									self.post.metaComments.splice(0,0,metaComment);
									self.post.newMetaComment="";
									
									
									//prendo dal server nuovamente il post a cui ho aggiunto il commento
//									apiService.getSingleStatus(self.scenarioId, self.post.id).then(
//											function(data){
//												self.post = data;
//												self.post.newComment="";	
//												var numVisible = self.visibleComments.length;
//												
//												self.visibleComments = self.post.metaComments;
//												self.showViewOthers = false;
//												self.atLeastOneCommentWasSended = true;
//												
//												
//											},
//											function(reason){
//												console.log("error in insert new post in array");
//											}
//									);
								},
								function(reason){
									console.log("fail to send comment: "+reason);
								}
						);
					}
				}
			}],
			controllerAs: "metaCommentTo",
			bindToController : true,
			link : function(scope,elem,attrs,ctrl){
				scope.$watch('metaCommentTo.post.metaComments.length', function(newVal, oldVal){
					if(newVal!=oldVal ){
						if(ctrl.showViewOthers){
							ctrl.visibleComments.push(ctrl.post.metaComments[0]);
						}else
							ctrl.openViewOthers();
					}
				});
				
				scope.$watch('metaCommentTo.post.newMetaComment.length', function(newVal, oldVal){
					if(newVal>0 && (oldVal==0 || oldVal==undefined)){
						notifyService.addToInEditPost(ctrl.post.id);
					}else if((newVal==0 || newVal==undefined) && oldVal>0){
						notifyService.removeToInEditPost(ctrl.post.id);
					}
				});
				
				scope.$on('$destroy', function(){
					ctrl.post.newMetaComment="";
					notifyService.removeToInEditPost(ctrl.post.id);
				});
			}
		};
}]);
angular.module("smiled.application").directive("newspaperPreview", [ '$stateParams', 'apiService', 'CONSTANTS', '$state', 'article','alertingGeneric',
                                                                     function($stateParams, apiService, CONSTANTS, $state, article, alertingGeneric){
	return {
		restrict: "AE",
		templateUrl: "assets/private/partials/newspaper-preview.html",
		scope : {
			newspaper: '=?',
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			var scenId = $stateParams.id;
			self.publishedNewspapers = []; 
			self.publishedNewspaperNumber = 0;
			self.publishedNewspapers.idTemplate = 0; 
			self.articlesPreviews = [];  
			self.articles = [];
			self.article = {};
			self.isDraft; 
			self.article.idArticleTemplate = 0; 
			self.isJournalist = article.getIsJournalist(); 
			console.log(self.isJournalist + "CIAO"); 

			/*------------------- DATA FOR PREVIEWS THUMBNAILS ----------------*/


			apiService.getpublishedNewspapers(scenId).then(
					function(data) { 
						self.publishedNewspapers = data;  
						for(var i=0;  i<self.publishedNewspapers.length; i++) {
							if(self.publishedNewspapers[i].idTemplate == 1) {
								for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
									if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 3){
										self.publishedNewspapers[i].articles[j].newspaperNumber = self.publishedNewspapers[i].number; 
										self.publishedNewspapers[i].articles[j].image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
										self.articlesPreviews.push(self.publishedNewspapers[i].articles[j]);
										
									}

								}
							}

						}

					},function(reason){

						alertingGeneric.addWarning("Non è stato possibile caricare il giornale, riprova");

					}	
			); 


			
			

			self.goToNewspaper = function(newspaperNumber){ 
				article.setPublishedNewspaperNumber(newspaperNumber); 
				article.setIsPublished(true);  
				$state.go('logged.scenario.newspublished');


			}


		}],

		controllerAs: "newspaperPreview"

	}
}]);
angular.module("smiled.application").directive('pinPointCanvas', [ 'CONSTANTS', '$q',
                                                                function(CONSTANTS, $q){
	return {
		restrict : "A",
		scope : {
			post : "=",
			map : "@"
		},
		link : function(scope, element, attrs){
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			//TODO adattare la dimensione del canvas a quella del modal???
			canvas.width = 700;
			var map = new Image();
			map.src = scope.map;
			var lastX = -1;
			var lastY = -1;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO anche per la dimensione del marker sarebbe da evitare il valore cablato
			var markerDim= 40;
			var original;
			var promise = $q.defer();
			
			map.onload = function(){
				var mapRatio = map.width / map.height;
				var newHeight = (map.height*canvas.width)/map.width;
				canvas.height = newHeight;
				ctx.drawImage(map, 0, 0, map.width, map.height, 0, 0, canvas.width, newHeight);
				original = ctx.getImageData(0,0,canvas.width, canvas.height);
				promise.resolve();
			};
			
			marker.onload = function(){
				if(scope.post.place){
					promise.promise.then(
							function(data){
								var x = (scope.post.place.x*canvas.width)-(markerDim/2);
								var y = (scope.post.place.y*canvas.height)-(markerDim);
								ctx.drawImage(marker, x, y, markerDim, markerDim);
								lastX=x;
								lastY=y;
					});
				}
			}
			
		
			
			element.on('click', function(event){
				var pin = {};
				pin.x = event.offsetX/canvas.width;
				pin.y = event.offsetY/canvas.height;
				scope.post.place = pin;
 
				var x = event.offsetX-20;
				var y = event.offsetY-40;
				
				if(lastX!=-1 && lastY!=-1){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.putImageData(original,0,0);
				}
				ctx.drawImage(marker, x, y, markerDim, markerDim);
				lastX=x;
				lastY=y;
				
				
			});
		}
	}
}]);
//			element.on("click", function(event) {
//				var pin = {};
//				pin.x = event.offsetX/event.target.width;
//				pin.y = event.offsetY/event.target.height;
//				ctrl.post.place = pin;
//
//				var x = event.offsetX-20;
//				var y = event.offsetY-40;
//
//				var el = angular.element("#pin");
//				el.attr("style", "top: "+y+"px; left: "+x+"px; visibility: visible;");
//				scope.$apply(function(){
//					$compile(el)(scope);
//				});
////				var template = "<img id='pin"+ctrl.pinPoints.length+"' data-ng-src='assets/public/img/marker.png' class='top-layer marker' style='top: "+y+"px; left: "+x+"px;'>";
////				scope.$apply(function() {
////				var content = $compile(template)(scope);
////				$( "#overlay-container" ).append(content);
////				})
//			});

//			angular.element($window).bind('resize', function() {
//			var mapX = element.find('#map-layer').width(); 
//			var mapY = element.find('#map-layer').height();
//			for(var i=0; i<ctrl.pinPoints.length; i++){
//			var id = "pin"+(i+1);
//			var newX = Math.round(((ctrl.pinPoints[i].x*ctrl.pinPoints[i].naturalX)/mapX))-20;
//			var newY = Math.round(((ctrl.pinPoints[i].y*ctrl.pinPoints[i].naturalY)/mapY))-40;
////			var el = angular.element(id);
////			el.attr("style" , "top: "+newX+"px; left: "+newY+"px;");
////			$scope = el.scope();
////			$injector = angular.injector();
////			$injector.invoke(function($compile){
////			$compile(el)($scope)
////			})
//			}
//			});
		
	
angular.module("smiled.application").directive('showNewsPost', [ 'CONSTANTS', 'apiService', 'Lightbox', '$q', 'Upload', 'modalService', 'notifyService',

                                                                 function(CONSTANTS, apiService, Lightbox, $q, Upload, modalService, notifyService){
	return {
		templateUrl: "assets/private/partials/show-news-post-template.html",
		scope : {
			post: "=",
			scenario : "=",
			mapId : "@",
			currentCharacter : "=",
			loggedUser : "="
		},
		controller : function(){
			var self = this;
			var numMediaPerRow = 5;
			self.showTagBox=false;
			self.editPost=false;
			self.deleted=false;
			self.postDTO = {};
			self.postDTO.text = self.post.text;
			self.date={};				
			self.files = new Array();
			self.originalPost = angular.copy(self.post);
			self.editButton = false;
			
			var checkPermissionEdit = function(){
				if(self.scenario.teacherCreator.id == self.loggedUser.id){
					self.editButton = true;
					return;
				}
				if(self.scenario.collaborators){
					for (var i = 0; i< self.scenario.collaborators.length; i++){
						if(self.scenario.collaborators[i].id == self.loggedUser.id){
							self.editButton = true;
							return;
						}
					}
				}
				
				if(self.post.character && self.post.user.id == self.loggedUser.id){
					if(self.currentCharacter.id == self.post.character.id){
						self.editButton = true;
						return;
					}
				}
				
			}
			
			checkPermissionEdit();
			
			
			
			
			self.startDate = angular.copy(self.scenario.history.startDate);
			if(!self.startDate.afterChrist)
				self.startDate.year*=-1;
			self.endDate = angular.copy(self.scenario.history.endDate);
			if(!self.endDate.afterChrist)
				self.endDate.year*=-1;

			self.originalTagsList = angular.copy(self.post.tags);  //la uso per riaggiornare la lista di tag nel caso annullo la modifica al post
			self.originalJulianDayNumber = angular.copy(self.post.julianDayNumber);
			
			self.newCharactersToTags = new Array();

			self.switchEditPost = function(){
				self.editPost = !self.editPost;
				if(self.editPost){
					notifyService.addToInEditPost(self.post.id);
				}else{
					notifyService.removeToInEditPost(self.post.id);
				}
			}
			self.closeEditPost = function(){
//				self.post.tags = angular.copy(self.originalTagsList);
				self.postDTO = {};
				self.postDTO.text = self.post.text;
				self.editPost = !self.editPost;
				self.newCharactersToTags = [];
//				self.post.julianDayNumber = self.originalJulianDayNumber;
				self.post = angular.copy(self.originalPost);
				self.recalculateMatrix();
				notifyService.removeToInEditPost(self.post.id);

				//TODO modificare label per date dopo annullamento
			}

			if(self.post.imagesMetadata && self.post.imagesMetadata.length >0){
				self.colorImageMarker = {'color': '#89b151'};
			}

			if(self.post.place != null){
				self.colorMapMarker = {'color': '#89b151'};
			}


			
			if(!self.currentCharacter || !self.currentCharacter.id)
				self.classCommentButton="disabled-div";	

			self.getMediaUrl = function(id){
				var t = CONSTANTS.urlMedia(id);
				return t;
			}

			self.realDateFormat = CONSTANTS.realDateFormatWithHour;

			var getMonthString = function(month){
				return CONSTANTS.monthString(month);
			} 

			var julianNumberToDate = function(jd, date){
				var l = jd + 68569;
				var n = parseInt(( 4 * l ) / 146097);
				l = l - parseInt(( 146097 * n + 3 ) / 4);
				var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
				l = l - parseInt(( 1461 * i ) / 4) + 31;
				var j = parseInt(( 80 * l ) / 2447);
				date.day = l - parseInt(( 2447 * j ) / 80);
				l = parseInt(j / 11);
				date.month = j + 2 - ( 12 * l );
				date.year = 100 * ( n - 49 ) + i + l;
				date.dow = jd%7;
			}
			
			
			var getTimeToSeconds=function(timeNumber,t){
        		t.hours=parseInt(timeNumber/3600);
        		timeNumber=timeNumber%3600;
        		t.minutes=parseInt(timeNumber/60);
        		timeNumber=timeNumber%60;
        		t.seconds=timeNumber;
        	}

			self.formatDate = function(jd, timeNumber){
				julianNumberToDate(jd, self.date);
				var era = self.date.year > 0 ? "" : " a.C.";
				var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
				var f = self.date.day+" "+s;
				if(timeNumber){
					var t = {};
					getTimeToSeconds(timeNumber, t);
					f+=" "+t.hours+":";
					if(t.minutes<10)
	        			f+="0"+t.minutes;
	        		else
	        			f+=t.minutes;
				}
				return f;
			}



			self.showComment=false;
			self.showMetaComment=false;


			self.switchShowMetaComment = function(){
				self.showMetaComment = !self.showMetaComment;
				if(self.showMetaComment)
					self.showComment = false;
			}
			self.switchShowComment = function(){
				self.showComment = !self.showComment;
				if(self.showComment)
					self.showMetaComment = false;
			}


			if(self.post.imagesMetadata){
				self.post.media = new Array();
				self.post.media[0] = new Array();
				var col = -1;
				var row = 0;
				for(var j=0; j<self.post.imagesMetadata.length;j++){
					if(j!=0 && j%numMediaPerRow==0){
						col=0;
						row++;
						self.post.media[row] = new Array();
					}else{
						col++;
					}
					self.post.media[row][col] = CONSTANTS.urlMediaThumb(self.post.imagesMetadata[j].id);
					self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
				}
			}

			self.openPostGallery =function(row, col){
				var index = (row*numMediaPerRow)+col;
				if(self.post.media){
					Lightbox.openModal(self.post.imagesMetadata, index);
				}
			}

			self.post.comments.reverse();
			self.post.metaComments.reverse();

			self.viewMap = function(){
				var map = {'url': CONSTANTS.urlMedia(self.mapId)+".jpg"};
				modalService.showModalOpenMapForPost(self.post,map);
			}
			self.hideTagBox =function(){
				self.showTagBox=false;
			}
			self.switchShowTagBox =function(){
				self.showTagBox=!self.showTagBox;
			}
			self.addImageToPost = function(file){
				uploadMediaToPost(file,true);
			}
			self.recalculateMatrix =  function(){
				if(self.post.imagesMetadata.length >0){
					self.colorImageMarker = {'color': '#89b151'};
				}

				if(self.post.place != null){
					self.colorMapMarker = {'color': '#89b151'};
				}


				if(!self.currentCharacter || !self.currentCharacter.id)
					self.classCommentButton="disabled-div";	

				if(self.post.imagesMetadata){
					self.post.media = new Array();
					self.post.media[0] = new Array();
					var col = -1;
					var row = 0;
					for(var j=0; j<self.post.imagesMetadata.length;j++){
						if(j!=0 && j%numMediaPerRow==0){
							col=0;
							row++;
							self.post.media[row] = new Array();
						}else{
							col++;
						}
						self.post.media[row][col] = CONSTANTS.urlMediaThumb(self.post.imagesMetadata[j].id);
						self.post.imagesMetadata[j].url = CONSTANTS.urlMedia(self.post.imagesMetadata[j].id);
					}
				}

			}

			self.removeImage =function(row, col){
				var index = (row*numMediaPerRow)+col;
				modalService.showModalDeleteResource(self.post.imagesMetadata[index]).then(
					function(data){
						var id = angular.copy(self.post.imagesMetadata[index].id);
						apiService.deleteMedia(id, self.post.id).then(
							function(data){
								self.post.imagesMetadata.splice(index,1);
								self.recalculateMatrix();
								for(var i=0; i<self.originalPost.imagesMetadata.length; i++){
									if(self.originalPost.imagesMetadata[i].id==id){
										self.originalPost.imagesMetadata.splice(i,1);
									}
								}
							},
							function(reason){
								console.log("Impossibile eliminare immagine");
							}
						);
					}
				);
			}
			
			var assignFileType = function (){
				self.files.splice(0,self.files.length);
				for (var i=0; self.post.filesMetadata && i<self.post.filesMetadata.length; i++){
					var myFile = {};
					myFile.id = self.post.filesMetadata[i].id;
					myFile.originalName = self.post.filesMetadata[i].originalName;
					var split = myFile.originalName.split(".");
					var type = split[split.length-1];
					if(type == 'jpg' || type=="jpeg" || type == 'png' || type == 'gif'){
						myFile.fileType = 'img';
					}else if(type == 'pdf'){
						myFile.fileType = 'pdf';
					}else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
						myFile.fileType = 'doc';
					}else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
						myFile.fileType = 'ppt';
					}else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
						myFile.fileType = 'excel';
					}
					self.files.push(myFile);					
				}				
			}
			assignFileType();
			
			self.addFileToPost = function(file){
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				modalService.showModalDeleteResource(file).then(
						function(data){
							apiService.deleteMedia(file.id, self.post.id).then(
								function(data){
									for(var i=0; i<self.post.filesMetadata.length; i++){
										if(self.post.filesMetadata[i].id==file.id){
											self.post.filesMetadata.splice(i,1);
										}
									}
									for(var i=0; i<self.files.length; i++){
										if(self.files[i].id==file.id){
											self.files.splice(i,1);
										}
									}
									for(var i=0; i<self.originalPost.filesMetadata.length; i++){
										if(self.originalPost.filesMetadata[i].id==file.id){
											self.originalPost.filesMetadata.splice(i,1);
										}
									}
								}
							);
						}
				);
			}
			
			self.updatePositionPost = function(){
				var map = null;
				if(self.mapId)
					map = {'url': CONSTANTS.urlMedia(self.mapId)};
				modalService.showModalOpenMap(self.post,map);
			}
			
			self.getMedia = function(id){
				return CONSTANTS.urlMedia(id);
			}

			self.deletePost = function(){
				apiService.deletePost(self.scenario.id, self.post.id).then(
						function(data){
							self.deleted=true;
							self.post = {};
						},
						function(reason){
							console.log("DELETE POST FAILED");
						});
			}

			self.updateStatus = function(){

				self.postDTO.id = self.post.id;
				self.postDTO.julianDayNumber = self.post.julianDayNumber;
				self.postDTO.timeNumber = self.post.timeNumber;
				self.postDTO.place = self.post.place;
				var newTags = new Array();
				for(var i=0; i< self.newCharactersToTags.length; i++){
					newTags.push(self.newCharactersToTags[i].id);
				}

				var oldTags = new Array();
				if(self.post.tags){		
					for(var i=0; i< self.post.tags.length; i++){
						oldTags.push(self.post.tags[i].id);
					}
				}


				self.postDTO.tags = newTags;
				self.postDTO.tags = self.postDTO.tags.concat(oldTags);

				apiService.updateStatus(self.scenario.id, self.post.id, self.postDTO).then(
						function(data){
							self.post = data;
							self.originalTagsList = angular.copy(self.post.tags);
							self.newCharactersToTags = [];
							self.switchEditPost();
							self.recalculateMatrix();
							self.post.character.cover = CONSTANTS.urlCharacterCover(self.scenario.id,self.post.character.id);
							self.originalPost = angular.copy(self.post);
							self.postDTO = {};
							self.postDTO.text = self.post.text;
						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.post.tags = angular.copy(self.originalTagsList);
							self.postDTO = {};
							self.postDTO.text = self.post.text;
							self.newCharactersToTags = [];
							self.editPost = !self.editPost;
							modalService.showModalOldCharacterChangeOnComment(self.post.character.name);
						});


			}

			self.updateEvent = function(){

				self.postDTO.id = self.post.id;
				self.postDTO.julianDayNumber = self.post.julianDayNumber;
				self.postDTO.timeNumber = self.post.timeNumber;
				self.postDTO.place = self.post.place;

				var newTags = new Array();
				for(var i=0; i< self.newCharactersToTags.length; i++){
					newTags.push(self.newCharactersToTags[i].id);
				}

				var oldTags = new Array();
				if(self.post.tags){		
					for(var i=0; i< self.post.tags.length; i++){
						oldTags.push(self.post.tags[i].id);
					}
				}

		
				self.postDTO.tags = newTags;
				self.postDTO.tags = self.postDTO.tags.concat(oldTags);

				apiService.updateEvent(self.scenario.id, self.post.id, self.postDTO).then(
						function(data){
							self.post = data;
							self.originalTagsList = angular.copy(self.post.tags);
							self.newCharactersToTags = [];
							self.switchEditPost();
							self.recalculateMatrix();
							self.postDTO = {};
							self.postDTO.text = self.post.text;
							self.originalPost = angular.copy(self.post);
						},
						function(reason){
							console.log("UPDATE STATUS FAILED");
							self.editPost = !self.editPost;
						});


			}
			
			
			self.updateDate = function(){
				modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.post);
			}
			
			

			self.removeTag=function(index){
				self.post.tags.splice(index,1);
			}

			/*Function to pass to autocomplete of tag-input-directive*/
			self.search = function($query){

				//Inserisco nella lista di selectable solamente i personaggi che non sono già presenti nella lista di tags del post
				var selectable = new Array();
				self.suggestions = new Array();

				var founded=false;
				for(var i=0; i<self.scenario.characters.length; i++){
					founded=false;
					if(self.post.tags!=null){		
						for(var j=0; j<self.post.tags.length; j++){	

							if(self.scenario.characters[i].id == self.post.tags[j].id){
								founded=true;
								break;
							}
						}
						if(!founded)
							selectable.push(self.scenario.characters[i]);
					}
				}
				

				var regex = new RegExp("(^|\\s|-|'|,|\.)"+$query,"gi");
				if(selectable){



					if(!self.scenario.id){
						throw new Error("Unsupported type");
					}
					for(var i=0; i<selectable.length; i++){

						if(regex.test(selectable[i].name)){
							var suggestion = {};
							suggestion.name=selectable[i].name;
							suggestion.id=selectable[i].id;
							suggestion.cover=CONSTANTS.urlCharacterCover(self.scenario.id,selectable[i].id);
							self.suggestions.push(suggestion);
						}
					}

				}

				var result = $q.defer();
				result.resolve(self.suggestions);
				return result.promise;
			}
			/*-------------------------------------------------------*/
			
			var calculateType = function(uploadedFile){
				var split = uploadedFile.name.split(".");
				var type = split[split.length-1];
				uploadedFile.fileType =  null;
				if(type == 'jpg' || type == 'jpeg' || type == 'png' || type=='gif'){
					uploadedFile.fileType = 'img';
				}else if(type == 'pdf'){
					uploadedFile.fileType = 'pdf';
				}else if(type == 'doc' || type == 'docx' || type == 'odt' || type == 'txt'){
					uploadedFile.fileType = 'doc';
				}else if(type == 'ppt' || type == 'pptx' || type == 'odp'){
					uploadedFile.fileType = 'ppt';
				}else if(type == 'xls' || type == 'xlsx' || type == 'ods'){
					uploadedFile.fileType = 'excel';
				}
			}

			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				if(file && file.length){
					Upload.upload({
			            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
			            headers : {
			                'Content-Type': file.type
			            },
			            file: file
			        })
//			            .progress(function (evt) {
//			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//			        })
			        .then(function (response) {
			           if(isImage){
				           var uploadedFile = {};
			        	   uploadedFile.id = response.data.id;
			        	   uploadedFile.name = response.config.file[0].name;
			        	   self.post.imagesMetadata.push(uploadedFile);
			        	   self.recalculateMatrix();
			        	   if(!self.postDTO.imageMetaId)
			        		   self.postDTO.imageMetaId = new Array();
			        	   self.postDTO.imageMetaId.push(uploadedFile.id);
			           }else{
				           var uploadedFile = {};
				           uploadedFile.id = response.data.id;
				           uploadedFile.originalName = response.config.file[0].name;
			        	   self.post.filesMetadata.push(uploadedFile);
			        	   if(!self.postDTO.fileMetaId)
			        		   self.postDTO.fileMetaId = new Array();
			        	   self.postDTO.fileMetaId.push(uploadedFile.id);
			        	   assignFileType();
			           }
			        }, function(reason){
			        	console.log("Impossibile effettuare l'upload");
			        	//TODO aggiungere alert
			        });
				}
			}
			
			self.setPositionPost = function(){
				var map=null;
				if(self.scenario.history.mapId)
					map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
				modalService.showModalOpenMap(self.post,map);
			}
			
			/*-------------------------------------------------------*/

		},
		controllerAs: "showNewsPost",
		bindToController : true,
		link : function(scope,elem,attrs,ctrl){
			scope.$watch('showNewsPost.currentCharacter.id', function(newVal, oldVal){
				//capire su quale valore fare il watch
				if(!newVal){
					ctrl.classCommentButton="disabled-div";
				}
				else if(newVal != oldVal){
					ctrl.classCommentButton="";
				}
			});
			scope.$watch('showNewsPost.post.imageMetadata.length', function(val){
				//capire su quale valore fare il watch
				if(val>0){
					ctrl.colorImageMarker = {'color': '#89b151'};
				}else{
					//ctrl.colorImageMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('showNewsPost.post.filesMetadata.length', function(val){
				//capire su quale valore fare il watch
				if(val>0){
					ctrl.colorFileMarker = {'color': '#89b151'};
				}else{
					ctrl.colorFileMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('showNewsPost.post.place', function(newVal, oldVal){
				if(newVal && newVal.x && newVal.y){
					ctrl.colorMapMarker = {'color': '#89b151'};
				}else{
					ctrl.colorMapMarker = {'color': 'dark grey'};
				}
			});
			scope.$watch('showNewsPost.post.tags.length', function(val){
				if(val>0){
					ctrl.tagIsSet=true;
					ctrl.colorTagsMarker = {'color': '#89b151'};						
					ctrl.stringTags="";
					for(var i=0;i<val;i++){
						if(i>=2){						
							ctrl.stringTags+=" e altri personaggi";
							break;
						}else{
							if(i<val-1)
								ctrl.stringTags+=""+ctrl.post.tags[i].name+", ";
							else
								ctrl.stringTags+=""+ctrl.post.tags[i].name;
						}

					}
				}else{
					ctrl.colorTagsMarker = {'color': 'dark grey'};
					ctrl.stringTags="";
					ctrl.tagIsSet=false;
				}
			});
			
			var alertListener = scope.$on('notification.generateAlertUpd', function(event, data){
				if(ctrl.editPost && ctrl.post.id==data.id){
					modalService.showConcurrentModPost().then(
							function(data){
								;
							},
							function(reason){
								ctrl.closeEditPost();
							}
					);
				}
			})
			
			scope.$on('$destroy', function(){
				alertListener();
			});
			


		}

	}	 
}]);

angular.module('smiled.application').directive('showOnHoverParent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.show();
            });
            element.parent().bind('mouseleave', function() {
                 element.hide();
            });
       }
   };
});
angular.module("smiled.application").directive('summarizeInfoPost', [ 'CONSTANTS',
	function(CONSTANTS){
		return{
			templateUrl : "assets/private/partials/summarize-info-post-template.html",
			scope : {
				post : "=",
				currentCharacter : "=",
				showComment : "=",
				showMetaComment : "="
			},
			controller: function(){
				var self = this;
				self.likesLabel = "";
				self.commentsLabel = "";
				self.metaCommentsLabel = "";
				
				self.switchShowComments = function(){
					self.showMetaComment = false;
					self.showComment = !self.showComment;
				
				}
				
				self.switchShowMetaComments = function(){
					self.showComment = false;
					self.showMetaComment = !self.showMetaComment;
				}
				
				self.tooltipLikes = "";
				var i=0;
				self.l = CONSTANTS.lengthOfTooltipLikesList;
				while(i<self.l && i<self.post.likes.length){
					if(self.post.likes[i].id!=self.currentCharacter.id)
						self.tooltipLikes+=self.post.likes[i].name+"&#013";
					else
						self.post.youLike = true;
					i++;
				}
				if(self.post.likes.length==(self.l+1)){
					self.tooltipLikes+="e ad un&#39altra persona";
				}else if(self.post.likes.length>(self.l+1)){
					self.tooltipLikes+="e ad altre"+(self.post.likes.length-i)+" persone";
				}

			},
			controllerAs: "summarizeInfoPost",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				
				var updateLabel = function(){
					if(ctrl.post.likes.length==1 && !ctrl.post.youLike){
						ctrl.likesLabel = "Piace a <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>1 persona</span>";
					}
					else if(ctrl.post.likes.length>1 && !ctrl.post.youLike){
						ctrl.likesLabel = "Piace a <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>"+ctrl.post.likes.length+" persone</span>";
					}
					else if(ctrl.post.likes.length==1 && ctrl.post.youLike){
						ctrl.likesLabel = "Ti piace";
					}
					else if(ctrl.post.likes.length==2 && ctrl.post.youLike){
						ctrl.likesLabel = "Piace a te e ad <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>un' altra persona</span>";
					}
					else if(ctrl.post.likes.length>2 && ctrl.post.youLike){
						ctrl.likesLabel = "Piace a te e ad <span class='tooltips clickable' title='"+ctrl.tooltipLikes+"'>altre "+(ctrl.post.likes.length-1)+" persone</span>";
					}
					else if(ctrl.post.likes.length==0)
						ctrl.likesLabel = "";
				}
				
				scope.$watch('summarizeInfoPost.post.likes.length', function(val){
					updateLabel();
				});
				scope.$watch('summarizeInfoPost.currentCharacter.id', function(newVal, oldVal){
					
					var i=0;
					if(!newVal || newVal!=oldVal){
						ctrl.tooltipLikes="";
						while(i<ctrl.l && i<ctrl.post.likes.length){
							if(ctrl.post.likes[i].id!=newVal){
								ctrl.post.youLike = false;
								ctrl.tooltipLikes+=ctrl.post.likes[i].name+"&#013";
							}else
								ctrl.post.youLike = true;
							i++;
						}
						updateLabel();
					}
					
					
				});
				scope.$watch('summarizeInfoPost.post.comments.length', function(val){
					
					if(ctrl.post.comments.length==1)
						ctrl.commentsLabel = "1 commento";
					else if(ctrl.post.comments.length>1)
						ctrl.commentsLabel = ctrl.post.comments.length+" commenti";
				});
				scope.$watch('summarizeInfoPost.post.metaComments.length', function(val){
					
					if(ctrl.post.metaComments.length==1)
						ctrl.metaCommentsLabel = "1 suggerimento";
					else if(ctrl.post.metaComments.length>1)
						ctrl.metaCommentsLabel = ctrl.post.metaComments.length+" suggerimenti";
				});
			}
		}
}]);
angular.module("smiled.application").directive('myTagBox', [ 'CONSTANTS', '$document', function(CONSTANTS, $document){
	return {
		restrict: 'EA',
		templateUrl: 'assets/private/partials/tag-box-template.html',
		scope : {
			selectedTags : "=tags",
			selectable : "=",
			type : "@",
			scenarioId : "@?scenario"
		},
		controller : function(){
			var self = this;
			self.selectedIndex=-1;
			self.suggestions = new Array();
			self.searchText = "";
			self.showSuggestions=true;
			
			self.search = function(){
				self.suggestions = [];
				self.selectedIndex=-1;

				var regex = new RegExp("(^|\\s|-|'|,|\.)"+self.searchText,"gi");
				if(self.selectable){
					if(self.type=="user"){
						for(var i=0; i<self.selectable.length; i++){
							if(regex.test(self.selectable[i].firstname) || regex.test(self.selectable[i].lastname)){
								var suggestion = {};
								suggestion.name=self.selectable[i].lastname+" "+self.selectable[i].firstname;
								suggestion.id=self.selectable[i].id;
								suggestion.cover=CONSTANTS.urlUserCover(self.selectable[i].id);
								self.suggestions.push(suggestion);
							}
						}
					}else if(self.type=="character"){
						

						if(!self.scenarioId){
							throw new Error("Unsupported type");
						}
						for(var i=0; i<self.selectable.length; i++){
							if(regex.test(self.selectable[i].name)){
								var suggestion = {};
								suggestion.name=self.selectable[i].name;
								suggestion.id=self.selectable[i].id;
								suggestion.cover=CONSTANTS.urlCharacterCover(self.scenarioId,self.selectable[i].id);
								self.suggestions.push(suggestion);
							}

						}
					}else
						throw new Error("Unsupported type");
				}
			}

			self.removeTag=function(index){
				self.selectedTags.splice(index,1);
			}

			self.addToSelectedTags=function(index){
				if(self.selectedTags.indexOf(self.suggestions[index])===-1){
					self.selectedTags.push(self.suggestions[index]);
					self.searchText='';
					self.suggestions=[];
				}
			}
			
			self.checkKeyDown=function(event){
				if(event.keyCode===40){
					event.preventDefault();
					if(self.selectedIndex+1 !== self.suggestions.length){
						self.selectedIndex++;
					}else
						self.selectedIndex=0;
				}
				else if(event.keyCode===38){
					event.preventDefault();
					if(self.selectedIndex-1 !== -1){
						self.selectedIndex--;
					}else
						self.selectedIndex=self.suggestions.length-1;
				}
				else if(event.keyCode===13){
					self.addToSelectedTags(self.selectedIndex);
				}
			}
			
//			self.onFocusOut = function(){
//				
//				self.showSuggestions=false;
//			}
//			
//			self.onFocusIn = function(){
//				self.showSuggestions=true;
//			}
		},
		controllerAs: 'tagBox',
		bindToController : true,
		link : function(scope, elem, attrs, controller){
			
//			var clickedIn=false;
		
			scope.$watch('tagBox.selectedIndex',function(val){
				if(val!==-1) {
					controller.searchText = controller.suggestions[controller.selectedIndex].name;
				}
			});
			
			
			elem.on('focusout', function($event){
			
					controller.showSuggestions=false;
					scope.$apply();
//					clickedIn=false;
//					controller.suggestions=[];
//					controller.selectedIndex=-1;
//					controller.searchText="";

			});
			elem.on('focusin', function($event){
				
				controller.search();
				controller.showSuggestions=true;
				scope.$apply();
			});
			
//			elem.bind('mousedown', function(e){
//			    e.stopPropagation();

//			    clickedIn=true;
//			});
//			
			
		}
	}
}]);
angular.module("smiled.application").directive('updatePostOnScrool',[ '$window', 
    function($window){
		return {
			scope : {
				stop : '&',
				start : '&'
			},
			controller : function($scope) {
				var self = this;
				self.control = function() {
		             if (this.pageYOffset <= 150) {
		                 self.start();
		             } else {
		                 self.stop();
		             }
				};
			
			},
			controllerAs: "updatePostOnScrollCtrl",
			bindToController : true,
			link : function(scope, element, attrs, ctrl){
				angular.element($window).on("scroll", ctrl.control);
		          
				scope.$on('$destroy', function() {
		           	 console.log("LOCATION CHANGE");
		             ctrl.stop();
		             angular.element($window).off('scroll', ctrl.control);
		        });
			}
		};
}]);
angular.module("smiled.application").directive('userCard', [ 'CONSTANTS', 'userService',
	function(CONSTANTS, userService){
		return{
			templateUrl : "assets/private/partials/user-card.html",
			scope : {
				userid: "@"
//				post : "=",
//				currentCharacter : "=",
//				showComment : "=",
//				showMetaComment : "="
			},
			controller: function(){
				var self = this;
				self.user = null;
				self.profilePicture = null;
				self.userCover = null;
				self.ruolo = null;
				self.numScen = 0;
				userService.getUser(self.userid).then(
						function(data){
							self.user=data;
							self.profilePicture = CONSTANTS.urlUserCover(self.userid);
							self.userCover = CONSTANTS.urlUserCoverLarge(self.userid);
							var role = self.user.role;	
							if (role.authority=="ROLE_TEACHER")
								self.ruolo="DOCENTE";
							else self.ruolo="STUDENTE";
							if(self.user.creatingScenarios != null)	self.numScen += self.user.creatingScenarios.length;
							if(self.user.openScenarios != null)	self.numScen += self.user.openScenarios.length;
							if(self.user.closedScenarios != null)	self.numScen += self.user.closedScenarios.length;

						},
						function(reason){
							console.log(reason);
						}
				);
				//prendere lo user in base all'ID
				//prendere il n° di scenari e di compiti dello user

			},
			controllerAs: "userCard",
			bindToController : true,
			link : function(scope, elem, attrs, ctrl){
				
			}
		}
}]);
angular.module("smiled.application").directive('warningCharacters', ['article','$state','$log',
                                     function(article, $state, $log){
	
	return {
		restrict: 'E',
		templateUrl: "assets/private/partials/warning-characters.html",
		scope: {
			notifyWarning: '&edit',
			notifyClose: '&close',
			stylebox: '@'
		},
		controller: ['$scope', function($scope){
			var self = this;
			
			self.modifyNow = function(){
				$scope.notifyWarning(); 
			},
			
			self.close = function(){
				$scope.notifyClose();
			}
			 
			
		}],
		
		controllerAs: "warningCharacters", 
		
		link: function(scope,elem,attrs,ctrl) {
	
			
		}
		
	}
	
}]);
angular.module('smiled.application').directive('workSpinner', ['requestCounter', function (requestCounter) {
    return {
        restrict: "EA",
        transclude: true,
        scope: {},
        template: "<ng-transclude ng-show='requestCount'></ng-transclude>",
        link: function (scope) {

            scope.$watch(function () {
                return requestCounter.getRequestCount();
            }, function (requestCount) {
                scope.requestCount = requestCount;
            });

        }
    };

                                                               
}]);
angular.module('smiled.application').config(
               function exceptionService($provide){
            	   
           //$delegate rappresenta l'original service che si vuole decorare, in questo caso rappresenta l'exceptionHandler
           $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate , $injector){   //$injector
        	  return function(exception, cause){ 
        		  
        		  console.log("I'M ON EXCEPTION HANDLER");
        		  console.log ("EXCEPTION: "+exception+ ", cause: "+ cause);
        		  var $rootScope = $injector.get("$rootScope");
        		  $delegate(exception, cause);
        		 
        		  $rootScope.logAngularError(exception, cause);
        	  } 
           }]);
       
}).run(function ($http, $rootScope) {
    $rootScope.logAngularError = function (exception, cause) {
    	var errore = {};
    	errore.exceptionMessage = exception.message;
    	errore.cause = cause;
   	
        //Call your webservice here.
    	$http.post("/api/v1/clientException", errore )
                .success(function (response) {
                    console.log(JSON.stringify(response));
                });
    };

});


angular.module('smiled.application').factory('requestCounter',['$q', function requestCounter($q) {

        var requests = 0;

        var request = function (config) {
            requests += 1;
            return $q.when(config);
        };

        var requestError = function (error) {
            requests -= 1;
            return $q.reject(error);
        };

        var response = function (response) {
            requests -= 1;
            return $q.when(response);
        };

        var responseError = function (error) {
            requests -= 1;
            return $q.reject(error);
        };

        var getRequestCount = function () {
            return requests;
        };

        return {
            request: request,
            response: response,
            requestError: requestError,
            responseError: responseError,
            getRequestCount: getRequestCount
        };

}])
.config(function ($httpProvider) {
            $httpProvider.interceptors.push("requestCounter");
});

   
angular.module('smiled.application').run(function($rootScope){
	//utile per catturare gli eventi che riguardano le transizioni di stato di ui-router

		//quando ui-router fa scattare questo evento qui lo catturo
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
			console.log("impossibile caricare lo stato " + toState.name);
		});
		
	});

angular.module('smiled.application')
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', 'userService',
         function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, userService){

			var notFoundPath;
			$stateProvider
				.state('login',{
					url: "/login",
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
					templateUrl: function(){
						if(userService.hasRoleUser())
							return "assets/public/partials/dashboardUser.html";
						else if(userService.hasRoleTeacher())
							return "assets/public/partials/dashboardTeacher.html";
					},
					controller: "dashboardCtrl",
					data: {
						permissions:{
							only: ['user','teacher','admin'],
							redirectTo: 'login'
						}
					}
					
				})
				.state('register',{
					url: "/register",
					templateUrl: "assets/public/partials/register.html"
				})
				.state('notFound',{
					url: '/404',
					templateUrl: "assets/public/partials/404.html"
				});
			
			$locationProvider.html5Mode(true);
			
			$urlRouterProvider
				.otherwise('/');
			
			RestangularProvider.setBaseUrl('/api/v1');
		}])
		.run(function (userService) {
			userService.checkPermission();			
		});
	   

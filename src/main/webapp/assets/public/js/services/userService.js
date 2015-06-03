angular.module('smiled.application').factory('userService', [ '$http', '$cookies', '$state', '$localStorage', 'apiService', 'Permission', '$q',
               function userService($http,$cookies,$state,$localStorage,apiService, Permission, $q){

	var isLogged;
	var cookie;
	var user;

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    
    function onStartup(){
  		
		console.log("onStartup");

		/*Ogni qualvolta l'applicazione viene reinizializzata viene fatta una chiamata all'API /me così da rinfrescare le informazioni
		 * riguardanti l'utente (in realtà si preferisce non salvarle affatto su localStorage così da essere costretti alla chiamata e avere sempre
		 * info aggiornata). Il service restituisce un promise che si rende disponibile anche all'esterno di questo servizio*/
		user = apiService.getMe();
		
		/*Oltre al promise lo UserService espone anche una serie di valori booleani utili nella gestione dei permessi. Tali booleani vengono 
		 * calcolati sull'onSuccess della chiamata all'API /me*/
//		user.then(function(data){
//			isLogged=true;
//			$state.go('logged');
//		},function(reason){
//			isLogged=false;
//			hasRoleAdmin=false;
//			hasRoleTeacher=false;
//			hasRoleUser=false;
//			$state.go('login');
//		});
    	
    }
    
	function login(email, password){
		$http({
			url: '/ThesisProject/apiLogin',
			method: 'POST',
			data: 'j_username='+email+'&j_password='+password+"&submit="
		}).then(function(data){
			isLogged=true;
			user=apiService.getMe();
			checkPermission();
			$state.go("logged");
		},function(reason){
			console.log("Authentication failed: "+reason);
		})
	}
	
	function logout(){
		$http({
			url: '/ThesisProject/apiLogout',
			method: 'POST',
		}).then(function(data){
			console.log("logged out");
			isLogged=false;
			user=null;
			checkPermission();
			$state.go("login");
		},function(reason){
			console.log("Logout failed: "+reason);
		})
	}
	
	function checkPermission(){
		Permission.defineRole('anonymous',function(){
			
			var deferred = $q.defer();

			if(user==null)
				deferred.resolve();
			else{
				user.then(
						function(data){
							deferred.reject();
						}, function () {
							// Error with request
							deferred.resolve();
				});
			}
			return deferred.promise;
		})
		.defineRole('user',function(){
			
			var deferred = $q.defer();

			user.then(
					function(data){
						if(data.role.authority=="ROLE_USER")
							deferred.resolve();
						else
							deferred.reject();
					}, function () {
						// Error with request
						deferred.reject();
			});
			return deferred.promise;
		})
		.defineRole('teacher',function(){
			
			var deferred = $q.defer();

			user.then(
					function(data){
						if(data.role.authority=="ROLE_TEACHER")
							deferred.resolve();
						else
							deferred.reject();
					}, function () {
						// Error with request
						deferred.reject();
			});
			return deferred.promise;
		})
		.defineRole('admin',function(){
			
			var deferred = $q.defer();

			user.then(
					function(data){
						if(data.role.authority=="ROLE_ADMIN")
							deferred.resolve();
						else
							deferred.reject();
					}, function () {
						// Error with request
						deferred.reject();
			});
			return deferred.promise;
		});
	}
	
	onStartup();
	
	return {
	    login: login,
	    logout: logout,
	    checkPermission : checkPermission,
	    isLogged: isLogged,
	    user: user
	}; 
}]);

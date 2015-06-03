angular.module('smiled.application').factory('userService', [ '$http', '$cookies', '$state', '$localStorage', 'apiService', 'Permission', '$q',
               function userService($http,$cookies,$state,$localStorage,apiService, Permission, $q){

	var logged=false;
	var cookie;
	var user;
	var roleUser=false;
	var roleTeacher=false;
	var roleAdmin=false;
	
	var observerIsLoggedCallbacks = [];

	//register an observer
	function registerObserverCallback(callback){
		observerIsLoggedCallbacks.push(callback);
	}

	//call this when you know 'isLogged' has been changed
	var notifyObservers = function(){
		angular.forEach(observerIsLoggedCallbacks, function(callback){
			callback();
		});
	}


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
			logged=true;
			user=apiService.getMe();
			checkPermission();
			notifyObservers();
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
			logged=false;
			user=null;
			checkPermission();
			notifyObservers();
			$state.go("login");
		},function(reason){
			console.log("Logout failed: "+reason);
		})
	}
	
	function checkPermission(){
		Permission.defineRole('anonymous',function(){
			
			var deferred = $q.defer();

			if(user==null){
				deferred.resolve();
				roleUser=false;
				roleTeacher=false;
				roleAdmin=false;
			}
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
						if(data.role.authority=="ROLE_USER"){
							roleUser=true;
							deferred.resolve();
						}
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
						if(data.role.authority=="ROLE_TEACHER"){
							roleTeacher=true;
							deferred.resolve();
						}
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
						if(data.role.authority=="ROLE_ADMIN"){
							roleAdmin=true;
							deferred.resolve();
						}
						else
							deferred.reject();
					}, function () {
						// Error with request
						deferred.reject();
			});
			return deferred.promise;
		});
	}
	
	function isLogged(){
		return logged;
	}
	
	function hasRoleUser(){
		return roleUser;
	}
	
	function hasRoleTeacher(){
		return roleTeacher;
	}
	
	function hasRoleAdmin(){
		return roleAdmin;
	}
	
	onStartup();
	
	return {
	    login: login,
	    logout: logout,
	    checkPermission : checkPermission,
	    registerObserverCallback: registerObserverCallback,
	    isLogged: isLogged,
	    hasRoleUser: hasRoleUser,
	    hasRoleTeacher: hasRoleTeacher,
	    hasRoleAdmin: hasRoleAdmin,
	    user: user
	}; 
}]);

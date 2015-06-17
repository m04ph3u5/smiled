angular.module('smiled.application').factory('userService', [ '$http', '$state', 'apiService', 'Permission','alerting',
               function userService($http,$state,apiService, Permission, alerting){

	var logged=false;
	var user;
	var roleUser=false;
	var roleTeacher=false;
	var roleAdmin=false;
	
	var observerIsLoggedCallbacks = [];
	var observerImageProfileCallbacks = [];
	
	var registerObserverImageProfileCallback = function(callback){
		observerImageProfileCallbacks.push(callback);
	}
	
	var notifyImageProfileObservers = function(){
		angular.forEach(observerImageProfileCallbacks, function(callback){
			callback();
		});
	}

	//register an observer
	var registerObserverLoginCallback = function(callback){
		observerIsLoggedCallbacks.push(callback);
	}

	//call this when you know 'isLogged' has been changed
	var notifyLoginObservers = function(){
		angular.forEach(observerIsLoggedCallbacks, function(callback){
			callback();
		});
	}

    
    var onStartup= function(){
  		
		console.log("onStartup");

		/*Ogni qualvolta l'applicazione viene reinizializzata viene fatta una chiamata all'API /me così da rinfrescare le informazioni
		 * riguardanti l'utente (in realtà si preferisce non salvarle affatto su localStorage così da essere costretti alla chiamata e avere sempre
		 * info aggiornata). Il service restituisce un promise che si rende disponibile anche all'esterno di questo servizio*/
		user = apiService.getMe();
		
		/*Oltre al promise lo UserService espone anche una serie di valori booleani utili nella gestione dei permessi. Tali booleani vengono 
		 * calcolati sull'onSuccess della chiamata all'API /me*/
		user.then(function(data){
			logged=true;
			notifyLoginObservers();
			if(data.role.authority=="ROLE_USER"){
				roleUser=true;
				$state.go("student");
			}
			else if(data.role.authority=="ROLE_TEACHER"){
				roleTeacher=true;
				$state.go("teacher");
			}
			else if(data.role.authority=="ROLE_ADMIN"){
				roleAdmin=true;
				$state.go("admin");
			}
		},function(reason){
			logged=false;
			roleAdmin=false;
			roleTeacher=false;
			roleUser=false;
			$state.go('login');
		});
    	
    }
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	var login = function(email, password){
		$http({
			url: '/ThesisProject/apiLogin',
			method: 'POST',
			data: 'j_username='+email+'&j_password='+password+"&submit="
		}).then(function(data){
			logged=true;
			user=apiService.getMe();
			notifyLoginObservers();
			user.then(function(data){
				if(data.role.authority=="ROLE_USER"){
					roleUser=true;
					$state.go("student");
				}
				else if(data.role.authority=="ROLE_TEACHER"){
					roleTeacher=true;
					$state.go("teacher");
				}
				else if(data.role.authority=="ROLE_ADMIN"){
					roleAdmin=true;
					$state.go("admin");
				}
			},function(reason){
				logged=false;
				roleAdmin=false;
				roleTeacher=false;
				roleUser=false;
				$state.go('login');
			});
		},function(reason){
			alertingLogin.addDanger("Attenzione credenziali errate!");
			console.log("Authentication failed: ");
			console.log(reason);
		})
	}
	
	var logout = function(){
		$http({
			url: '/ThesisProject/apiLogout',
			method: 'POST',
		}).then(function(data){
			console.log("logged out");
			logged=false;
			user=null;
			roleAdmin=false;
			roleTeacher=false;
			roleUser=false;
			notifyLoginObservers();
			$state.go("login");
		},function(reason){
			console.log("Logout failed: "+reason);
		})
	}
	
	var  isLogged = function(){
		return logged;
	}
	
	var hasRoleUser = function(){
		return roleUser;
	}
	
	var hasRoleTeacher = function(){
		return roleTeacher;
	}
	
	var hasRoleAdmin = function(){
		return roleAdmin;
	}
	
	var getUser = function(){
		return user;
	}
	
	onStartup();
	
	return {
	    login: login,
	    logout: logout,
	    registerObserverLoginCallback: registerObserverLoginCallback,
	    registerObserverImageProfileCallback: registerObserverImageProfileCallback,
	    notifyImageProfileObservers: notifyImageProfileObservers,
	    isLogged: isLogged,
	    hasRoleUser: hasRoleUser,
	    hasRoleTeacher: hasRoleTeacher,
	    hasRoleAdmin: hasRoleAdmin,
	    getUser: getUser
	}; 
}]);

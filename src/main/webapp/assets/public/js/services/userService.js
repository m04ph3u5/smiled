angular.module('smiled.application').factory('userService', [ '$http', '$q',
               function userService($http, $q){

	var user = null;
	var callHttpGetMe = function(){
		return $http.get('/ThesisProject/api/v1/me')
			.then(onSuccessGetMe,onErrorGetMe);
	}
	
	var getUser = function(){
		if(user!=null){
			var u = $q.defer();
			u.resolve(user);
			return u.promise;
		}
		console.log("userService.getUser()");
		return callHttpGetMe();
		
	}
	
	var updateUser = function(){
		return callHttpGetMe();
	}
	
	var onSuccessGetMe = function(response){
		user=response.data;		
		console.log("userService.getUser() --> onSuccess");
		return user;
	}
	
	var onErrorGetMe = function(reason){
		user=null;
		console.log("Error retrieve user: "+reason);
		return $q.reject("Error retrieve user: "+reason);
	}
	
	var logout = function(){
		return $http({
			url: '/ThesisProject/apiLogout',
			method: 'POST',
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(
				function(data){
					console.log("logged out");
					user=null;
					return true;
				},
				function(reason){
					console.log("Logout failed: "+reason);
					return false;
				}
			);
	}
	
	var login = function(email, password){
		return $http({
			url: '/ThesisProject/apiLogin',
			method: 'POST',
			data: 'j_username='+email+'&j_password='+password+"&submit=",
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(
				function(data){
					console.log("Autenticato!")
					return true;	
				},
				function(reason){
					console.log("Authentication failed: ");
					console.log(reason);
					return false;
				}
			);
		}
	
	
	return {
		login: login,
		logout: logout,
		getUser: getUser,
		updateUser: updateUser
	}

	
//	var observerIsLoggedCallbacks = [];
//	var observerImageProfileCallbacks = [];
//	
//	var registerObserverImageProfileCallback = function(callback){
//		observerImageProfileCallbacks.push(callback);
//	}
//	
//	var notifyImageProfileObservers = function(){
//		angular.forEach(observerImageProfileCallbacks, function(callback){
//			callback();
//		});
//	}
//
//	//register an observer
//	var registerObserverLoginCallback = function(callback){
//		observerIsLoggedCallbacks.push(callback);
//	}
//
//	//call this when you know 'isLogged' has been changed
//	var notifyLoginObservers = function(){
//		angular.forEach(observerIsLoggedCallbacks, function(callback){
//			callback();
//		});
//	}
//
//    
//    var onStartup= function(){
//  		
//		console.log("onStartup");
//
//		/*Ogni qualvolta l'applicazione viene reinizializzata viene fatta una chiamata all'API /me così da rinfrescare le informazioni
//		 * riguardanti l'utente (in realtà si preferisce non salvarle affatto su localStorage così da essere costretti alla chiamata e avere sempre
//		 * info aggiornata). Il service restituisce un promise che si rende disponibile anche all'esterno di questo servizio*/
//		user = apiService.getMe();
//		
//		/*Oltre al promise lo UserService espone anche una serie di valori booleani utili nella gestione dei permessi. Tali booleani vengono 
//		 * calcolati sull'onSuccess della chiamata all'API /me*/
//		user.then(function(data){
//			logged=true;
//			notifyLoginObservers();
//			if(data.role.authority=="ROLE_USER"){
//				roleUser=true;
//				$state.go("student");
//			}
//			else if(data.role.authority=="ROLE_TEACHER"){
//				roleTeacher=true;
//				$state.go("teacher");
//			}
//			else if(data.role.authority=="ROLE_ADMIN"){
//				roleAdmin=true;
//				$state.go("admin");
//			}
//		},function(reason){
//			logged=false;
//			notifyLoginObservers();
//			roleAdmin=false;
//			roleTeacher=false;
//			roleUser=false;
//			$state.go('login');
//		});
//    	
//    }
//    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

//	
//	
//	
//	var  isLogged = function(){
//		return logged;
//	}
//	
//	var hasRoleUser = function(){
//		return roleUser;
//	}
//	
//	var hasRoleTeacher = function(){
//		return roleTeacher;
//	}
//	
//	var hasRoleAdmin = function(){
//		return roleAdmin;
//	}
//	
//	var getUser = function(){
//		return user;
//	}
//	
//	onStartup();
//	
//	return {
//	    login: login,
//	    logout: logout,
//	    registerObserverLoginCallback: registerObserverLoginCallback,
//	    registerObserverImageProfileCallback: registerObserverImageProfileCallback,
//	    notifyImageProfileObservers: notifyImageProfileObservers,
//	    isLogged: isLogged,
//	    hasRoleUser: hasRoleUser,
//	    hasRoleTeacher: hasRoleTeacher,
//	    hasRoleAdmin: hasRoleAdmin,
//	    getUser: getUser
//	}; 
}]);

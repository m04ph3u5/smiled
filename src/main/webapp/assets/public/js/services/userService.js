angular.module('smiled.application').factory('userService', [ '$http', '$q', '$cookies',
               function userService($http, $q, $cookies){


	var lastScenarioId = "";
	
	var setScenarioId = function(id){
		lastScenarioId = id;
	}
	
	var getScenarioId = function(){
		return lastScenarioId;
	}
	
	
	var getMe = function(){
		var u = $q.defer();
		$http.get('/api/v1/me').then(
			function(response){
				u.resolve(response.data);
				$cookies.put('myMescholaId', response.data.id);
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
				console.log(response.data);
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
					console.log("logged out");
					user=null;
					$cookies.remove('myMescholaId');
					log.resolve(data);
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
					console.log("Autenticato!")
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
	
	
	return {
		login: login,
		logout: logout,
		getMe : getMe, 
		getUser: getUser,
		registerObserverPersonalCover: registerObserverPersonalCover,
		notifyPersonalCoverObservers: notifyPersonalCoverObservers,
		setScenarioId : setScenarioId,
		getScenarioId : getScenarioId,
		changePassword : changePassword,
		changeFirstPassword : changeFirstPassword,
		updateMe : updateMe,
		confirmRegisterTeacher : confirmRegisterTeacher,
		deleteRegisterTeacher : deleteRegisterTeacher
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

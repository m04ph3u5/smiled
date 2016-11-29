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
	
	/*Map utilities objects*/
	var bounds = {};
	var center = {};
	var tileUrl = "";
	var marker = {};

	var getBounds = function(){
		return bounds;
	}
	var setBounds = function(b){
		bounds=b;
	}
	var getCenter = function(){
		return center;
	}
	var setCenter = function(c){
		center=c;
	}
	var getTileUrl = function(){
		return tileUrl;
	}
	var setTileUrl = function(s){
		tileUrl = s;
	}
	var getMarker = function(){
		return marker;
	}
	var setMarker = function(m){
		marker = m;
	}
	/* */
	
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
		getMeForPermission : getMeForPermission,
		getBounds : getBounds,
		setBounds : setBounds,
		getCenter : getCenter,
		setCenter : setCenter,
		getTileUrl : getTileUrl,
		setTileUrl : setTileUrl,
		setMarker : setMarker,
		getMarker : getMarker
	}

	

}]);

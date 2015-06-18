angular.module('smiled.application').controller('loginCtrl', ['userService', 'apiService','alerting',
                                                              function loginCtrl(userService, apiService, alerting){
	
	var self = this;
	self.user = {
		
	};
	
	
	self.register = {};
	/*Opzioni per datepicker*/
	self.dateOptions = {
			dateFormat: 'dd/mm/yy'
			//autosize: true
	};
	
	console.log("LoginCtrl");
		
	self.login = function(){
		console.log("1");
		if(self.user.email==null || self.user.email==""){
			alerting.addWarning("Inserire email");
			console.log("2");
		}
		else if(self.user.password==null || self.user.password==""){
			alerting.addWarning("Inserire password");
			console.log("3");
		}
		else if(!validateEmail(self.user.email)){
			alerting.addWarning("Email non valida!");
		}
		else{
			userService.login(self.user.email, self.user.password);
			self.user.password ="";
			console.log("4");
		}
	}
	var validateEmail = function (email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(email);
	}
	var logout = function(){
		userService.logout();
	}

	self.postRegister = function(){
		if(validateRegister()){
			apiService.postRegister(self.register).then(
					function(data){

						alert("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					},
					function(reason){

						self.register.email="";
						self.register.firstName="";
						self.register.lastName="";
						self.register.password="";
						self.register.bornDate="";
					}
			);
		}
		else{
			//GESTIRE ERRORE
			self.register.email="";
			self.register.firstName="";
			self.register.lastName="";
			self.register.password="";
			self.register.bornDate="";
		}
	}
	
	var validateRegister = function(){
		if(self.register.password!=self.confirmPassword)
			return false;
		
		return true;
	}
	

	
}]);
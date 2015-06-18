angular.module('smiled.application').controller('loginCtrl', ['userService', 'apiService','alertingLogin',
                                                              function loginCtrl(userService, apiService, alertingLogin){
	
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
			alertingLogin.addWarning("Inserire email");
			console.log("2");
		}
		else if(self.user.password==null || self.user.password==""){
			alertingLogin.addWarning("Inserire password");
			console.log("3");
		}
		else if(!validateEmail(self.user.email)){
			alertingLogin.addWarning("Email non valida!");
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



	
}]);
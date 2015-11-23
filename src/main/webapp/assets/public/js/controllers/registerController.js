angular.module('smiled.application').controller('registerCtrl', ['apiService', '$state', 'alertingRegistration',
                                                                 function registerCtrl(apiService, $state, alertingRegistration){

	var self = this;
	self.user= {};

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
						self.user.password="";
						self.user.confirmPassword="";
						alertingRegistration.addSuccess("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
					},
					//il server ha rifiutato la registrazione
					function(reason){ 
						self.user.email="";
						self.user.firstName="";
						self.user.lastName="";
						self.user.bornDate="";
						self.user.password="";
						self.user.confirmPassword="";
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
				self.user.lastName==null || self.user.lastName=="" || self.user.bornDate==null || self.user.password==null ||
				self.user.password=="" || self.user.confirmPassword==null || self.user.confirmPassword==""){
			alertingRegistration.addWarning("Compilare tutti i campi!");
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
	

}]);
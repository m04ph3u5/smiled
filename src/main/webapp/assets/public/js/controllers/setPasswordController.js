angular.module('smiled.application').controller('setPasswordCtrl', ['userService', '$state', 'alertingRegistration', '$timeout',
                                                                 function setPasswordCtrl(userService, $state, alertingRegistration, $timeout){

	var self = this;
	self.user= {};
	self.confirmRegister = function (){

		if(validateRegister()){
			userService.changeFirstPassword(self.user).then(
					function(data){
						//il server ha accettato il cambio della password
						console.log("success register");
						self.user.email="";
						self.user.firstname="";
						self.user.lastname="";
						self.user.bornDate="";
						self.user.newPassword="";
						self.user.confirmPassword="";
						alertingRegistration.addSuccess("La tua richiesta e' stata accettata. A breve riceverai una mail per confermare la tua registrazione");
						$timeout(function(){
							
							$state.go('notLogged.login');
						}, 5000);
					
					},
					//il server ha rifiutato la registrazione
					function(reason){ 
						self.user.email="";
						self.user.firstname="";
						self.user.lastname="";
						self.user.bornDate="";
						self.user.oldPassword="";
						self.user.newPassword="";
						self.user.confirmPassword="";
						alertingRegistration.addDanger("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						throw new Error ("Non e' stato possibile completare la registrazione, ti preghiamo di riprovare!");
						
						
					}
			);
		//la validazione lato client è fallita
		}else{
			self.user.oldPassword="";
			self.user.newPassword="";
			self.user.confirmPassword="";
		}
	}
	var validateRegister = function(){

		if(self.user.email==null || self.user.email=="" || self.user.firstname==null || self.user.firstname=="" || 
				self.user.lastname==null || self.user.lastname=="" || self.user.oldPassword==null || self.user.oldPassword=="" || self.user.newPassword==null ||
				self.user.newPassword=="" || self.user.confirmPassword==null || self.user.confirmPassword==""){
			alertingRegistration.addWarning("Compilare tutti i campi!");
			return false;
		}
		else if(!validateEmail(self.user.email)){
			alertingRegistration.addWarning("Email non valida!");
			return false;
		}
		else if(self.user.newPassword!=self.user.confirmPassword){
			alertingRegistration.addWarning("Attenzione le due password digitate non corrispondono!");
			return false;
		}
		else if(self.user.newPassword.length<8){
			alertingRegistration.addWarning("Nuova password troppo corta!");
			return false;
		}
		else if(self.user.oldPassword.length<8){
			alertingRegistration.addWarning("Vecchia password troppo corta!");
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
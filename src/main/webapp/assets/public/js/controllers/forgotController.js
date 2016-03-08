angular.module('smiled.application').controller('forgotCtrl', ['userService','alertingGeneric', 
  function forgotCtrl(userService, alertingGeneric){
	
	var self = this;
	self.userEmail="";
	
	self.sendNewPassRequest = function(){
		
		if(!self.userEmail || !validateEmail()){
			alertingGeneric.addWarning("Inserire un indirizzo mail valido");
		}else{
			var e = {};
			e.email = self.userEmail;
			userService.forgotPasswordRequest(e).then(
					function(data){
						
						alertingGeneric.addSuccess("Richiesta inviata con successo.");
					},
					function(reason){
						
						alertingGeneric.addDanger("Si è verificato un errore");
					}
			);
		}
	}
	
	var validateEmail = function () {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{1,6}(?:\.[a-z]{1})?)$/i;
	    return re.test(self.userEmail);
	}

	
}]);
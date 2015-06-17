angular.module('smiled.application').controller('registerCtrl', ['apiService', '$state', 'alertingRegistration',
                                                                 function registerCtrl(apiService, $state, alertingRegistration){

	console.log("registerController");
	var self = this;
	self.user= {};

	console.log("registerController");
	console.log(self.user);

	self.postRegister = function (){
		console.log(self.user);
		apiService.postRegister(self.user).then(
				function(data){
					console.log("success register");
					alertingRegistration.addSuccess("La tua richiesta è stata accettata. A breve riceverai una mail per confermare la tua registrazione");
				},
				function(reason){
					console.log("failure register");
					self.user.email="";
					self.user.firstName="";
					self.user.lastName="";
					self.user.borndate="";
					self.user.password="";

				}
		);
	}

}]);
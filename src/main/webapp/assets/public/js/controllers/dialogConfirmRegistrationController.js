angular.module('smiled.application').controller('dialogConfirmRegistrationCtrl', ['modalService', 'userService', 'alertingGeneric', '$scope','confirmRegistrationBool',
                 function dialogConfirmRegistrationCtrl(modalService, userService, alertingGeneric, $scope, confirmRegistrationBool){
	var self = this;
	self.reg = {};
	self.reg = modalService.getRegistrationToConfirm();
	self.confirmReg = confirmRegistrationBool;

	alertingGeneric.removeAllAlerts();
	
	self.confirm = function (){
			if(self.confirmReg){
				userService.confirmRegisterTeacher(self.reg.token, self.reg.email).then(
						function(data){
							
							modalService.closeModalConfirmRegistration();
						},
						function (reason){
							console.log("problem in confirmation register teacher");
							alertingGeneric.addDanger("Si è verificato un errore. Non è stato possibile confermare la registrazione!");			
						}
				
				);	
			}else{
				userService.deleteRegisterTeacher(self.reg.token, self.reg.email).then(
						function(data){
							
							modalService.closeModalConfirmRegistration();
						},
						function (reason){
							console.log("problem in delete register teacher");
							alertingGeneric.addDanger("Si è verificato un errore. Non è stato possibile annullare la registrazione!");	
						}
				
				);	
			}
			
		
	}
}]);
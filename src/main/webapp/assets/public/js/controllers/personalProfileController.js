angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS', '$cookies', '$filter', '$anchorScroll', '$location',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS, $cookies, $filter, $anchorScroll, $location){
	
	var self = this;
	var id = null;
	var role = null;
	self.ruolo = null;
	self.editProfile = false;
	self.editPassword = false;
	self.updateUserDTO = {};
	self.dateFormat = CONSTANTS.realDateFormatWithoutHour;
	self.isModifiable=false;
	self.user = {};
	self.oldPassword="";
	self.newPassword="";
	self.newPassword2 = "";
	self.messageErrorModifyPassword = "";
	
	self.dateOptions = {
			"regional" : "it",
			"changeYear" : true,
			"maxDate" : "0",
			"minDate" : new Date(1900,0,1,0,0,0,0),
			"yearRange" : "1900:c"
	};
	
	var myIdentity = $cookies.get('myMescholaId');
	
	var onSuccessGetUser = function(data){
		self.user = data;
		role = self.user.role;
		if(self.user.profile){
			self.updateUserDTO.gender = angular.copy(self.user.profile.gender);
			self.bornDateString = $filter( 'date') ( angular.copy(self.user.profile.bornDate), self.dateFormat );
			self.updateUserDTO.bornCity = angular.copy(self.user.profile.bornCity);
			self.updateUserDTO.schoolCity = angular.copy(self.user.profile.schoolCity);
			self.updateUserDTO.school = angular.copy(self.user.profile.school);
			self.updateUserDTO.quote = angular.copy(self.user.profile.quote);
			
		}
		
		
		if (role.authority=="ROLE_TEACHER")
			self.ruolo="DOCENTE";
		else if(role.authority=="ROLE_USER")
			self.ruolo="STUDENTE";
		else
			self.ruolo="AMMINISTRATORE";
	}
	
	var onErrorGetUser = function(reason){
		console.log("Error getting user personalProfile: "+reason);
	}
	var onErrorUpdateUser = function(reason){
		console.log("Error updating user personalProfile: "+reason);
	}

	if($stateParams.id)
		id = $stateParams.id;
	if(id){
		userService.getUser(id).then(onSuccessGetUser, onErrorGetUser);
		
		if(id == myIdentity){
			var d = new Date();
			self.url = CONSTANTS.urlMeCover+"?"+d.toString();
			self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+d.toString();
			self.isModifiable=true;
		}
		else{
			var d = new Date();
			self.url = CONSTANTS.urlUserCover(id)+"?"+d.toString();
			self.coverLarge = CONSTANTS.urlUserCoverLarge(id)+"?"+d.toString();
		}
		
	}else{
		userService.getMe().then(onSuccessGetUser, onErrorGetUser);
		var d = new Date();
		self.url = CONSTANTS.urlMeCover+"?"+d.toString();
		self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+d.toString();
		self.isModifiable=true;
	}
	
	self.updateMe = function(){
		
		if(self.bornDateString){
			var s = self.bornDateString.split("-");
			
		    var d = new Date(s[2], s[1]-1, s[0], 0, 0, 0, 0);
			self.updateUserDTO.bornDate = d;
		}
		
		userService.updateMe(self.updateUserDTO).then(onSuccessGetUser, onErrorUpdateUser);
	}
	
	self.uploadCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/me/cover/',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	            
	            var date = new Date();
	            self.url = CONSTANTS.urlMeCover+"?"+date.toString();    
	            userService.notifyPersonalCoverObservers();
	        });
		}
	}
	
	self.uploadCoverLarge = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/me/coverLarge',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	           
	            var date = new Date();
	            self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+date.toString();    
	            //userService.notifyPersonalCoverObservers();
	        });
		}
	}
	
	self.switchEditPassword = function(){
		
		self.editPassword = !self.editPassword;
		if(self.editPassword==true){
			$location.hash("changePwd");
		    $anchorScroll();
		    $location.url($location.path());
		}
			
		
	}
	
	self.switchEditProfile = function(){
		self.editProfile = !self.editProfile;
		self.editPassword = false;
	}
	
	self.showEditProfile = function(){
		self.editPassword = false;
		self.editProfile = true;
	}
	
	self.closeEditProfile = function(){
		self.editProfile = false;
		
		self.deleteModifyPassword();
	}

	self.deleteUpdateMe = function(){
		self.updateUserDTO = {};
		if(self.user.profile){
			self.updateUserDTO.gender = angular.copy(self.user.profile.gender);
			self.bornDateString = $filter( 'date') ( angular.copy(self.user.profile.bornDate), self.dateFormat );
		
			self.updateUserDTO.bornCity = angular.copy(self.user.profile.bornCity);
			self.updateUserDTO.schoolCity = angular.copy(self.user.profile.schoolCity);
			self.updateUserDTO.school = angular.copy(self.user.profile.school);
			self.updateUserDTO.quote = angular.copy(self.user.profile.quote);
		}
	}
	
	self.deleteModifyPassword = function(){
		self.oldPassword="";
		self.newPassword="";
		self.newPassword2 = "";
		self.editPassword=false;
		self.messageErrorModifyPassword ="";
	}
	self.modifyPassword = function(){
		self.messageErrorModifyPassword ="";
		if(self.oldPassword && self.newPassword){
			if(self.newPassword.length<8){
				self.messageErrorModifyPassword = "Inserire una password lunga almeno 8 caratteri!";
				self.oldPassword="";
				self.newPassword="";
				self.newPassword2="";
			}else{
				if(self.newPassword == self.newPassword2){
					var passwordDTO = {};
					passwordDTO.oldPassword = self.oldPassword;
					passwordDTO.newPassword = self.newPassword;
					userService.changePassword(passwordDTO).then(
							function(data){
								self.oldPassword="";
								self.newPassword="";
								self.newPassword2="";
								self.editPassword = false;
								alert("Password modificata correttamente");
							},
							function(reason){
								
								self.messageErrorModifyPassword = "Errore nel cambio password!";
								self.oldPassword="";
								self.newPassword="";
								self.newPassword2="";
							}
					);
				}else{
					
					self.messageErrorModifyPassword = "Errore - le due password non corrispondono!";
					self.oldPassword="";
					self.newPassword="";
					self.newPassword2="";
				}
			}
			
			
		}else{
			
			self.messageErrorModifyPassword = "Inserire tutti i campi richiesti!";
			self.oldPassword="";
			self.newPassword="";
			self.newPassword2="";
		}
	}
	
}]);

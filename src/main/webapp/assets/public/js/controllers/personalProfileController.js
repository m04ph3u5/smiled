angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS', '$cookies',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS, $cookies){
	
	var self = this;
	var id = null;
	var role = null;
	self.ruolo = null;
	self.editablePassword = false;
	
	var myIdentity = $cookies.get('myMescholaId');
	
	var onSuccessGetUser = function(data){
		self.user = data;
		role = self.user.role;	
		if (role.authority=="ROLE_TEACHER")
			self.ruolo="DOCENTE";
		else 
			self.ruolo="STUDENTE";
	}
	
	var onErrorGetUser = function(reason){
		console.log("Error getting user personalProfile: "+reason);
	}
	
	self.dateFormat = CONSTANTS.realDateFormatWithoutHour;
	self.isModifiable=false;

	
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
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
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
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	            var date = new Date();
	            self.coverLarge = CONSTANTS.urlMeCoverLarge+"?"+date.toString();    
	            //userService.notifyPersonalCoverObservers();
	        });
		}
	}
	
	self.editPassword = function(){
		self.editablePassword = !self.editablePassword;
	}
	
	self.modifyPassword = function(){
		if(self.oldPassword && self.newPassword){
			var passwordDTO = {};
			passwordDTO.oldPassword = self.oldPassword;
			passwordDTO.newPassword = self.newPassword;
			userService.changePassword(passwordDTO).then(
					function(data){
						console.log("password correttamente modificata!");
						self.oldPassword="";
						self.newPassword="";
						self.editablePassword = false;
					},
					function(reason){
						console.log("errore nel cambio password");
						self.oldPassword="";
						self.newPassword="";
					}
			);
		}
	}
	
}]);

angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS', '$cookies',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS, $cookies){
	
	var self = this;
	var id = null;
	var role = null;
	self.ruolo = null;
	
	var myIdentity = $cookies.get('myMescholaId');
	
	var onSuccessGetUser = function(data){
		self.user = data;
		role = self.user.role;	
		console.log(self.user);
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
			self.url = CONSTANTS.urlMeCover;
			self.coverLarge = CONSTANTS.urlMeCoverLarge;
			self.isModifiable=true;
		}
		else{
			self.url = CONSTANTS.urlUserCover(id);
			self.coverLarge = CONSTANTS.urlUserCoverLarge;
		}
		
	}else{
		userService.getMe().then(onSuccessGetUser, onErrorGetUser);
		self.url = CONSTANTS.urlMeCover;
		self.coverLarge = CONSTANTS.urlMeCoverLarge;
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
	
}]);

angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS){
	
	var self = this;
	var id = null;
	var role = null;
	self.ruolo = null;
	
	var onSuccessGetUser = function(data){
		self.user = data;
		role = self.user.firstName;	
		if (role=='{"authority":"ROLE_TEACHER"}') self.ruolo="DOCENTE";
		else self.ruolo="STUDENTE";
		console.log("metti:"+role + ruolo);
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
		self.url = CONSTANTS.urlUserCover(id);
	}else{
		userService.getMe().then(onSuccessGetUser, onErrorGetUser);
		self.url = CONSTANTS.urlMeCover;
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
	
}]);
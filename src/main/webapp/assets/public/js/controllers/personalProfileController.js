angular.module('smiled.application').controller('personalProfileCtrl', ['Upload','userService', '$stateParams', 'CONSTANTS',
                                                              function personalProfileCtrl(Upload, userService, $stateParams, CONSTANTS){
	
	var self = this;
	var id = null;
	
	var onSuccessGetUser = function(data){
		self.user = data;
	}
	
	var onErrorGetUser = function(reason){
		console.log("Error getting user personalProfile: "+reason);
	}
	
	if($stateParams.id)
		id = $stateParams.id;
	if(id){
		userService.getUser(id).then(onSuccessGetUser, onErrorGetUser);
		self.url = CONSTANTS.urlGetUserCover(id);

	}else{
		userService.getMe().then(onSuccessGetUser, onErrorGetUser);
		self.url = CONSTANTS.urlGetMeCover;

	}
	
	
	
	var uploadCover = function(file){
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
	            //userService.notifyImageProfileObservers();          
	        });
		}
	}
	
}]);
angular.module('smiled.application').factory('apiService', [ 'Restangular', 
              function apiService(Restangular){
	
	var me = Restangular.one('me');
	var register = Restangular.one('register');
	var uploadMedia = Restangular.one("media");
	
	function getMe(){
		return me.get();
	}
	
	function postRegister(registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}
	
	function uploadCoverScenario(id, cover){
		console.log("uploadCover");
		console.log(cover);
		return uploadMedia
		.withHttpConfig({transformRequest: angular.identity})
		.customPOST(cover,"scenarios/"+id+"/cover", undefined, { 'Content-Type': undefined });
	}
	

	return {
		getMe: getMe,
		postRegister: postRegister,
		uploadCoverScenario: uploadCoverScenario,
	}
	
	
	
}]);
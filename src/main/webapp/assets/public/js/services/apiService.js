angular.module('smiled.application').factory('apiService', [ 'Restangular', 
              function apiService(Restangular){
	
	var me = Restangular.one('me');
	var meImage = Restangular.one('me/media/image/meta');
	var meFile = Restangular.one('me/media/files/meta')
	var register = Restangular.one('register');
	var uploadMedia = Restangular.one("media");
	
	function getMe(){
		return me.get();
	}
	
	function postRegister(registerObject){
		console.log(registerObject);
		return register.post("",registerObject);
	}
	
	function createScenario(scenarioDTO){
		var scenario = Restangular.one("scenarios");
		console.log(scenarioDTO);
		return scenario.post("",scenarioDTO);
	}
	
	function updateScenario(id,scenarioDTO){
		var scenario = Restangular.one("scenarios",id);
		scenario.name = scenarioDTO.name;
		scenario.startHistoryDate = scenarioDTO.startHistoryDate;
		scenario.endHistoryDate = scenarioDTO.endHistoryDate;
		scenario.put();		
	}
	
	function getImagePersonalProfile(){
		return meImage.get();
	}
	
	function getFilePersonalProfile(){
		return meFile.get();
	}

	return {
		getMe: getMe,
		postRegister: postRegister,
		createScenario : createScenario,
		getImagePersonalProfile: getImagePersonalProfile,
		getFilePersonalProfile: getFilePersonalProfile
	}
	
	
	
}]);
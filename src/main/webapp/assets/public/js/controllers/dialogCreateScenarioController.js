angular.module('smiled.application').controller('createScenarioCtrl', ['apiService',
       
                                                                  function createScenarioCtrl(apiService){
	
	var self = this;
    function onStartup(){
    	console.log("ciao sono il controller del dialog");
    }
	var createScenario = function (){
		console.log("ciao");
	}
	
	return {
		createScenario : createScenario
	}
	
}]);
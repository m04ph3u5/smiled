angular.module('smiled.application').run(function($rootScope, alertingLogin){
	//utile per catturare gli eventi che riguardano le transizioni di stato di ui-router

		//quando ui-router fa scattare questo evento qui lo catturo
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
			alertingLogin.addDanger("Impossibile caricare lo stato: "+ toState.name);
			console.log("impossibile caricare lo stato " + toState.name);
		});
		
	});

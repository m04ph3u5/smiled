angular.module('smiled.application').controller('dashboardNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService','$stateParams', '$state','loggedUser',
              function dashboardNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $stateParams, $state, loggedUser){
	
	
	var self = this; 
	var scenId = $stateParams.id;
	self.scen = $scope.scenario.scen;
	self.newspaper = {};
	//info dell'utente loggato, servono per fare i controlli sulla visualizzazione del giornale 
	self.loggedUser = loggedUser;
	self.currentCharacter = {}; 	
	
	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				
				self.newspaper = data; 
				console.log(self.newspaper.status + "STATO");  
				
				
				
			},function(reason){
				$state.go('logged.scenario.editorial');
				console.log("Non c'è l'ultimo giornale");	
			}
)

	self.myNews = [];
	
	self.myNews = apiService.getMyNewspapers(scenId).then(
			function(data){
				
				self.myNews = data;
				console.log(self.myNews + "GIORNALI")
				
			},function(reason){
				console.log("Errore.");	
			}	
	
	)


	self.idTemplate = self.newspaper.idTemplate; 
	
	
	//modal Carousel scelta impaginazione
	
    self.showPopUpTemplates = function (){
    	modalService.showChooseTemplate();  
		//modalService.showModalChooseTemplate();
	};
	
	self.goToTemplate = function (){	
	$state.go('logged.scenario.template1');
	}
	
	
	/*
		if(self.idTemplate == "2"){
			$state.go('logged.scenario.template2');
			
			
		}*/
	
	
	
	
	
}]);
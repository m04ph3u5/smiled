angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	var scenId = $stateParams.id;
	
	
	//TO DO --> gestione se il giornale non fosse in bozza  
	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data; 
				self.idTemplate = self.newspaper.idTemplate; 
				
			},function(reason){
				self.newspaper = {}; 
				self.newspaper.name = "Inserisci il titolo";
				console.log("Errore.");	
			}
)

	
	self.showPopUpDeleteNewspaper = function (){
		modalService.showModalDeleteNewspaper()			
	}
	
	
	self.deleteNewspaper = function(){
		
		modalService.deleteNewspaper(scenId, self.newspaper.number);
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
	
	
	
	   		


    
   
	
}]);
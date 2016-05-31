angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	var scenId = $stateParams.id;
	self.newspaper = {}; 
	
	//TO DO --> gestione se il giornale non fosse in bozza  
	self.newspaper = apiService.getMyLastNewspaper(scenId).then(
			function(data){
				self.newspaper = data; 
				self.idTemplate = self.newspaper.idTemplate; 
				console.log(self.newspaper.idTemplate + "STATO");  
			},function(reason){
				console.log("Errore.");	
			}
)

	
	// PROVA API
	self.loadNews = function(){
		self.newspaper = apiService.getMyNewspapers(scenId).then(
				function(data){
					var myNews = []; 
					myNews = data;
					
					for(var i=0; myNews && i<myNews.length; i++){
						
						if(myNews[i].status == 'DRAFT') {
							
							self.lastNews = myNews[i];
							console.log(self.lastNews.name +  self.lastNews.idTemplate +  self.lastNews.historicalDate); 
							break; 
							
						}
					
						
					}
					
				},function(reason){
					console.log("Errore.");
					
				}
	)
		
		
	}


	self.showPopUpDeleteNewspaper = function (){
		modalService.showModalDeleteNewspaper()			
	}
	
	
	self.deleteNewspaper = function(){
		
		modalService.deleteNewspaper(scenId, self.newspaper.number);
		modalService.closeModalDeleteNewspaper();
		$state.go("logged.scenario.editorial");
		
		
	}
	
	
	
	   		


    
   
	
}]);
angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	self.scen = $scope.scenario.scen;
	var scenId = $stateParams.id;
	self.newspaper = {};
	
	self.numberJustCreated = article.getNumberJustCreated(); 

	self.newspaper = article.getCurrentNewspaper();
	console.log(self.newspaper); 

	if(self.newspaper = {}){
		//TO DO --> gestione se il giornale non fosse in bozza  
		apiService.getMyLastNewspaper(scenId).then(
				function(data){
					self.newspaper = data; 
					console.log(self.newspaper);
					
				},function(reason){
					
					if(reason.status == "500"){
						self.newspaper = {};
						self.newspaper.name = CONSTANTS.insertHeadline;	
						self.newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
					}
					
					console.log("Errore.");	
				}
		);
	}

	//cancel newspaper 
	self.showPopUpDeleteNewspaper = function (){
		self.numberJustCreated = article.getNumberJustCreated(); 
		if(self.numberJustCreated  != 0) {
			modalService.showModalDeleteNewspaper(scenId, self.numberJustCreated);
	
		} else {
			
			modalService.showModalDeleteNewspaper(scenId, self.newspaper.number);		
		}
		
				
	}
	
	
}]);
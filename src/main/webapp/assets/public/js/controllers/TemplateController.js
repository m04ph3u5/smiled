angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	self.scen = $scope.scenario.scen;
	var scenId = $stateParams.id;
	self.newspaperPut = {}; 
	self.newspaperPut.publish = false; 
	self.newspaper = {};
	
	self.numberJustCreated = article.getNumberJustCreated(); 

	self.newspaper = article.getCurrentNewspaper();
	
	if(self.newspaper = {}){
		
		apiService.getMyLastNewspaper(scenId).then(
				function(data){
					
					if(data.status == "DRAFT"){
						self.newspaper = data; 	
						
					} else {
						self.newspaper = {};
						self.newspaper.name = CONSTANTS.insertHeadline;	
						self.newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper;	
					}
					
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
	 
	
	//pubblicazione giornale
	self.publishNewspaper = function(){
		
		self.newspaperPut.publish = true; 
		console.log(self.newspaperPut); 
		var n = apiService.updateNewspaper(scenId, self.newspaper.number, self.newspaperPut); 
		n.then(function(data){
			
			$state.go('logged.scenario.editorial');
			
			
		}, function(reason){
			
			console.log("Impossibile pubblicare il giornale"); 
			
		}
				);

	}
	
}]);
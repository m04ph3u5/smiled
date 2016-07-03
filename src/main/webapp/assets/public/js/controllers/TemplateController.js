angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams', 'loggedUser',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, loggedUser){
	
	var self = this; 
	self.showWarning = false;
	self.currentIdTemplate = article.getIdCurrentTemplate();
	self.scen = $scope.scenario.scen;
	self.loggedUser = loggedUser;
	self.isJournalist; 
	var scenId = $stateParams.id;
	self.newspaperPut = {}; 
	self.newspaperPut.publish = false; 
	self.newspaper = {};
	self.idArticle; 
	
	self.numberJustCreated = article.getNumberJustCreated(); 

	self.newspaper = article.getCurrentNewspaper();
	
	
	if(self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 

	}
	
	
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

	
	self.goToDashboard = function(){
		
		$state.go('logged.scenario.editorial');
		
	}
	
	
	
	//vai alle bozze per modifica 
	self.goToDraft = function(id){
		
		//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
		self.currentHeadline = article.getNameJustCreated(); 
		if(self.currentHeadline == "" && self.newspaper.status == undefined || self.isJustDeleted == true){
			modalService.showAlertNewspaper();

		} 

		else {
			switch (id){
				
			case 1: 
				self.idArticle = 1;
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticle2col');
				break;
			case 2: 
				self.idArticle = 2;
				console.log("PASSO DI QUI PER BOZZA ARTICOLO 2"); 
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticleSimple');
				break;	
			case 3: 
				self.idArticle = 3;
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticle2col');
				break;
			default: 
				console.log("ERROR");
				
			}
			/*article.setArticleId(self.idArticle);*/
			

		}

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
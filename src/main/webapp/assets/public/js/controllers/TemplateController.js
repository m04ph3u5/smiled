angular.module('smiled.application').controller('templateCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams', 'loggedUser','alertingGeneric',
              function templateCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, loggedUser, alertingGeneric){
	
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
	self.newspaper = article.getCurrentNewspaper();
	self.idArticle; 
	
	self.numberJustCreated = article.getNumberJustCreated(); 

	
	if(self.loggedUser.id == self.scen.actualJournalist.id){
		self.isJournalist = true; 
	}
	
		apiService.getMyLastNewspaper(scenId).then(
				function(data){
					/*Il giornale esiste già */
					if(data.status == "DRAFT"){
						self.newspaper = data; 	
						
						console.log("IL GIORNALE ESISTE GIà"); 
					} 
					
					/*La redazione ha già un giornale, prendo il nome della testata precedente*/
					
					else if (data.status == "PUBLISHED")  {
						
						var n = apiService.getLastNewspaper(scenId);
						n.then(
								function(data){
									self.newspaper.number = data.number+1;
									self.newspaper.name = CONSTANTS.insertHeadline; 
									/*self.newspaper.name = data.name;*/ 
								
									
								},function(reason){
			
									console.log("Errore.");	
								}
						);
						
					} console.log(self.newspaper); 
					
				},function(reason){
					/*Giornale del tutto nuovo, assegno variabili di default*/
					if(reason.status == "500" || reason.status == "404"){
						self.newspaper = {};
						self.newspaper.historicalDate = CONSTANTS.insertHistoricalDateNewspaper; 
						self.newspaper.name = CONSTANTS.insertHeadline; 
					}
					
					console.log("Errore.");	
				}
				
				
		);
		
		//settaggio numero appena si sceglie il template in base a un giornale esistente o meno e NOME in base a giornale già esistente o meno
		
		var n = apiService.getLastNewspaper(scenId);
		n.then(
				function(data){
					self.newspaper.number = data.number+1; 
					
				},function(reason){
					
					if(reason.status == "500" || reason.status == "404"){
						self.newspaper.number = 1;
					 
					}
				}
		);			

	self.goToDashboard = function(){	
		$state.go('logged.scenario.editorial');
		
	}

	//vai alle bozze per modifica 
	self.goToDraft = function(id){
		
		console.log(self.newspaper.number); 
		
		
		//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
		self.currentHeadline = article.getNameJustCreated(); 
		self.isJustDeleted = article.getIsJustDeleted();
		console.log(self.isJustDeleted + "PROVA APPENA CANCELLATO"); 
		if(self.currentHeadline == "" && self.newspaper.status == undefined || self.isJustDeleted == true || self.newspaper.status == undefined
				|| self.currentHeadline == ""){
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
			article.setArticleId(self.idArticle);
			

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
		
		if(self.newspaper.julianDayNumber == null) {
			
			modalService.showAlertPublicNewspaper("data");
			
		} else {
			
			var n = apiService.updateNewspaper(scenId, self.newspaper.number, self.newspaperPut); 
			n.then(function(data){
				alertingGeneric.addSuccess("Giornale pubblicato con successo!");
				article.setIsJustDeleted(true);
				article.setIsDraft(false);
				$state.go('logged.scenario.editorial');

			}, function(reason){

				modalService.showAlertPublicNewspaper("numeroArticoli");
				console.log("Impossibile pubblicare il giornale"); 

			}
			);	
			
			
		}
		
		
	
						
	}
	
}]);
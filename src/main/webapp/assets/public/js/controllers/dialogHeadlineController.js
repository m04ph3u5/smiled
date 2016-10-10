angular.module('smiled.application').controller('dialogHeadlineCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article','$stateParams','apiService','newspaper','$rootScope',
       
                                                                  function dialogHeadlineCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams, apiService, newspaper, $rootScope){
	var self = this;
	var scenId = $stateParams.id;
	self.numberNewspaper;  
	self.idCurrentTemplate = article.getIdCurrentTemplate(); 
	var oldName = angular.copy(newspaper.name); 
	self.newspaperPost = {}; 
	self.newspaperPut = {}; 
	self.headline = {}; 
	self.headline = newspaper.name;

	 
	//set headline - creationNewspaper or update
	
    self.setHeadline = function (){
 
    	//controllo inserimento titolo valido
    if(self.headline.length<4 || self.headline == "Inserisci un titolo per il giornale"){
			alertingGeneric.addWarning("Inserire un NUOVO titolo di almeno 4 caratteri");	
		} 
			//creazione newspaper (se superato il primo controllo) prima volta
    else {
			if(self.idCurrentTemplate == "1" && oldName == CONSTANTS.insertHeadline) {
			
				self.newspaperPost.idTemplate = 1;
				self.newspaperPost.name = self.headline; 
				//inviare proprietà font al db
				article.setNameJustCreated(self.headline); 
				
				var s = apiService.createnewspaper(self.newspaperPost, scenId);
				s.then(function(data){
					 newspaper.font = self.isChecked; 
					 self.numberNewspaper = data.number; 
					 article.setNumberJustCreated(self.numberNewspaper);
					 article.setIsDraft(true); 
					 article.setIsJustDeleted(false);
					 modalService.closeModalCreateTitle(); 
					 $state.go('logged.scenario.template1');
					 alertingGeneric.addSuccess("Hai appena creato il giornale!");
					 $rootScope.$broadcast("dialogHeadlineCtrl.createNewspaper",{newspaper:data});
				 },
				 
				 function(reason){ 
					 alertingGeneric.addWarning("Non e' stato possibile creare il giornale, riprova!");
				 });
				modalService.closeModalCreateTitle(); 		
				$state.go('logged.scenario.template1');	
				
				
			} else  {
				
					self.numberNewspaper = article.getNumberJustCreated();
				 
					if(self.numberNewspaper == undefined || self.numberNewspaper == 0) {
						//update headline second time, when it's just created
						self.newspaperPut.name = self.headline; 
						//inviare proprietà font al db
							var s= apiService.updateNewspaper(scenId, newspaper.number, self.newspaperPut);
							s.then(function(data){
								 newspaper.name = self.headline;
								 newspaper.font = self.isChecked;
								 modalService.closeModalCreateTitle(); 
								 if(newspaper.status == 'DRAFT'){
									 $state.go('logged.scenario.template1');  
								 } else if (newspaper.status == 'PUBLISHED'){
									 $state.go('logged.scenario.newspublished'); 

								 }
								 	 
							 }, function(reason){
								 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
							 });
							
					} else  {
					
						self.newspaperPut.name = self.headline;
						//mandare font al db
						newspaper.font = self.isChecked; 
						
						var s= apiService.updateNewspaper(scenId, newspaper.number, self.newspaperPut);
						s.then(function(data){
							 newspaper.name = self.headline;
							 newspaper.font = self.isChecked; 
							 modalService.closeModalCreateTitle(); 
							 if(newspaper.status == 'DRAFT'){
								 $state.go('logged.scenario.template1'); 
			 
							 } else 
							if(newspaper.status == 'PUBLISHED'){ 
								$state.go('logged.scenario.newspublished'); 
								
							}
							 
						 }, function(reason){
							 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
						 });
					}
			}
			
			
    if(self.idCurrentTemplate == "2") {
		
		//creazione newspaper template 2
		article.setTitle(headline);
		modalService.closeModalCreateTitle(); 		
		$state.go('logged.scenario.template2');
			}			
		}
    
}
    		

	self.closeDialog = function (){
		self.headline = oldName; 
		$scope.$dismiss();
		
	}

	
	
}]);





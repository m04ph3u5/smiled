angular.module('smiled.application').controller('dialogHeadlineCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article','$stateParams','apiService','newspaper',
       
                                                                  function dialogHeadlineCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams, apiService, newspaper){
	var self = this;
	var scenId = $stateParams.id;
	self.numberNewspaper;  
	self.idCurrentTemplate = article.getIdCurrentTemplate(); 
	var oldName = angular.copy(newspaper.name);
	
	self.newspaper = {}; 
	self.newspaperPost = {}; 
	self.newspaperPut = {}; 
	
	self.headline = newspaper.name; 
	

	//set headline - creationNewspaper 
	
    self.setHeadline = function (){	
    	
    	//controllo inserimento titolo valido
    if(self.headline.length<4 || self.headline == '' || newspaper.name.length<4){
    		console.log("PASSO DA QUI"); 
			alertingGeneric.addWarning("Inserire un titolo di almeno 4 caratteri");	
			self.invalidTitle = true;
		} /*else if(self.headline.length>30){
			alertingGeneric.addWarning("Il nome scelto è troppo lungo, scegli una nome più corto per la testata");
			
		}*/
			//creazione newspaper prima volta
			
			if(self.idCurrentTemplate == "1" && oldName == CONSTANTS.insertHeadline) {
				self.newspaperPost.idTemplate = 1;
				self.newspaperPost.name = self.headline; 
				article.setNameJustCreated(self.headline); 
				
				var s = apiService.createnewspaper(self.newspaperPost, scenId);
				s.then(function(data){
					 newspaper.name = self.headline; 
					 self.numberNewspaper = data.number; 
					 article.setNumberJustCreated(self.numberNewspaper);
					 article.getCurrentNewspaper();
					 //console.log(self.newspaper);
					 modalService.closeModalCreateTitle(); 
					 $state.go('logged.scenario.template1');
				 },
				 

				 function(reason){ 
					 alertingGeneric.addWarning("Non e' stato possibile creare il giornale, riprova!");
				 });
				modalService.closeModalCreateTitle(); 		
				$state.go('logged.scenario.template1');	
				
				
			} else {
				
					self.numberNewspaper = article.getNumberJustCreated();
					console.log(self.numberNewspaper); 
					if(self.numberNewspaper == undefined) {
						//update headline second or more time 
						self.newspaperPut.name = self.headline; 
						self.numberNewspaper = article.getNumberNewspaper(); 
						var s= apiService.updateNewspaper(scenId,self.numberNewspaper, self.newspaperPut);
						s.then(function(data){
							 newspaper.name = self.headline;
							 modalService.closeModalCreateTitle(); 		
							 $state.go('logged.scenario.template1');
							 
						 }, function(reason){
							 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
						 });	
						
						
					} else {
						console.log(self.numberNewspaper); 
						
						self.newspaperPut.name = self.headline;
						self.newspaperPut.name = self.headline; 
						
						var s= apiService.updateNewspaper(scenId, self.numberNewspaper, self.newspaperPut);
						s.then(function(data){
							 newspaper.name = self.headline;
							 modalService.closeModalCreateTitle(); 
							 ; 
							 $state.go('logged.scenario.template1');
							 
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
    

    /*$scope.$watch('self.headline', function(newVal, oldVal){
		if(newVal) {
		if(self.headline.length<4 || self.headline.length == 0 || self.headline.length>30){
			self.invalidTitle = true; 	
			
		} 
		
		else {
			
			self.invalidTitle = false;
				
		}
		
		}
		
		
	});*/
    		

	self.closeDialog = function (){
		self.headline = oldName; 
		$scope.$dismiss();
		
	}
	
}]);





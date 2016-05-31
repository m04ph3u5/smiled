angular.module('smiled.application').controller('dialogHeadlineCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article','$stateParams','apiService',
       
                                                                  function dialogHeadlineCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams, apiService){
	var self = this;
	var scenId = $stateParams.id;
	console.log(scenId + "ID SCENARIO"); 
	self.isFirstEdit = true; 
	self.newspaper = {};
	
	self.idCurrentTemplate = article.getIdCurrentTemplate(); 
	
	
	
    self.setHeadline = function (){	
    if(self.newspaper.name.length<4 || self.newspaper.name == ''){
			
			alertingGeneric.addWarning("Inserire un titolo di almeno 4 caratteri");	
			/*self.invalidTitle = true;*/
			console.log("NO");
		} else
			
			
			if(self.idCurrentTemplate == "1") {
				self.newspaper.idTemplate = 1;

				console.log(self.newspaper); 
				
				var s= apiService.createnewspaper(self.newspaper, scenId);
				s.then(function(data){
					 alertingGeneric.addSuccess("Giornale creato");
					 modalService.closeModalCreateTitle(); 		
					 $state.go('logged.scenario.template1');	
					 
				 }, function(reason){
					 
					 alertingGeneric.addWarning("Non e' stato possibile creare il giornale, riprova!");
				 });
				
				
				
				/*article.setTitle(headline);*/
				modalService.closeModalCreateTitle(); 		
				$state.go('logged.scenario.template1');	
				
				
			}
    
    if(self.idCurrentTemplate == "2") {
		
		//creazione newspaper 
		article.setTitle(headline);
		modalService.closeModalCreateTitle(); 		
		$state.go('logged.scenario.template2');
    
			}	
			
				
				
				
			}
    

    
    
			
		
    
    
    $scope.$watch('self.headline.title', function(newVal, oldVal){
		if(newVal) {
		if(self.headline.title.length<4){
			self.invalidTitle = true; 	
			
		}
		
		else {
			
			self.invalidTitle = false;
				
		}
		
		}
		
		
	});
    		

	
	
	//se l'utente chiude la finestra cliccando su ANNULLA 
	
	self.closeDialog = function (){
		
		self.headline.title = "Assegna un nome al giornale";
		$scope.$dismiss();
		
	}
	
}]);





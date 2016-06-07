angular.module('smiled.application').controller('dialogHeadlineCtrl', ['modalService','alertingGeneric', '$state', 'CONSTANTS', '$scope', 'article','$stateParams','apiService','newspaper',
       
                                                                  function dialogHeadlineCtrl(modalService, alertingGeneric, $state, CONSTANTS, $scope, article, $stateParams, apiService, newspaper){
	var self = this;
	var scenId = $stateParams.id;
	self.numberNewspaper; 
	self.isFirstEdit = true; 
	
	self.idCurrentTemplate = article.getIdCurrentTemplate(); 
	var oldName = angular.copy(newspaper.name);
	
	self.newspaperPost = {}; 
	self.newspaperPut = {}; 
	
	self.headline = newspaper.name; 
	
    self.setHeadline = function (){	
    if(self.headline.length<4 || self.headline == ''){
		
			alertingGeneric.addWarning("Inserire un titolo di almeno 4 caratteri");	
			/*self.invalidTitle = true;*/
		} else
			
			//creazione newspaper template 1 
			
			if(self.idCurrentTemplate == "1" && oldName == "Inserisci il titolo") {
				self.newspaperPost.idTemplate = 1;
				self.newspaperPost.name = self.headline; 
				
				console.log(self.headline)
				
				var s= apiService.createnewspaper(self.newspaperPost, scenId);
				s.then(function(data){
					 newspaper.name = self.headline;
					 modalService.closeModalCreateTitle(); 
					 self.numberNewspaper = data.number; 
					 
					 self.isFirstEdit = false; 
					 $state.go('logged.scenario.template1');
					 
				 }, function(reason){
					 
					 alertingGeneric.addWarning("Non e' stato possibile creare il giornale, riprova!");
				 });
				
				modalService.closeModalCreateTitle(); 		
				$state.go('logged.scenario.template1');	
				
				
			} else {
				
				self.newspaperPut.name = self.headline; 
				
				var s= apiService.updateNewspaper(scenId, newspaper.number , self.newspaperPut);
				s.then(function(data){
					 newspaper.name = self.headline;
					 modalService.closeModalCreateTitle(); 		
					 $state.go('logged.scenario.template1');
					 
				 }, function(reason){
					 alertingGeneric.addWarning("Non e' stato possibile aggiornare il giornale, riprova");
				 });
			}
    
    if(self.idCurrentTemplate == "2") {
		
		//creazione newspaper template 2
		article.setTitle(headline);
		modalService.closeModalCreateTitle(); 		
		$state.go('logged.scenario.template2');
    
			}		
				
			}
    

    $scope.$watch('self.headline', function(newVal, oldVal){
		if(newVal) {
		if(self.headline.length<4 || self.headline.length == 0){
			self.invalidTitle = true; 	
			
		}
		
		else {
			
			self.invalidTitle = false;
				
		}
		
		}
		
		
	});
    		

	self.closeDialog = function (){
		self.headline = oldName; 
		$scope.$dismiss();
		
	}
	
}]);




